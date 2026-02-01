import request from 'supertest';

import app from '../src/app.js';
import db from '../src/db/knex.js';

describe('SafeLanka API Integration Tests', () => {
  let adminToken;
  let refreshToken;
  let unapprovedUserId;
  let divisionId;
  let crimeTypeId;
  let crimeRecordId;

  beforeAll(async () => {
    // Wait for DB to be ready
    await db.raw('SELECT 1');
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('Health Endpoints', () => {
    test('GET /api/v1/health/live should return 200', async () => {
      const res = await request(app).get('/api/v1/health/live');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    test('GET /api/v1/health/ready should return 200', async () => {
      const res = await request(app).get('/api/v1/health/ready');
      expect(res.status).toBe(200);
      expect(res.body.database).toBe('connected');
    });
  });

  describe('OpenAPI Documentation', () => {
    test('GET /docs.json should return OpenAPI spec', async () => {
      const res = await request(app).get('/docs.json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe('3.0.0');
      expect(res.body.info.title).toBe('SafeLanka API');
    });
  });

  describe('Auth Flow', () => {
    test('POST /api/v1/auth/register should create unapproved user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Test Officer',
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'OFFICER'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.approved).toBe(false);
      unapprovedUserId = res.body.data.user.id;
    });

    test('POST /api/v1/auth/login should fail for unapproved user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@1234'
        });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    test('POST /api/v1/auth/login should succeed for admin', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@safelanka.lk',
          password: 'Admin@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      adminToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    test('POST /api/v1/auth/refresh should return new tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      refreshToken = res.body.data.refreshToken;
    });

    test('Admin can approve user', async () => {
      const res = await request(app)
        .patch(`/api/v1/users/${unapprovedUserId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ approved: true });

      expect(res.status).toBe(200);
      expect(res.body.data.user.approved).toBe(true);
    });

    test('Approved user can now login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@1234'
        });

      expect(res.status).toBe(200);
    });

    test('POST /api/v1/auth/logout should succeed', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken });

      expect(res.status).toBe(200);
    });
  });

  describe('Divisions and Crime Types', () => {
    test('GET /api/v1/divisions should return divisions', async () => {
      const res = await request(app).get('/api/v1/divisions');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.divisions)).toBe(true);
      expect(res.body.data.divisions.length).toBeGreaterThan(0);
      divisionId = res.body.data.divisions[0].id;
    });

    test('GET /api/v1/crime-types should return crime types', async () => {
      const res = await request(app).get('/api/v1/crime-types');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.crimeTypes)).toBe(true);
      crimeTypeId = res.body.data.crimeTypes[0].id;
    });

    test('Admin can create division', async () => {
      const res = await request(app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Division',
          code: 'TES'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.division.name).toBe('Test Division');
    });
  });

  describe('Crime Records CRUD', () => {
    test('Authenticated user can create crime record', async () => {
      const res = await request(app)
        .post('/api/v1/crime-records')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          date: '2025-01-15',
          time: '14:30:00',
          divisionId,
          crimeTypeId,
          locationLat: 6.9271,
          locationLng: 79.8612,
          address: 'Test Location',
          count: 1,
          notes: 'Test crime record'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.record.id).toBeDefined();
      crimeRecordId = res.body.data.record.id;
    });

    test('GET /api/v1/crime-records should return paginated records', async () => {
      const res = await request(app)
        .get('/api/v1/crime-records?page=1&pageSize=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.pageSize).toBe(10);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/v1/crime-records/:id should return single record', async () => {
      const res = await request(app)
        .get(`/api/v1/crime-records/${crimeRecordId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.record.id).toBe(crimeRecordId);
    });

    test('PATCH /api/v1/crime-records/:id should update record', async () => {
      const res = await request(app)
        .patch(`/api/v1/crime-records/${crimeRecordId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          notes: 'Updated notes'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.record.notes).toBe('Updated notes');
    });

    test('GET /api/v1/crime-records/export.csv should return CSV', async () => {
      const res = await request(app)
        .get('/api/v1/crime-records/export.csv')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('text/csv');
    });
  });

  describe('Feedback', () => {
    test('User can create feedback', async () => {
      const res = await request(app)
        .post('/api/v1/feedback')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          rating: 5,
          category: 'usability',
          comment: 'Great platform!'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.feedback.rating).toBe(5);
    });

    test('Admin can see all feedback', async () => {
      const res = await request(app)
        .get('/api/v1/feedback')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Reports', () => {
    test('GET /api/v1/reports/summary should return summary', async () => {
      const res = await request(app)
        .get('/api/v1/reports/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.summary).toBeDefined();
      expect(Array.isArray(res.body.data.byDivision)).toBe(true);
    });

    test('GET /api/v1/reports/download.csv should return CSV', async () => {
      const res = await request(app)
        .get('/api/v1/reports/download.csv')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('text/csv');
    });

    test('GET /api/v1/reports/download.pdf should return PDF', async () => {
      const res = await request(app)
        .get('/api/v1/reports/download.pdf')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('application/pdf');
    });
  });

  describe('Blog', () => {
    test('GET /api/v1/blog should return published posts', async () => {
      const res = await request(app).get('/api/v1/blog');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Authorization', () => {
    test('Unauthenticated request should fail', async () => {
      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(401);
    });

    test('Non-admin cannot access admin endpoints', async () => {
      // Login as officer
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'officer2@safelanka.lk',
          password: 'Officer@123'
        });

      const officerToken = loginRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${officerToken}`);

      expect(res.status).toBe(403);
    });
  });
});