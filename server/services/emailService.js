import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailTemplates = {
  verification: (token) => ({
    subject: 'Verify Your AI Character Creator Account',
    html: `
      <h1>Welcome to AI Character Creator!</h1>
      <p>Please click the button below to verify your email address:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Verify Email
      </a>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p>${process.env.FRONTEND_URL}/verify-email?token=${token}</p>
      <p>This link will expire in 24 hours.</p>
    `
  }),
  
  welcomeAfterVerification: {
    subject: 'Welcome to AI Character Creator!',
    html: `
      <h1>Your account is verified!</h1>
      <p>Welcome to AI Character Creator. You're all set to start creating amazing characters!</p>
      <h2>Getting Started:</h2>
      <ul>
        <li>Create your first character</li>
        <li>Explore different AI models</li>
        <li>Check out our subscription plans for enhanced features</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Go to Dashboard
      </a>
    `
  },

  subscriptionChange: (planName) => ({
    subject: 'Subscription Update - AI Character Creator',
    html: `
      <h1>Your subscription has been updated</h1>
      <p>Your subscription has been successfully changed to the ${planName} plan.</p>
      <p>You now have access to all features included in your new plan.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        View Dashboard
      </a>
    `
  }),

  subscriptionCanceled: {
    subject: 'Subscription Canceled - AI Character Creator',
    html: `
      <h1>Your subscription has been canceled</h1>
      <p>We're sorry to see you go! Your subscription has been canceled.</p>
      <p>You'll continue to have access to your current features until the end of your billing period.</p>
      <p>If you change your mind, you can resubscribe at any time:</p>
      <a href="${process.env.FRONTEND_URL}/subscription" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        View Plans
      </a>
    `
  }),

  usageAlert: (usagePercentage) => ({
    subject: 'Usage Alert - AI Character Creator',
    html: `
      <h1>Usage Alert</h1>
      <p>You've used ${usagePercentage}% of your monthly character creation limit.</p>
      <p>Consider upgrading your plan to continue creating characters without interruption:</p>
      <a href="${process.env.FRONTEND_URL}/subscription" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Upgrade Plan
      </a>
    `
  })
};

class EmailService {
  static async sendEmail(to, template, data = {}) {
    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL,
        ...template
      };
      
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      return false;
    }
  }

  static generateVerificationToken(userId, email) {
    return jwt.sign(
      { userId, email, purpose: 'email-verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static async sendVerificationEmail(email, userId) {
    const token = this.generateVerificationToken(userId, email);
    return this.sendEmail(email, emailTemplates.verification(token));
  }

  static async sendWelcomeEmail(email) {
    return this.sendEmail(email, emailTemplates.welcomeAfterVerification);
  }

  static async sendSubscriptionChangeEmail(email, planName) {
    return this.sendEmail(email, emailTemplates.subscriptionChange(planName));
  }

  static async sendSubscriptionCanceledEmail(email) {
    return this.sendEmail(email, emailTemplates.subscriptionCanceled);
  }

  static async sendUsageAlertEmail(email, usagePercentage) {
    return this.sendEmail(email, emailTemplates.usageAlert(usagePercentage));
  }
}

export default EmailService;
