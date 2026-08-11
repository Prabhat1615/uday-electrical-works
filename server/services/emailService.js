import nodemailer from 'nodemailer';

// Create Nodemailer Transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Development Fallback: Ethereal / Simulated Logger
  return {
    sendMail: async (mailOptions) => {
      console.log('----------------------------------------------------');
      console.log('✉️  SIMULATED EMAIL SENT (Nodemailer Dev Mode):');
      console.log(`TO: ${mailOptions.to}`);
      console.log(`SUBJECT: ${mailOptions.subject}`);
      console.log('----------------------------------------------------');
      return { messageId: 'simulated-email-id-123' };
    }
  };
};

const transporter = createTransporter();

// 1. Welcome Email
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works" <no-reply@udayelectrical.com>',
      to: userEmail,
      subject: 'Welcome to Uday Electrical Works ERP Portal',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #f59e0b;">Welcome, ${userName}!</h2>
          <p>Your enterprise account has been created on the <strong>Uday Electrical Works ERP</strong> system.</p>
          <p>You can now browse products, request motor rewinding & transformer maintenance bookings, and view GST tax invoices online.</p>
          <br>
          <p style="font-size: 12px; color: #94a3b8;">Uday Electrical Works | Balanagar Industrial Area, Hyderabad</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 2. Booking Confirmation Email
export const sendBookingConfirmationEmail = async (userEmail, bookingNumber, serviceTitle, preferredDate) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Dispatch" <dispatch@udayelectrical.com>',
      to: userEmail,
      subject: `Service Booking Confirmed - ${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #38bdf8;">Booking Confirmed: ${bookingNumber}</h2>
          <p>Service Requested: <strong>${serviceTitle}</strong></p>
          <p>Scheduled Date: <strong>${preferredDate}</strong></p>
          <p>Our licensed electrical engineers will reach your plant address at the requested slot.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 3. Technician Assignment Email
export const sendBookingAssignedEmail = async (technicianEmail, technicianName, bookingNumber, timeSlot, preferredDate) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Dispatch" <dispatch@udayelectrical.com>',
      to: technicianEmail,
      subject: `New Service Job Assigned - ${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #38bdf8;">New Job Assigned, ${technicianName}!</h2>
          <p>You have been assigned service job <strong>${bookingNumber}</strong>.</p>
          <p>Scheduled Date: <strong>${preferredDate}</strong></p>
          <p>Time Slot: <strong>${timeSlot}</strong></p>
          <p>Please accept or decline the job from your Technician Portal.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 3b. Service Completed Email (includes the feedback invite — sent once per
// completed job, never repeated)
export const sendBookingCompletedEmail = async (userEmail, bookingNumber, serviceTitle) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Dispatch" <dispatch@udayelectrical.com>',
      to: userEmail,
      subject: `Service Completed - ${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #10b981;">Service Completed: ${bookingNumber}</h2>
          <p>Service: <strong>${serviceTitle}</strong></p>
          <p>Thank you for choosing Uday Electrical Works. Your service has been completed successfully.</p>
          <p style="margin-top: 18px; padding: 14px 18px; border-radius: 12px; background-color: #ff6b00; color: #ffffff; text-align: center; font-weight: bold;">
            We'd love to hear about your experience, log in to your portal and rate your service from My Service Bookings.
          </p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 4. Invoice Email
export const sendInvoiceEmail = async (userEmail, invoiceNumber, totalAmount) => {  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Billing" <billing@udayelectrical.com>',
      to: userEmail,
      subject: `GST Tax Invoice Issued - ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #10b981;">Tax Invoice ${invoiceNumber}</h2>
          <p>Total Invoice Amount: <strong>₹${totalAmount}</strong></p>
          <p>Log in to your portal dashboard to download or print your official GST tax receipt.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 4. Password Reset Email
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Auth" <auth@udayelectrical.com>',
      to: userEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #ef4444;">Reset Your Password</h2>
          <p>You requested a password reset. Use token: <strong>${resetToken}</strong></p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 5. Technician Application Received
export const sendTechnicianApplicationReceivedEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Hiring" <hiring@udayelectrical.com>',
      to: userEmail,
      subject: 'Technician Application Received - Uday Electrical Works',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #38bdf8;">Application Received, ${userName}!</h2>
          <p>Your technician application has been received and is awaiting Admin review.</p>
          <p>You will be able to sign in to the Technician Portal once your application is approved.</p>
          <br>
          <p style="font-size: 12px; color: #94a3b8;">Uday Electrical Works | Chhota Govindpur, Jamshedpur</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 6. Technician Application Approved
export const sendTechnicianApplicationApprovedEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Hiring" <hiring@udayelectrical.com>',
      to: userEmail,
      subject: 'Technician Application Approved - Uday Electrical Works',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #10b981;">Congratulations, ${userName}!</h2>
          <p>Your technician application has been approved. You can now sign in to the Technician Portal.</p>
          <br>
          <p style="font-size: 12px; color: #94a3b8;">Uday Electrical Works | Chhota Govindpur, Jamshedpur</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// 7. Technician Application Rejected
export const sendTechnicianApplicationRejectedEmail = async (userEmail, userName, reason) => {
  try {
    await transporter.sendMail({
      from: '"Uday Electrical Works Hiring" <hiring@udayelectrical.com>',
      to: userEmail,
      subject: 'Technician Application Status - Uday Electrical Works',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #ef4444;">Application Status, ${userName}</h2>
          <p>Your technician application was not approved.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <br>
          <p style="font-size: 12px; color: #94a3b8;">Uday Electrical Works | Chhota Govindpur, Jamshedpur</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};
