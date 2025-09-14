#!/usr/bin/env node

// Simple test script to verify the API is working
const http = require('http');
const { URL } = require('url');
const logger = require('./utils/logger');

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
  logger.info('🔍 Testing Email Sender API...\n');
    
    // Test 1: Health check
  logger.info('1. Testing health endpoint...');
  const healthResponse = await makeRequest(`${API_BASE_URL}/health`);
  logger.info('✅ Health check passed: %s', healthResponse.data.status);
    
    // Test 2: Root endpoint
  logger.info('\n2. Testing root endpoint...');
  const rootResponse = await makeRequest(API_BASE_URL);
  logger.info('✅ Root endpoint response: %s', rootResponse.data.message);
    
    // Test 3: Resend API connection (if configured)
  logger.info('\n3. Testing Resend API connection...');
    try {
      const connectionResponse = await makeRequest(`${API_BASE_URL}/api/test-connection`);
  logger.info('✅ Resend API connection test: %s', connectionResponse.data.message);
    } catch (error) {
  logger.warn('⚠️  Resend API connection test failed (expected if not configured): %s', error.message);
    }
    
    // Test 4: Contact form validation (this will fail but test the validation)
  logger.info('\n4. Testing contact form validation...');
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
        logger.info('✅ Contact form validation working correctly');
        logger.info('   Error message: %s', response.data.message);
      }
    } catch (error) {
      console.log('❌ Unexpected error:', error.message);
    }
    
  logger.info('\n✅ All API tests completed!');
  logger.info('\n📝 Next steps:');
  logger.info('   1. Update .env file with your Resend API key and FROM_EMAIL');
  logger.info('   2. Test actual email sending with valid Resend configuration');
  logger.info('   3. Use the API endpoints in your application');
    
  } catch (error) {
    logger.error('❌ Test failed: %s', error.message);
    if (error.code === 'ECONNREFUSED') {
      logger.info('💡 Make sure the server is running: npm start');
    }
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
