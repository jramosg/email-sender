const { Resend } = require('resend');
const logger = require('../utils/logger');

// Initialize Resend client
let resend = null;

// Send email function
const sendEmail = async (emailOptions) => {
  resend = resend || new Resend(process.env.RESEND_API_KEY);
  try {
    if (!resend) {
      throw new Error(
        'Resend client not initialized. Please check your RESEND_API_KEY environment variable.'
      );
    }

    // Prepare recipients array
    const originalTo = Array.isArray(emailOptions.to)
      ? emailOptions.to
      : [emailOptions.to];
    const recipientList = [...originalTo];

    // Always add company email if configured
    if (
      process.env.COMPANY_EMAIL &&
      !recipientList.includes(process.env.COMPANY_EMAIL)
    ) {
      recipientList.push(process.env.COMPANY_EMAIL);
    }

    const emailData = {
      from:
        emailOptions.from || process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: recipientList,
      subject: emailOptions.subject,
      html: emailOptions.html,
      replyTo: recipientList
    };

    // Add text version if provided
    if (emailOptions.text) {
      emailData.text = emailOptions.text;
    }

    // Add CC if provided
    if (emailOptions.cc) {
      emailData.cc = Array.isArray(emailOptions.cc)
        ? emailOptions.cc
        : [emailOptions.cc];
    }

    // Add BCC if provided
    const bccList = [];
    if (emailOptions.bcc) {
      const originalBcc = Array.isArray(emailOptions.bcc)
        ? emailOptions.bcc
        : [emailOptions.bcc];
      bccList.push(...originalBcc);
    }

    // Always add configured BCC emails if set (supports comma-separated)
    if (process.env.BCC_EMAIL) {
      const envBccEmails = process.env.BCC_EMAIL.split(',')
        .map((email) => email.trim())
        .filter((email) => email);
      envBccEmails.forEach((email) => {
        if (!bccList.includes(email)) {
          bccList.push(email);
        }
      });
    }

    if (bccList.length > 0) {
      emailData.bcc = bccList;
    }

    // Add attachments if provided (Resend format)
    if (emailOptions.attachments) {
      emailData.attachments = emailOptions.attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType || 'application/octet-stream'
      }));
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      logger.error('Resend error: %o', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    logger.info('Email sent: %s', data.id);
    return {
      success: true,
      messageId: data.id,
      response: data
    };
  } catch (error) {
    logger.error('Error sending email: %o', error);
    throw error;
  }
};

// Test Resend API connection
const testConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    if (!resend) {
      throw new Error('Resend client not initialized');
    }

    logger.info('Resend API key is configured and client initialized');
    return true;
  } catch (error) {
    logger.error('Resend API verification failed: %o', error);
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
        subject: template.subject.replace(
          /{{name}}/g,
          recipient.name || 'Customer'
        ),
        text: template.text
          ? template.text.replace(/{{name}}/g, recipient.name || 'Customer')
          : undefined,
        html: template.html.replace(/{{name}}/g, recipient.name || 'Customer'),
        from:
          template.from || process.env.FROM_EMAIL || 'onboarding@resend.dev',
        attachments: data.attachments || undefined
        // Note: Company email and BCC will be automatically added by sendEmail function
      };

      const result = await sendEmail(emailOptions);
      results.push({
        email: recipient.email,
        success: true,
        messageId: result.messageId
      });

      // Add delay between emails
      if (i < emailList.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
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
  sendBulkEmails
};
