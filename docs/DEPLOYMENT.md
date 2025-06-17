# AI Character Creator SaaS - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Stripe account (for payments)
- SendGrid account (for emails)
- Domain name (for production)

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the .env file with your configuration:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb://localhost:27017/ai-character-creator

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRY=24h

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com

# AI Service (Optional)
AI_API_KEY=your_ai_service_api_key
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up the database and subscription plans:
```bash
npm run setup-stripe
```

3. Start the development servers:
```bash
npm run dev
```

This will start both the React frontend (port 3000) and Express backend (port 5000).

## Production Deployment

### Option 1: Traditional Server Deployment

1. Build the frontend:
```bash
npm run build
```

2. Serve the built files from your Express server by updating server.js:

```javascript
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../build')));

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
```

3. Start the production server:
```bash
NODE_ENV=production npm run server
```

### Option 2: Docker Deployment

1. Create a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "server"]
```

2. Build and run:
```bash
docker build -t ai-character-creator .
docker run -p 5000:5000 --env-file .env ai-character-creator
```

### Option 3: Cloud Platform Deployment

#### Heroku

1. Install Heroku CLI and login
2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Add MongoDB addon:
```bash
heroku addons:create mongolab:sandbox
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set STRIPE_SECRET_KEY=your-stripe-key
# ... set all other environment variables
```

5. Deploy:
```bash
git push heroku main
```

#### Vercel (Frontend) + Railway/Render (Backend)

Deploy frontend to Vercel and backend to Railway or Render for better performance.

## Database Setup

1. Ensure MongoDB is running and accessible
2. Run the setup script to create initial data:
```bash
npm run setup-stripe
```

This will create subscription plans in both Stripe and your database.

## Stripe Webhook Configuration

1. In your Stripe Dashboard, go to Webhooks
2. Add a new webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
4. Copy the webhook secret to your .env file

## SSL Certificate

For production, ensure you have SSL enabled:

1. Use Let's Encrypt for free SSL certificates
2. Configure your reverse proxy (Nginx/Apache) to handle SSL termination
3. Update FRONTEND_URL in .env to use https://

## Monitoring and Logs

1. Set up application monitoring (e.g., New Relic, DataDog)
2. Configure log aggregation (e.g., Winston + LogStash)
3. Set up health check endpoints
4. Monitor database performance and usage

## Security Checklist

- ✅ Use HTTPS in production
- ✅ Set secure JWT secret (32+ characters)
- ✅ Enable CORS with specific origins
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Use Stripe's webhook signature verification
- ✅ Keep dependencies updated

## Backup Strategy

1. Set up automated MongoDB backups
2. Store backups in multiple locations
3. Test backup restoration procedures
4. Document recovery processes

## Performance Optimization

1. Enable MongoDB indexing for frequently queried fields
2. Implement Redis for session caching
3. Use CDN for static assets
4. Enable gzip compression
5. Optimize database queries
6. Implement pagination for large datasets

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string in .env
   - Ensure network connectivity

2. **Stripe Webhook Failures**
   - Verify webhook secret matches
   - Check endpoint URL is accessible
   - Review webhook event types

3. **Email Delivery Issues**
   - Confirm SendGrid API key is valid
   - Check sender email is verified
   - Review SendGrid activity logs

4. **Authentication Errors**
   - Verify JWT secret is set
   - Check token expiration settings
   - Ensure frontend sends proper headers

### Logs Location

- Application logs: Check console output or configured log files
- Database logs: MongoDB log files (usually in /var/log/mongodb/)
- Web server logs: Nginx/Apache error and access logs

## Scaling Considerations

1. **Database Scaling**
   - Implement MongoDB replica sets
   - Consider sharding for large datasets
   - Use read replicas for analytics

2. **Application Scaling**
   - Use load balancers (AWS ALB, Nginx)
   - Implement horizontal pod autoscaling
   - Consider microservices architecture

3. **CDN and Caching**
   - Use CloudFront or CloudFlare
   - Implement Redis for application caching
   - Cache static assets aggressively

## Support and Maintenance

1. Set up monitoring alerts for critical issues
2. Create runbooks for common maintenance tasks
3. Schedule regular security updates
4. Plan capacity for traffic growth
5. Monitor subscription and usage metrics
