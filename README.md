# SafeLanka API - Smart Crime Advisor Backend.

Production-ready REST API for SafeLanka crime analysis platform built with Express, MySQL, and JWT authentication.

## 🚀 Features

- **JWT Authentication** with access & refresh tokens
- **Role-based Access Control** (Admin, Officer, Analyst)
- **Crime Records Management** with CSV import/export
- **Prediction Zones & Trends** (CRUD storage)
- **Reports** with CSV/PDF export
- **Blog System** for public articles
- **User Feedback** collection
- **Real-time Notifications**
- **OpenAPI Documentation** at `/docs`
- **Comprehensive Testing** with Jest & Supertest

## 📋 Prerequisites

- Node.js 20+ LTS
- MySQL 8.0+
- npm or yarn

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
cd safelanka-api
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:4000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=safe_lanka_smart_crime_advisor_db
DB_TIMEZONE=+05:30

JWT_ACCESS_SECRET=your_long_random_secret_min_32_chars
JWT_REFRESH_SECRET=your_other_long_random_secret_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

SMTP_HOST=localhost
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
SMTP_FROM="SafeLanka <no-reply@safelanka.local>"
```

### 3. Database Setup

```bash
# Run migrations
npm run migrate

# Seed database with sample data
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## 📚 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:4000/docs
- **OpenAPI JSON**: http://localhost:4000/docs.json

## 🔑 Default Credentials

After seeding, the following users are available:

| Role | Email | Password | Approved |
|------|-------|----------|----------|
| Admin | admin@safelanka.lk | Admin@123 | ✅ Yes |
| Officer | officer1@safelanka.lk | Officer@123 | ❌ No |
| Officer | officer2@safelanka.lk | Officer@123 | ✅ Yes |
| Analyst | analyst1@safelanka.lk | Analyst@123 | ❌ No |

## 🛣️ API Endpoints

### Health
- `GET /api/v1/health/live` - Liveness check
- `GET /api/v1/health/ready` - Readiness check with DB status

### Authentication
- `POST /api/v1/auth/register` - Register new user (requires approval)
- `POST /api/v1/auth/login` - Login (approved users only)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout and revoke refresh token

### Users (Admin only)
- `GET /api/v1/users` - List users with filtering
- `PATCH /api/v1/users/:id/approve` - Approve/reject user
- `PATCH /api/v1/users/:id/role` - Update user role
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update profile

### Crime Records
- `GET /api/v1/crime-records` - List with filters & pagination
- `POST /api/v1/crime-records` - Create record (Admin/Officer)
- `GET /api/v1/crime-records/:id` - Get single record
- `PATCH /api/v1/crime-records/:id` - Update record
- `DELETE /api/v1/crime-records/:id` - Delete record
- `POST /api/v1/crime-records/import` - Import from CSV
- `GET /api/v1/crime-records/export.csv` - Export to CSV

### Predictions (CRUD storage only)
- `GET /api/v1/predictions/heatmap` - Get prediction zones
- `POST /api/v1/predictions/heatmap` - Create zone (Admin)
- `PATCH /api/v1/predictions/heatmap/:id` - Update zone
- `DELETE /api/v1/predictions/heatmap/:id` - Delete zone

### Trends
- `GET /api/v1/predictions/trends` - Get trend points
- `POST /api/v1/predictions/trends` - Create point (Admin)
- `PATCH /api/v1/predictions/trends/:id` - Update point
- `DELETE /api/v1/predictions/trends/:id` - Delete point

### Divisions & Crime Types
- `GET /api/v1/divisions` - List divisions (public)
- `POST /api/v1/divisions` - Create division (Admin)
- `GET /api/v1/crime-types` - List crime types (public)
- `POST /api/v1/crime-types` - Create crime type (Admin)

### Feedback
- `GET /api/v1/feedback` - List feedback (self or all for Admin)
- `POST /api/v1/feedback` - Submit feedback

### Notifications
- `GET /api/v1/notifications` - Get latest notifications
- `POST /api/v1/notifications` - Create notification (Admin)

### Reports
- `GET /api/v1/reports/summary` - Get summary statistics
- `GET /api/v1/reports/download.csv` - Download CSV report
- `GET /api/v1/reports/download.pdf` - Download PDF report

### Blog
- `GET /api/v1/blog` - List published posts
- `GET /api/v1/blog/:slug` - Get post by slug
- `POST /api/v1/blog` - Create post (Admin)
- `PATCH /api/v1/blog/:id` - Update post (Admin)
- `DELETE /api/v1/blog/:id` - Delete post (Admin)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/api.test.js
```

## 📝 Example Usage

### Register & Login Flow

```bash
# 1. Register new user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Test@1234",
    "role": "OFFICER"
  }'

# 2. Admin approves user
curl -X PATCH http://localhost:4000/api/v1/users/{userId}/approve \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'

# 3. Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@1234"
  }'

# 4. Use access token for authenticated requests
curl -X GET http://localhost:4000/api/v1/crime-records \
  -H "Authorization: Bearer {accessToken}"
```

### Create Crime Record

```bash
curl -X POST http://localhost:4000/api/v1/crime-records \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-20",
    "time": "14:30:00",
    "divisionId": "{divisionId}",
    "crimeTypeId": "{crimeTypeId}",
    "locationLat": 6.9271,
    "locationLng": 79.8612,
    "address": "Colombo Fort",
    "count": 1,
    "notes": "Sample incident"
  }'
```

### Export Data

```bash
# Export crime records as CSV
curl -X GET "http://localhost:4000/api/v1/crime-records/export.csv?divisionId={id}" \
  -H "Authorization: Bearer {token}" \
  -o crime_records.csv

# Download PDF report
curl -X GET http://localhost:4000/api/v1/reports/download.pdf \
  -H "Authorization: Bearer {token}" \
  -o report.pdf
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** with configurable origins
- **Rate Limiting** on authentication and write endpoints
- **JWT** with short-lived access tokens (15m) and refresh tokens (7d)
- **Bcrypt** password hashing (10 rounds)
- **Input Validation** with express-validator
- **SQL Injection Protection** via Knex parameterized queries

## 📊 Database Schema

The database includes 11 normalized tables:
- `users` - User accounts with roles
- `refresh_tokens` - JWT refresh token store
- `divisions` - Sri Lankan police divisions
- `crime_types` - Crime categories
- `crime_records` - Crime incident records
- `prediction_zones` - Heatmap prediction zones
- `trend_points` - Time series data points
- `feedback` - User feedback
- `notifications` - System notifications
- `blog_posts` - Public blog articles

## 🔄 Available Scripts

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "migrate": "knex migrate:latest",
  "migrate:rollback": "knex migrate:rollback",
  "seed": "knex seed:run",
  "test": "jest --runInBand",
  "lint": "eslint . --ext .js",
  "format": "prettier --write ."
}
```

## 🐛 Debugging

### Email Outbox (Development Only)

View sent emails in development:

```bash
curl http://localhost:4000/api/v1/debug/outbox
```

### Database Queries

Enable Knex debug mode:

```javascript
// In knexfile.js
debug: true
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets (32+ characters)
3. Enable HTTPS (set `trust proxy: 1`)
4. Configure SMTP for production emails
5. Set up proper database backups
6. Use PM2 or similar process manager
7. Configure reverse proxy (nginx/apache)

### PM2 Example

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name safelanka-api

# Configure auto-restart
pm2 startup
pm2 save
```

## 📄 License

MIT

## 👥 Support

For issues or questions, contact the SafeLanka team at support@safelanka.lk

---

Built with ❤️ for safer communities in Sri Lanka
