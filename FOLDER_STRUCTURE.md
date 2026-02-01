# SafeLanka API - Folder Structure

```bash
// For alias

npm install module-alias

"_moduleAliases": {
    "@root": ".",
    "@services": "src/services",
    "@utils": "src/utils",
},
```

```
safelanka-api/
│
├── src/                                    # Source code
│   ├── app.js                             # Express app configuration
│   ├── server.js                          # Server bootstrap & graceful shutdown
│   │
│   ├── config/                            # Configuration files
│   │   ├── env.js                         # Environment variables & validation
│   │   └── knexfile.js                    # Knex database configuration
│   │
│   ├── db/                                # Database layer
│   │   ├── knex.js                        # Knex instance
│   │   │
│   │   ├── migrations/                    # Database migrations (10 files)
│   │   │   ├── 20240101000001_create_users.js
│   │   │   ├── 20240101000002_create_refresh_tokens.js
│   │   │   ├── 20240101000003_create_divisions.js
│   │   │   ├── 20240101000004_create_crime_types.js
│   │   │   ├── 20240101000005_create_crime_records.js
│   │   │   ├── 20240101000006_create_prediction_zones.js
│   │   │   ├── 20240101000007_create_trend_points.js
│   │   │   ├── 20240101000008_create_feedback.js
│   │   │   ├── 20240101000009_create_notifications.js
│   │   │   └── 20240101000010_create_blog_posts.js
│   │   │
│   │   └── seeds/                         # Database seed files (8 files)
│   │       ├── 01_divisions.js            # 14 Sri Lankan divisions
│   │       ├── 02_crime_types.js          # 7 crime types
│   │       ├── 03_users.js                # 4 demo users (admin, officers, analyst)
│   │       ├── 04_crime_records.js        # 100+ sample crime records
│   │       ├── 05_prediction_zones.js     # Sample prediction zones
│   │       ├── 06_trend_points.js         # Sample trend data
│   │       ├── 07_notifications.js        # Sample notifications
│   │       └── 08_blog_posts.js           # 10 blog articles
│   │
│   ├── routes/                            # API routes
│   │   ├── index.js                       # Main router & health endpoints
│   │   ├── auth.routes.js                 # Authentication endpoints
│   │   ├── users.routes.js                # User management
│   │   ├── crime.routes.js                # Crime records CRUD + import/export
│   │   ├── predictions.routes.js          # Predictions & trends
│   │   └── common.routes.js               # Feedback, notifications, divisions, 
│   │                                      # crime-types, reports, blog
│   │
│   ├── controllers/                       # Business logic
│   │   ├── auth.controller.js             # Register, login, refresh, logout
│   │   ├── users.controller.js            # User CRUD & approval
│   │   ├── crime.controller.js            # Crime records with import/export
│   │   ├── predictions.controller.js      # Predictions & trends CRUD
│   │   └── common.controller.js           # Feedback, notifications, divisions,
│   │                                      # crime-types, reports, blog
│   │
│   ├── middleware/                        # Express middleware
│   │   ├── auth.js                        # JWT verification, role checks
│   │   ├── validate.js                    # express-validator wrapper
│   │   ├── error.js                       # Error handler & 404 handler
│   │   └── rateLimit.js                   # Rate limiting configs
│   │
│   ├── utils/                             # Utility functions
│   │   ├── jwt.js                         # JWT sign/verify, token rotation
│   │   ├── crypto.js                      # Password hashing with bcrypt
│   │   ├── pagination.js                  # Pagination & sorting helpers
│   │   ├── csv.js                         # CSV parsing & generation
│   │   └── pdf.js                         # PDF report generation
│   │
│   ├── email/                             # Email functionality
│   │   └── mailer.js                      # Nodemailer config & welcome email
│   │
│   └── docs/                              # API documentation
│       └── openapi.js                     # OpenAPI 3 specification
│
├── tests/                                 # Test suite
│   └── api.test.js                        # Integration tests (Jest + Supertest)
│
├── .env                                   # Environment variables (local dev)
├── .env.example                           # Environment template
├── .gitignore                             # Git ignore rules
├── .eslintrc.json                         # ESLint configuration
├── .prettierrc                            # Prettier configuration
│
├── package.json                           # Dependencies & scripts
├── Dockerfile                             # Docker image definition
├── docker-compose.yml                     # Docker Compose configuration
│
├── README.md                              # Main documentation
├── QUICKSTART.md                          # Quick start guide
└── PROJECT_SUMMARY.md                     # Completion checklist


TOTAL FILE COUNT:
├── 6  Config files (.env, package.json, docker, etc.)
├── 2  Main app files (app.js, server.js)
├── 2  Config modules (env.js, knexfile.js)
├── 10 Database migrations
├── 8  Database seeds
├── 6  Route files
├── 5  Controllers
├── 4  Middleware
├── 5  Utility modules
├── 1  Email module
├── 1  OpenAPI docs
├── 1  Test file
└── 3  Documentation files
    ──────────────────
    54 Total files
```

## 📁 Directory Breakdown

### **src/config/** - Configuration
Environment variables, database config, and app settings.

### **src/db/** - Database Layer
- **migrations/** - Schema definitions for 11 tables
- **seeds/** - Sample data for testing and development

### **src/routes/** - API Endpoints
All API routes organized by feature with validation.

### **src/controllers/** - Business Logic
Request handling and response formatting.

### **src/middleware/** - Express Middleware
Authentication, validation, error handling, rate limiting.

### **src/utils/** - Helper Functions
Reusable utilities for JWT, crypto, CSV, PDF, pagination.

### **src/email/** - Email System
Nodemailer configuration and email templates.

### **src/docs/** - Documentation
OpenAPI 3 specification for Swagger UI.

### **tests/** - Testing
Integration tests covering all major flows.

## 🗄️ Database Schema (11 Tables)

```
users
├── id (UUID, PK)
├── full_name
├── email (unique, indexed)
├── password_hash
├── role (ADMIN|OFFICER|ANALYST)
├── division
├── approved (boolean)
├── avatar_url
└── timestamps

refresh_tokens
├── id (UUID, PK)
├── user_id (FK → users)
├── token (unique)
├── expires_at
├── revoked
└── created_at

divisions
├── id (UUID, PK)
├── name (unique)
└── code (unique)

crime_types
├── id (UUID, PK)
└── name (unique)

crime_records
├── id (UUID, PK)
├── date, time
├── division_id (FK → divisions)
├── crime_type_id (FK → crime_types)
├── location_lat, location_lng
├── address
├── count
├── notes
├── created_by (FK → users)
└── timestamps
└── indexes: (date), (division_id, crime_type_id)

prediction_zones
├── id (UUID, PK)
├── division_id (FK → divisions)
├── polygon_geojson (JSON)
├── risk (LOW|MEDIUM|HIGH)
├── score
└── updated_at

trend_points
├── id (UUID, PK)
├── date
├── total
├── division_id (FK → divisions, nullable)
└── created_at

feedback
├── id (UUID, PK)
├── user_id (FK → users)
├── rating (1-5)
├── category (usability|accuracy|features|other)
├── comment
└── created_at

notifications
├── id (UUID, PK)
├── message
├── level (info|warning|critical)
└── created_at

blog_posts
├── id (UUID, PK)
├── slug (unique)
├── title
├── excerpt
├── content_md
├── author
├── published_at
└── status (draft|published)
```

## 🚀 Key Features by Directory

### Routes Layer
- **auth.routes.js** - Register, login, refresh, logout
- **users.routes.js** - User management (admin only)
- **crime.routes.js** - Crime CRUD + CSV import/export
- **predictions.routes.js** - Heatmap zones & trends
- **common.routes.js** - Feedback, notifications, divisions, crime types, reports, blog

### Controllers Layer
- **auth.controller.js** - JWT auth flow with approval check
- **users.controller.js** - User CRUD, approval, role updates
- **crime.controller.js** - Crime records with filters, pagination, import/export
- **predictions.controller.js** - Predictions & trends CRUD
- **common.controller.js** - All other features (feedback, reports, etc.)

### Middleware Layer
- **auth.js** - JWT verification, role guards (requireAuth, requireRoles)
- **validate.js** - express-validator error formatter
- **error.js** - Centralized error handler with codes
- **rateLimit.js** - Login (5/min), API (100/15min), Write (20/min) limiters

### Utils Layer
- **jwt.js** - Token signing, verification, rotation, revocation
- **crypto.js** - bcrypt password hashing (10 rounds)
- **pagination.js** - Page/limit parsing, sort handling
- **csv.js** - CSV parsing and generation
- **pdf.js** - PDF report generation with PDFKit

## 📦 Dependencies

**Production:**
- express, helmet, cors, morgan
- mysql2, knex
- jsonwebtoken, bcrypt
- express-validator, express-rate-limit
- nodemailer, pdfkit
- swagger-jsdoc, swagger-ui-express
- uuid, dotenv, winston

**Development:**
- jest, supertest
- eslint, prettier
- nodemon

---

This structure follows best practices for scalable Node.js APIs with clear separation of concerns!
