// Example usage of the Email Sender API
const API_BASE_URL = 'http://localhost:3000/api';

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
    
    console.log('Contact form email sent:', response.data);
  } catch (error) {
    console.error('Error sending contact form email:', error.message);
  }
};

// Example 2: Get available templates
const getAvailableTemplates = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/templates`);
    console.log('Available templates:', response.data);
  } catch (error) {
    console.error('Error getting templates:', error.message);
  }
};

// Example 3: Test SMTP connection
const testConnection = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/test-connection`);
    console.log('Connection test result:', response.data);
  } catch (error) {
    console.error('Error testing connection:', error.message);
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
      
      console.log(`Contact form email sent to ${recipient.name}:`, response.data);
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error sending email to ${recipient.name}:`, error.message);
    }
  }
};

// Run examples
const runExamples = async () => {
  console.log('🚀 Starting Email API Examples...\n');
  
  console.log('1. Testing SMTP connection...');
  await testConnection();
  
  console.log('\n2. Getting available templates...');
  await getAvailableTemplates();
  
  console.log('\n3. Sending contact form email...');
  await sendContactFormEmail();
  
  console.log('\n4. Sending multiple contact form emails...');
  await sendMultipleEmails();
  
  console.log('\n✅ All examples completed!');
};

// Uncomment the line below to run the examples
// runExamples();

module.exports = {
  sendContactFormEmail,
  getAvailableTemplates,
  testConnection,
  sendMultipleEmails
};
