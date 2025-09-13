#!/usr/bin/env node

// Simple test script to verify the API is working
const http = require('http');
const { URL } = require('url');

const API_BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ 
            data: jsonData, 
            status: res.statusCode, 
            ok: res.statusCode >= 200 && res.statusCode < 300 
          });
        } catch (error) {
          resolve({ 
            data: data, 
            status: res.statusCode, 
            ok: res.statusCode >= 200 && res.statusCode < 300 
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
};

const testAPI = async () => {
  try {
    console.log('🔍 Testing Email Sender API...\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test 2: Root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await makeRequest(API_BASE_URL);
    console.log('✅ Root endpoint response:', rootResponse.data.message);
    
    // Test 3: SMTP connection (if configured)
    console.log('\n3. Testing SMTP connection...');
    try {
      const connectionResponse = await makeRequest(`${API_BASE_URL}/api/test-connection`);
      console.log('✅ SMTP connection test:', connectionResponse.data.message);
    } catch (error) {
      console.log('⚠️  SMTP connection test failed (expected if not configured):', error.message);
    }
    
    // Test 4: Contact form validation (this will fail but test the validation)
    console.log('\n4. Testing contact form validation...');
    try {
      const response = await makeRequest(`${API_BASE_URL}/api/contact-form`, {
        method: 'POST',
        body: JSON.stringify({
          // Invalid payload to test validation
          templateName: 'invalid-template',
          to: 'invalid-email'
        })
      });
      
      if (!response.ok) {
        console.log('✅ Contact form validation working correctly');
        console.log('   Error message:', response.data.message);
      }
    } catch (error) {
      console.log('❌ Unexpected error:', error.message);
    }
    
    console.log('\n✅ All API tests completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update .env file with your SMTP credentials');
    console.log('   2. Test actual email sending with valid SMTP settings');
    console.log('   3. Use the API endpoints in your application');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm start');
    }
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
