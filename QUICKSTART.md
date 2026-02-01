# SafeLanka API - Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Docker (Recommended)

```bash
# 1. Navigate to project
cd safelanka-api

# 2. Start everything with Docker
docker-compose up -d

# 3. Wait for services to be ready (~30 seconds)
docker-compose logs -f api

# 4. Access the API
# - API: http://localhost:4000
# - Docs: http://localhost:4000/docs
```

The database will be automatically migrated and seeded with sample data!

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Make sure MySQL is running locally

# 3. Update .env file with your MySQL credentials
# (Default credentials: root/change_me)

# 4. Run migrations and seeds
npm run migrate
npm run seed

# 5. Start the server
npm run dev
```

## 🧪 Test the API

### 1. Check Health

```bash
curl http://localhost:4000/api/v1/health/live
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@safelanka.lk",
    "password": "Admin@123"
  }'
```

Save the `accessToken` from the response.

### 3. Get Crime Records

```bash
curl http://localhost:4000/api/v1/crime-records \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Visit API Documentation

Open http://localhost:4000/docs in your browser for the interactive Swagger UI!

## 📧 Email Testing

Emails are sent on user registration. In development mode, you can view sent emails at:

```bash
curl http://localhost:4000/api/v1/debug/outbox
```

## 🧪 Run Tests

```bash
npm test
```

## 🛑 Stop Services

```bash
# Docker
docker-compose down

# Local
# Press Ctrl+C in the terminal running the dev server
```

## 📖 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the [Swagger UI](http://localhost:4000/docs) for all available endpoints
- Check the [tests](./tests/api.test.js) for usage examples
- Review the [database migrations](./src/db/migrations/) to understand the schema

## 🔑 Default Credentials

| Email | Password | Role | Approved |
|-------|----------|------|----------|
| admin@safelanka.lk | Admin@123 | ADMIN | Yes |
| officer2@safelanka.lk | Officer@123 | OFFICER | Yes |
| officer1@safelanka.lk | Officer@123 | OFFICER | No (needs approval) |
| analyst1@safelanka.lk | Analyst@123 | ANALYST | No (needs approval) |

## ⚡ Common Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm run migrate          # Run database migrations
npm run seed             # Seed sample data
npm test                 # Run tests

# Production
npm start                # Start production server
npm run migrate          # Run migrations
```

## 🆘 Troubleshooting

**Database connection error?**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env` file
- Ensure database `safelanka` exists: `CREATE DATABASE safelanka;`

**Port already in use?**
- Change `PORT=4000` in `.env` to another port
- Or stop the service using port 4000

**Migrations failing?**
- Delete all tables and try again
- Check MySQL version is 8.0+

## 📞 Support

Need help? Check the main README.md or contact the team!