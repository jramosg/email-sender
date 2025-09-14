const express = require('express');
const { sendEmail } = require('../services/emailService');
const { validateEmailRequest } = require('../middleware/validation');
const emailTemplateService = require('../services/emailTemplateService');

const router = express.Router();

// Test Resend API connection endpoint
router.get('/test-connection', async (req, res) => {
  try {
    const { testConnection } = require('../services/emailService');
    const isConnected = await testConnection();
    
    res.status(200).json({
      success: true,
      message: 'Resend API connection is working',
      connected: isConnected
    });
  } catch (error) {
    console.error('Resend API connection test error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Resend API connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Connection error'
    });
  }
});

// Send email using template
router.post('/contact-form', async (req, res) => {
  try {
    const { templateName, lang, to, data, from } = req.body;

    if (!templateName || !to) {
      return res.status(400).json({
        success: false,
        message: 'templateName and to are required'
      });
    }

    // Validate template exists
    const availableTemplates = emailTemplateService.getAvailableTemplates();
    if (!availableTemplates.includes(templateName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid template name.`
      });
    }

    // Render the template
    const renderedTemplate = emailTemplateService.renderTemplate(
      templateName,
      lang, data || {}
    );
    
    const emailOptions = {
      to,
      subject: renderedTemplate.subject,
      text: renderedTemplate.text,
      html: renderedTemplate.html,
      from: from || process.env.FROM_EMAIL || "onboarding@resend.dev",
      replyTo: "jonurnieta@gmail.com",
    };

    const result = await sendEmail(emailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Template email sending error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send template email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get available templates endpoint
router.get('/templates', (req, res) => {
  try {
    const availableTemplates = emailTemplateService.getAvailableTemplates();
    
    res.status(200).json({
      success: true,
      message: 'Available templates retrieved successfully',
      templates: availableTemplates
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to get available templates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
