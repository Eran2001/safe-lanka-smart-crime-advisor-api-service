import nodemailer from 'nodemailer';

import { config } from '../config/env.js';

// In-memory outbox for debugging (dev only)
export const emailOutbox = [];

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: config.smtp.user ? {
    user: config.smtp.user,
    pass: config.smtp.pass
  } : undefined
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: config.smtp.from,
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Store in debug outbox
    if (config.env === 'development') {
      emailOutbox.unshift({
        ...mailOptions,
        messageId: info.messageId,
        sentAt: new Date()
      });
      
      // Keep only last 50
      if (emailOutbox.length > 50) {
        emailOutbox.pop();
      }
    }
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Fail gracefully - don't throw
    return null;
  }
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to SafeLanka – Smart Crime Advisor';
  
  const text = `Dear ${user.full_name},

Welcome to SafeLanka – Smart Crime Advisor!

Thank you for joining our platform. Your account has been created successfully.

Email: ${user.email}
Role: ${user.role}

Your account is currently pending approval. Once approved by an administrator, you will receive another email and will be able to log in to the system.

SafeLanka helps law enforcement and analysts make data-driven decisions to improve public safety across Sri Lanka.

If you have any questions, please don't hesitate to reach out.

Best regards,
The SafeLanka Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to SafeLanka</h1>
    </div>
    <div class="content">
      <p>Dear ${user.full_name},</p>
      <p>Thank you for joining our platform. Your account has been created successfully.</p>
      <p><strong>Email:</strong> ${user.email}<br>
      <strong>Role:</strong> ${user.role}</p>
      <p>Your account is currently pending approval. Once approved by an administrator, you will receive another email and will be able to log in to the system.</p>
      <p>SafeLanka helps law enforcement and analysts make data-driven decisions to improve public safety across Sri Lanka.</p>
      <p>If you have any questions, please don't hesitate to reach out.</p>
      <p>Best regards,<br>The SafeLanka Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} SafeLanka. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail(user.email, subject, text, html);
};