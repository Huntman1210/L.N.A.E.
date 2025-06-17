# AI Character Creator SaaS API Documentation

## Authentication

All API endpoints except `/auth/register`, `/auth/login`, `/auth/verify-email`, and `/webhooks/*` require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here"
}
```

### POST /auth/verify-email
Verify email address with token from email.

**Request Body:**
```json
{
  "token": "email-verification-token"
}
```

### GET /auth/verify
Verify JWT token validity.

**Headers:** Authorization required

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## User Profile Endpoints

### GET /users/profile
Get current user profile.

**Headers:** Authorization required

**Response:**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "subscription": {
    "plan": "pro",
    "status": "active"
  },
  "emailNotifications": {
    "newFeatures": true,
    "usageAlerts": true,
    "promotions": false
  }
}
```

### PUT /users/profile
Update user profile.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "John Smith",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "emailNotifications": {
    "newFeatures": false,
    "usageAlerts": true,
    "promotions": true
  }
}
```

## Character Endpoints

### POST /characters
Create a new character.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Aragorn",
  "description": "A ranger from the North",
  "personality": "Brave, loyal, and determined",
  "appearance": "Tall, dark-haired, weathered",
  "backstory": "Heir to the throne of Gondor",
  "skills": ["Swordsmanship", "Tracking", "Leadership"],
  "tags": ["fantasy", "hero", "ranger"]
}
```

**Response:**
```json
{
  "id": "character-id",
  "name": "Aragorn",
  "description": "A ranger from the North",
  "createdAt": "2025-06-17T10:00:00Z",
  "user": "user-id"
}
```

### GET /characters
Get user's characters.

**Headers:** Authorization required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response:**
```json
{
  "characters": [
    {
      "id": "character-id",
      "name": "Aragorn",
      "description": "A ranger from the North",
      "createdAt": "2025-06-17T10:00:00Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "totalCharacters": 1
}
```

### GET /characters/:id
Get specific character.

**Headers:** Authorization required

**Response:**
```json
{
  "id": "character-id",
  "name": "Aragorn",
  "description": "A ranger from the North",
  "personality": "Brave, loyal, and determined",
  "appearance": "Tall, dark-haired, weathered",
  "backstory": "Heir to the throne of Gondor",
  "skills": ["Swordsmanship", "Tracking", "Leadership"],
  "tags": ["fantasy", "hero", "ranger"],
  "createdAt": "2025-06-17T10:00:00Z"
}
```

## Subscription Endpoints

### GET /subscriptions/plans
Get all available subscription plans.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": "plan-id",
    "name": "basic",
    "displayName": "Basic Plan",
    "price": 999,
    "currency": "USD",
    "features": {
      "charactersPerMonth": 20,
      "apiCallsPerMonth": 500,
      "maxImageOutputs": 2
    }
  }
]
```

### GET /subscriptions/current
Get current user subscription.

**Headers:** Authorization required

**Response:**
```json
{
  "subscription": {
    "plan": {
      "name": "pro",
      "displayName": "Professional Plan"
    },
    "status": "active",
    "currentPeriodEnd": "2025-07-17T10:00:00Z"
  }
}
```

### POST /subscriptions/create-checkout-session
Create Stripe checkout session.

**Headers:** Authorization required

**Request Body:**
```json
{
  "priceId": "stripe-price-id",
  "planId": "plan-id"
}
```

**Response:**
```json
{
  "sessionUrl": "https://checkout.stripe.com/session-url"
}
```

## Usage Analytics Endpoints

### GET /usage/current
Get current month usage statistics.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "_id": "character_creation",
    "count": 15,
    "avgExecutionTime": 1200,
    "successRate": 0.95
  },
  {
    "_id": "api_call",
    "count": 350,
    "avgExecutionTime": 800,
    "successRate": 0.98
  }
]
```

### GET /usage/analytics
Get usage analytics over time.

**Headers:** Authorization required

**Query Parameters:**
- `period`: "last7days" | "last30days" | "last90days"

**Response:**
```json
[
  {
    "_id": "2025-06-17",
    "usage": [
      {
        "type": "character_creation",
        "count": 3
      },
      {
        "type": "api_call",
        "count": 25
      }
    ],
    "totalCount": 28
  }
]
```

### GET /usage/limits
Check remaining usage for current billing period.

**Headers:** Authorization required

**Response:**
```json
{
  "characterCreation": true,
  "apiCalls": true
}
```

## Webhook Endpoints

### POST /webhooks/stripe
Handle Stripe webhook events.

**Headers:**
- `stripe-signature`: Stripe webhook signature

**Request Body:** Raw Stripe webhook payload

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "message": "Character creation limit reached for your current plan",
  "upgrade": true
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

## Rate Limiting

API requests are rate limited to:
- 100 requests per 15 minutes for authenticated users
- 20 requests per 15 minutes for unauthenticated endpoints

When rate limit is exceeded:
```json
{
  "message": "Too many requests, please try again later"
}
```
