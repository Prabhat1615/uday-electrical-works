import Invoice from '../models/Invoice.js';
import SalesOrder from '../models/SalesOrder.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get Advanced Dashboard Analytics (Recharts friendly data)
// @route   GET /api/reports/analytics
// @access  Private (Admin, Staff)
//
// Every metric below is computed from real database records. No values are
// fabricated or hardcoded. If a collection is empty, the corresponding
// metric legitimately returns 0 or an empty array - never a made-up figure.
export const getAnalyticsData = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // ------------------------------------------------------------------
    // 1. Revenue (from paid invoices only)
    // ------------------------------------------------------------------
    // Revenue is the sum of totalAmount on invoices whose paymentStatus is
    // 'Paid'. Unpaid and Partially Paid invoices are not counted as revenue.
    const invoiceAgg = await Invoice.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          thisMonth: {
            $sum: {
              $cond: [{ $gte: [{ $ifNull: ['$paidAt', '$updatedAt'] }, startOfMonth] }, '$totalAmount', 0]
            }
          },
          today: {
            $sum: {
              $cond: [{ $gte: [{ $ifNull: ['$paidAt', '$updatedAt'] }, startOfToday] }, '$totalAmount', 0]
            }
          }
        }
      }
    ]);
    const rev = invoiceAgg[0] || { total: 0, thisMonth: 0, today: 0 };

    // ------------------------------------------------------------------
    // 2. Booking status counts + technician productivity (aggregated)
    // ------------------------------------------------------------------
    // Completion rate = Completed / eligible jobs (all statuses except
    // Cancelled and Rejected, which were never performed).
    const [bookingAgg, techProductivity] = await Promise.all([
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Booking.aggregate([
        { $match: { status: 'Completed', assignedTechnician: { $ne: null } } },
        {
          $group: {
            _id: '$assignedTechnician',
            jobsCompleted: { $sum: 1 }
          }
        },
        { $sort: { jobsCompleted: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'tech'
          }
        },
        { $unwind: '$tech' },
        { $project: { name: '$tech.name', jobsCompleted: 1 } }
      ])
    ]);

    const statusCounts = { Pending: 0, Confirmed: 0, Assigned: 0, Accepted: 0, 'On The Way': 0, 'In Progress': 0, Completed: 0, Cancelled: 0, Rejected: 0 };
    bookingAgg.forEach((s) => {
      statusCounts[s._id] = s.count;
    });

    const eligibleJobs = ['Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed']
      .reduce((sum, st) => sum + statusCounts[st], 0);
    const completionRate = eligibleJobs > 0
      ? Math.round((statusCounts.Completed / eligibleJobs) * 1000) / 10
      : null;

    // Technician average ratings, merged into the productivity list
    const ratingAgg = await Review.aggregate([
      {
        $group: {
          _id: '$technician',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    const ratingMap = new Map(ratingAgg.map((r) => [String(r._id), { avgRating: Math.round(r.avgRating * 10) / 10, reviewCount: r.reviewCount }]));
    techProductivity.forEach((t) => {
      const rating = ratingMap.get(String(t._id)) || { avgRating: 0, reviewCount: 0 };
      t.avgRating = rating.avgRating;
      t.reviewCount = rating.reviewCount;
    });

    // ------------------------------------------------------------------
    // 3. Counts (users, products, reviews)
    // ------------------------------------------------------------------
    const [
      customerCount,
      approvedTechCount,
      productCount,
      lowStockCount,
      outOfStockCount,
      orderCount,
      reviewAgg,
      ratingDistribution
    ] = await Promise.all([
      User.countDocuments({ role: 'Customer' }),
      User.countDocuments({ role: 'Technician', status: 'Approved' }),
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 } }),
      Product.countDocuments({ stock: 0 }),
      SalesOrder.countDocuments({}),
      Review.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      ]),
      Review.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const reviewsTotal = reviewAgg.length ? reviewAgg[0].total : 0;
    const avgRating = reviewAgg.length ? Math.round(reviewAgg[0].avgRating * 10) / 10 : 0;
    const distMap = Object.fromEntries(ratingDistribution.map((d) => [`star${d._id}`, d.count]));
    const ratingDist = {};
    for (let star = 1; star <= 5; star++) {
      ratingDist[`star${star}`] = distMap[`star${star}`] || 0;
    }

    // ------------------------------------------------------------------
    // 4. Monthly trends for Recharts (last 6 months, real data only)
    // ------------------------------------------------------------------
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = [];
    const salesTrend = [];
    const bookingTrend = [];
    const periodStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [monthlyInvoices, monthlySales, monthlyBookings] = await Promise.all([
      Invoice.aggregate([
        { $match: { paymentStatus: 'Paid', paidAt: { $gte: periodStart } } },
        {
          $group: {
            _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      SalesOrder.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            sales: { $sum: 1 }
          }
        }
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            bookings: { $sum: 1 }
          }
        }
      ])
    ]);

    const revMap = new Map(monthlyInvoices.map((m) => [`${m._id.year}-${m._id.month}`, m.revenue]));
    const salesMap = new Map(monthlySales.map((m) => [`${m._id.year}-${m._id.month}`, m.sales]));
    const bookingMap = new Map(monthlyBookings.map((m) => [`${m._id.year}-${m._id.month}`, m.bookings]));

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      revenueTrend.push({ month: months[d.getMonth()], revenue: revMap.get(key) || 0 });
      salesTrend.push({ month: months[d.getMonth()], sales: salesMap.get(key) || 0 });
      bookingTrend.push({ month: months[d.getMonth()], bookings: bookingMap.get(key) || 0 });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          cards: {
            totalRevenue: rev.total,
            monthlyRevenue: rev.thisMonth,
            todayRevenue: rev.today,
            orderCount,
            customerCount,
            approvedTechnicianCount: approvedTechCount,
            productCount,
            lowStockCount,
            outOfStockCount,
            statusCounts,
            jobsCompleted: statusCounts.Completed,
            pendingServices: statusCounts.Pending,
            inProgressServices: statusCounts['In Progress'],
            cancelledServices: statusCounts.Cancelled,
            completionRate,
            reviewCount: reviewsTotal,
            avgRating,
            technicianProductivity: techProductivity
          },
          charts: {
            revenueTrend,
            salesTrend,
            bookingTrend,
            ratingDistribution: ratingDist
          }
        },
        'Analytics data compiled successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get Detailed Exportable Reports (CSV Data)
// @route   GET /api/reports/export/:type
// @access  Private (Admin, Staff)
export const getExportReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    let data = [];

    if (type === 'revenue' || type === 'sales') {
      data = await Invoice.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    } else if (type === 'inventory') {
      data = await Product.find().sort({ stock: 1 });
    } else if (type === 'bookings') {
      data = await Booking.find()
        .populate('customer', 'name phone')
        .populate('service', 'title category')
        .populate('assignedTechnician', 'name phone')
        .sort({ createdAt: -1 });
    } else if (type === 'technicians') {
      const techs = await User.find({ role: 'Technician' });
      for (const t of techs) {
        const completed = await Booking.countDocuments({ assignedTechnician: t._id, status: 'Completed' });
        const active = await Booking.countDocuments({ assignedTechnician: t._id, status: { $in: ['Pending', 'In Progress'] } });
        const reviews = await Review.find({ technician: t._id }).select('rating');
        const avgRating = reviews.length
          ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
          : 0;
        data.push({
          name: t.name,
          email: t.email,
          phone: t.phone,
          completedJobs: completed,
          activeJobs: active,
          reviews: reviews.length,
          avgRating
        });
      }
    }

    res.status(200).json(new ApiResponse(200, data, `${type} report generated`));
  } catch (error) {
    next(error);
  }
};
