// Example usage of the Email Sender API
const API_BASE_URL = 'http://localhost:3000/api';
const logger = require('../utils/logger');

// Helper function to make HTTP requests
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    throw error;
  }
};

// Example 1: Send contact form email
const sendContactFormEmail = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/contact-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateName: 'laguntza-fisioterapia',
        to: 'recipient@example.com',
        lang: 'es',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          message: 'I need more information about your services',
          source: 'Website'
        }
      })
    });

    logger.info('Contact form email sent: %o', response.data);
  } catch (error) {
    logger.error('Error sending contact form email: %s', error.message);
  }
};

// Example 2: Get available templates
const getAvailableTemplates = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/templates`);
    logger.info('Available templates: %o', response.data);
  } catch (error) {
    logger.error('Error getting templates: %s', error.message);
  }
};

// Example 3: Test SMTP connection
const testConnection = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/test-connection`);
    logger.info('Connection test result: %o', response.data);
  } catch (error) {
    logger.error('Error testing connection: %s', error.message);
  }
};

// Example 5: Send multiple emails to different recipients
const sendMultipleEmails = async () => {
  const recipients = [
    { email: 'user1@example.com', name: 'John Doe' },
    { email: 'user2@example.com', name: 'Jane Smith' },
    { email: 'user3@example.com', name: 'Bob Johnson' }
  ];

  for (const recipient of recipients) {
    try {
      const response = await makeRequest(`${API_BASE_URL}/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateName: 'laguntza-fisioterapia',
          to: recipient.email,
          lang: 'es',
          data: {
            name: recipient.name,
            email: recipient.email,
            phone: '123-456-7890',
            message: `Personal message for ${recipient.name}`,
            source: 'API Example'
          }
        })
      });

      logger.info(
        'Contact form email sent to %s: %o',
        recipient.name,
        response.data
      );

      // Add delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error(
        'Error sending email to %s: %s',
        recipient.name,
        error.message
      );
    }
  }
};

// Run examples
const runExamples = async () => {
  logger.info('🚀 Starting Email API Examples...\n');

  logger.info('1. Testing SMTP connection...');
  await testConnection();

  logger.info('\n2. Getting available templates...');
  await getAvailableTemplates();

  logger.info('\n3. Sending contact form email...');
  await sendContactFormEmail();

  logger.info('\n4. Sending multiple contact form emails...');
  await sendMultipleEmails();

  logger.info('\n✅ All examples completed!');
};

// Uncomment the line below to run the examples
// runExamples();

module.exports = {
  sendContactFormEmail,
  getAvailableTemplates,
  testConnection,
  sendMultipleEmails
};
