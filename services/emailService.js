const nodemailer = require('nodemailer');

// Create transporter with SMTP configuration
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  // Handle different SMTP providers
  if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) {
    config.service = 'gmail';
  }

  return nodemailer.createTransport(config);
};

// Send email function
const sendEmail = async (emailOptions) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailOptions.from || process.env.SMTP_USER,
      to: emailOptions.to,
      subject: emailOptions.subject,
      text: emailOptions.text,
      html: emailOptions.html
    };

    // Add additional options if provided
    if (emailOptions.cc) mailOptions.cc = emailOptions.cc;
    if (emailOptions.bcc) mailOptions.bcc = emailOptions.bcc;
    if (emailOptions.attachments) mailOptions.attachments = emailOptions.attachments;

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test SMTP connection
const testConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    throw error;
  }
};

// Send bulk emails (with rate limiting)
const sendBulkEmails = async (emailList, template) => {
  const results = [];
  const delay = 1000; // 1 second delay between emails to avoid rate limiting

  for (let i = 0; i < emailList.length; i++) {
    try {
      const recipient = emailList[i];
      const emailOptions = {
        to: recipient.email,
        subject: template.subject.replace(/{{name}}/g, recipient.name || 'Customer'),
        text: template.text.replace(/{{name}}/g, recipient.name || 'Customer'),
        html: template.html.replace(/{{name}}/g, recipient.name || 'Customer'),
        from: template.from || process.env.SMTP_USER
      };

      const result = await sendEmail(emailOptions);
      results.push({
        email: recipient.email,
        success: true,
        messageId: result.messageId
      });

      // Add delay between emails
      if (i < emailList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      results.push({
        email: emailList[i].email,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

module.exports = {
  sendEmail,
  testConnection,
  sendBulkEmails,
  createTransporter
};
