import React, { useMemo, useState } from 'react';
import { Star, Search, MessageSquareQuote } from 'lucide-react';
import { useReviews } from '../../hooks/useErpQueries';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';

const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`w-3.5 h-3.5 ${n <= value ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
      />
    ))}
  </span>
);

export const ServiceFeedbackPage = () => {
  const { data: res, isLoading } = useReviews();
  const [query, setQuery] = useState('');
  const [starFilter, setStarFilter] = useState(0);

  const reviews = res?.data || [];

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { total: 0, avg: 0, dist: {} };
    }
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const dist = {};
    for (let i = 1; i <= 5; i++) {
      dist[i] = reviews.filter((r) => r.rating === i).length;
    }
    return {
      total: reviews.length,
      avg: (sum / reviews.length).toFixed(1),
      dist
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      if (starFilter && r.rating !== starFilter) return false;
      if (!q) return true;
      const customer = `${r.customer?.name || ''} ${r.customer?.phone || ''}`.toLowerCase();
      const tech = `${r.technician?.name || ''} ${r.technician?.phone || ''}`.toLowerCase();
      const service = r.booking?.service?.title || '';
      const bookingNumber = r.booking?.bookingNumber || '';
      const comment = (r.comment || '').toLowerCase();
      return (
        customer.includes(q) ||
        tech.includes(q) ||
        service.toLowerCase().includes(q) ||
        bookingNumber.toLowerCase().includes(q) ||
        comment.includes(q)
      );
    });
  }, [reviews, query, starFilter]);

  const starButtons = [0, 5, 4, 3, 2, 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Service Feedback</h1>
          <p className="text-sm text-text-secondary mt-1">
            Customer ratings and comments from completed service bookings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading feedback..." />
      ) : reviews.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={MessageSquareQuote}
              title="No feedback yet"
              description="When customers rate a completed service, their feedback will appear here."
            />
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardBody>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Average Rating</p>
                <p className="text-3xl font-black text-text-primary mt-1 flex items-center gap-2">
                  {stats.avg}
                  <Stars value={Math.round(stats.avg)} />
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Total Reviews</p>
                <p className="text-3xl font-black text-text-primary mt-1">{stats.total}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Rating Distribution</p>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="flex items-center gap-2 text-[11px]">
                      <span className="w-8 text-text-secondary font-medium flex items-center gap-0.5">
                        {n} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${(stats.dist[n] / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-text-muted">{stats.dist[n]}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by customer, technician, service, booking number or comment..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {starButtons.map((n) => (
                <button
                  key={n}
                  onClick={() => setStarFilter(n)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    starFilter === n
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-surface-50 border-surface-200 text-text-secondary hover:border-brand-400'
                  }`}
                >
                  {n === 0 ? 'All' : `${n}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-base font-semibold text-text-primary">All Feedback</h3>
                <span className="text-xs text-text-secondary">{filtered.length} of {reviews.length}</span>
              </div>
            </CardHeader>
            <CardBody>
              {filtered.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">No feedback matches your filters.</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((r) => (
                    <div
                      key={r._id}
                      className="p-4 rounded-xl bg-surface-50 border border-surface-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Stars value={r.rating} />
                          <span className="text-[11px] font-bold text-text-secondary">{r.rating}/5</span>
                          <span className="font-mono text-brand-600 font-semibold text-[11px]">
                            {r.booking?.bookingNumber || ''}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-text-primary">
                          {r.booking?.service?.title || 'Electrical Service'}
                        </p>
                        {r.comment && (
                          <p className="text-xs text-text-secondary">"{r.comment}"</p>
                        )}
                        <p className="text-[11px] text-text-muted">
                          Customer: {r.customer?.name || 'N/A'} {r.customer?.phone ? `(${r.customer.phone})` : ''} ·{' '}
                          Technician: {r.technician?.name || 'N/A'}
                        </p>
                      </div>
                      <span className="text-[10px] text-text-muted shrink-0">{formatDate(r.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};
