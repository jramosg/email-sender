const Joi = require('joi');

// Email validation schema
const emailSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email().required(),
    Joi.array().items(Joi.string().email()).min(1).required()
  ).required(),
  subject: Joi.string().min(1).max(998).required(),
  text: Joi.string().allow(''),
  html: Joi.string().allow(''),
  from: Joi.string().email().optional(),
  cc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).optional(),
  bcc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).optional(),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      content: Joi.alternatives().try(Joi.string(), Joi.binary()).required(),
      contentType: Joi.string().optional()
    })
  ).optional()
}).or('text', 'html'); // At least one of text or html must be provided

// Bulk email validation schema
const bulkEmailSchema = Joi.object({
  emails: Joi.array().items(
    Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().optional()
    })
  ).min(1).max(100).required(),
  template: Joi.object({
    subject: Joi.string().min(1).max(998).required(),
    text: Joi.string().allow(''),
    html: Joi.string().allow(''),
    from: Joi.string().email().optional()
  }).or('text', 'html').required()
});

// Middleware to validate email request
const validateEmailRequest = (req, res, next) => {
  const { error, value } = emailSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorDetails
    });
  }

  req.body = value;
  next();
};

// Middleware to validate bulk email request
const validateBulkEmailRequest = (req, res, next) => {
  const { error, value } = bulkEmailSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorDetails
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateEmailRequest,
  validateBulkEmailRequest,
  emailSchema,
  bulkEmailSchema
};
