# Email Sender API

A secure Node.js REST API for sending templated emails via SMTP, designed specifically for contact form submissions and automated email notifications.

## 🚀 Features

- **Template-based emails** - Pre-designed HTML/text email templates
- **Multi-language support** - Templates available in multiple languages (ES/EU)
- **SMTP integration** - Send emails via any SMTP provider (Gmail, Outlook, etc.)
- **Input validation** - Robust validation with Joi
- **Smart rate limiting** - Environment-aware rate limiting (stricter in production)
- **Security first** - CORS, Helmet, and security headers
- **Health monitoring** - Built-in health check endpoints
- **Environment-based config** - Easy deployment across environments

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-sender
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your SMTP settings
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Gmail Setup

1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `SMTP_PASS`

### Other SMTP Providers

- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Configure your provider's settings

## 📋 API Endpoints

### Health Check
`GET /health`

Returns server status and uptime.

```json
{
  "status": "ok",
  "timestamp": "2025-09-13T10:30:00.000Z",
  "uptime": 3600.123
}
```

### Test SMTP Connection
`GET /api/test-connection`

Verifies SMTP configuration without sending emails.

```json
{
  "success": true,
  "message": "SMTP connection is working",
  "connected": true
}
```

### Send Contact Form Email
`POST /api/contact-form`

Sends a templated email based on contact form data.

**Request:**
```json
{
  "templateName": "laguntza-fisioterapia",
  "to": "customer@example.com",
  "lang": "es",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "message": "I need more information about your services",
    "source": "Website"
  },
  "from": "noreply@yourdomain.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template email sent successfully",
  "messageId": "123456789@smtp.gmail.com",
  "template": "laguntza-fisioterapia"
}
```

### Get Available Templates
`GET /api/templates`

Returns list of available email templates.

```json
{
  "success": true,
  "message": "Available templates retrieved successfully",
  "templates": ["laguntza-fisioterapia"]
}
```

## 📧 Email Templates

### Template Structure

Templates are organized by name and language:
```
templates/
├── laguntza-fisioterapia/
│   ├── es.html    # Spanish HTML template
│   ├── es.txt     # Spanish text template
│   ├── eu.html    # Basque HTML template
│   └── eu.txt     # Basque text template
```

### Template Variables

Templates support variable interpolation using `{{variable}}` syntax:

- `{{name}}` - Customer name
- `{{email}}` - Customer email
- `{{phone}}` - Customer phone
- `{{message}}` - Customer message
- `{{source}}` - How they found you

### Adding New Templates

1. Create a new folder in `templates/`
2. Add HTML and text files for each language
3. Update `emailTemplateService.js` to include the new template
4. Add template logic in `getAvailableTemplates()`

## 🔒 Security & Rate Limiting

### Development Environment
- **Rate limit**: 100 requests per 15 minutes per IP

### Production Environment
- **Primary limit**: 2 requests per minute per IP
- **Secondary limit**: 5 requests per hour per IP
- Both limits are enforced simultaneously

### Security Features
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Environment-based error messaging

## 🧪 Testing

### Manual Testing

Use the included `requests.http` file with your HTTP client:

```http
POST http://localhost:3000/api/contact-form
Content-Type: application/json

{
  "templateName": "laguntza-fisioterapia",
  "to": "test@example.com",
  "lang": "es",
  "data": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123456789",
    "message": "Test message",
    "source": "Website"
  }
}
```

### Automated Testing

Run the test script:
```bash
node test-api.js
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production SMTP settings
3. Set appropriate `ALLOWED_ORIGINS`
4. Ensure secure SMTP credentials

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📁 Project Structure

```
email-sender/
├── routes/
│   └── email.js          # API routes
├── services/
│   ├── emailService.js   # SMTP service
│   └── emailTemplateService.js # Template management
├── middleware/
│   └── validation.js     # Input validation
├── templates/
│   └── laguntza-fisioterapia/ # Email templates
├── examples/
│   └── usage.js         # Usage examples
├── server.js            # Main application
├── requests.http        # HTTP test requests
└── test-api.js         # API test script
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Check the `API_TESTING.md` for detailed testing examples
- Review `examples/usage.js` for implementation patterns
- Use the health check endpoint to verify configuration
