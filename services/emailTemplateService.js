// Email Template Service
// Manages all email templates and template rendering

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class EmailTemplateService {
  constructor() {
    this.templatesPath = path.join(__dirname, '../templates');
  }

  // Render template with data
  renderTemplate(templateName, lang, data = {}) {
    try {
      const template = this.getTemplate(templateName, lang);
      return this.interpolateTemplate(template, data);
    } catch (error) {
      throw new Error(
        `Failed to render template ${templateName}: ${error.message}`
      );
    }
  }

  // Get all available template names
  getAvailableTemplates() {
    return ['laguntza-fisioterapia'];
  }

  // Get template by name
  getTemplate(templateName, lang) {
    const templates = {
      'laguntza-fisioterapia': this.getLaguntzaFisioterapiaTemplate(lang)
    };

    if (!templates[templateName]) {
      throw new Error(`Template ${templateName} not found`);
    }

    return templates[templateName];
  }

  // Interpolate template variables
  interpolateTemplate(template, data) {
    let html = template.html;
    let text = template.text || '';
    let subject = template.subject || '';
    data.attachmentNames =
      data.attachments.map((att) => att.filename).join(', ') || '';

    // Replace variables in format {{variable}}
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key] || '');
      text = text.replace(regex, data[key] || '');
      subject = subject.replace(regex, data[key] || '');
    });

    return {
      subject,
      html,
      text
    };
  }

  // Helper function to get template file path
  getTemplatePath(templateName, lang, fileType) {
    const langCode = lang === 'eu' ? 'eu' : 'es';
    return path.join(
      this.templatesPath,
      `${templateName}/${langCode}.${fileType}`
    );
  }

  getLaguntzaFisioterapiaTemplate(lang) {
    logger.info('Generating Laguntza Fisioterapia template for lang: %s', lang);
    try {
      const templatePath = this.getTemplatePath(
        'laguntza-fisioterapia',
        lang,
        'html'
      );
      const textPath = this.getTemplatePath(
        'laguntza-fisioterapia',
        lang,
        'txt'
      );

      const html = fs.readFileSync(templatePath, 'utf8');
      const text = fs.readFileSync(textPath, 'utf8');
      return {
        subject:
          lang === 'eu'
            ? 'Zure mezua jaso dugu - Laguntza Fisioterapia'
            : 'Hemos recibido tu mensaje - Laguntza Fisioterapia',
        html: html,
        text: text
      };
    } catch (error) {
      throw new Error(
        `Failed to load Laguntza Fisioterapia template: ${error.message}`
      );
    }
  }
}

module.exports = new EmailTemplateService();
