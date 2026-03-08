import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Fallback to mailtrap or mock
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'mock-user',
      pass: process.env.SMTP_PASSWORD || 'mock-password',
    },
  });

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || 'Catchy Shop'} <${process.env.FROM_EMAIL || 'noreply@catchyshop.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || `<p>${options.message}</p>`,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email: ', error);
    // Even if it fails, maybe return false without crashing if no real credentials present
    return false;
  }
};
