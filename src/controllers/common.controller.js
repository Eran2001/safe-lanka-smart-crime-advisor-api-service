import { v4 as uuidv4 } from 'uuid';

import db from '../db/knex.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { generateCSV } from '../utils/csv.js';
import { generateReportPDF } from '../utils/pdf.js';

// Feedback Controller
export const getFeedback = async (req, res, next) => {
  try {
    const { page, pageSize, offset } = parsePagination(req.query);
    
    let query = db('feedback as f')
      .select('f.*', 'u.full_name as user_name', 'u.email as user_email')
      .leftJoin('users as u', 'f.user_id', 'u.id');
    
    // Non-admins see only their own feedback
    if (req.user.role !== 'ADMIN') {
      query = query.where('f.user_id', req.user.id);
    }
    
    const totalQuery = query.clone();
    const total = await totalQuery.count('* as count').first();
    
    const feedback = await query
      .orderBy('f.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);
    
    res.json({
      success: true,
      ...buildPaginatedResponse(feedback, total.count, page, pageSize)
    });
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const { rating, category, comment } = req.body;
    
    const id = uuidv4();
    await db('feedback').insert({
      id,
      user_id: req.user.id,
      rating,
      category,
      comment: comment || null
    });
    
    const feedback = await db('feedback').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { feedback }
    });
  } catch (error) {
    next(error);
  }
};

// Notifications Controller
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await db('notifications')
      .orderBy('created_at', 'desc')
      .limit(50);
    
    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { message, level } = req.body;
    
    const id = uuidv4();
    await db('notifications').insert({
      id,
      message,
      level
    });
    
    const notification = await db('notifications').where({ id }).first();
    
    // Add special header for critical notifications
    if (level === 'critical') {
      res.setHeader('X-High-Risk', 'true');
    }
    
    res.status(201).json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
};

// Divisions Controller
export const getDivisions = async (req, res, next) => {
  try {
    const divisions = await db('divisions').orderBy('name');
    
    res.json({
      success: true,
      data: { divisions }
    });
  } catch (error) {
    next(error);
  }
};

export const createDivision = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    
    const id = uuidv4();
    await db('divisions').insert({ id, name, code });
    
    const division = await db('divisions').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { division }
    });
  } catch (error) {
    next(error);
  }
};

// Crime Types Controller
export const getCrimeTypes = async (req, res, next) => {
  try {
    const crimeTypes = await db('crime_types').orderBy('name');
    
    res.json({
      success: true,
      data: { crimeTypes }
    });
  } catch (error) {
    next(error);
  }
};

export const createCrimeType = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const id = uuidv4();
    await db('crime_types').insert({ id, name });
    
    const crimeType = await db('crime_types').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { crimeType }
    });
  } catch (error) {
    next(error);
  }
};

// Reports Controller
export const getSummary = async (req, res, next) => {
  try {
    const totalRecords = await db('crime_records').count('* as count').first();
    const totalCount = await db('crime_records').sum('count as sum').first();
    
    const byDivision = await db('crime_records as cr')
      .select('div.name as division')
      .sum('cr.count as count')
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .groupBy('cr.division_id', 'div.name')
      .orderBy('count', 'desc');
    
    const byCrimeType = await db('crime_records as cr')
      .select('ct.name as crime_type')
      .sum('cr.count as count')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .groupBy('cr.crime_type_id', 'ct.name')
      .orderBy('count', 'desc');
    
    res.json({
      success: true,
      data: {
        summary: {
          totalRecords: totalRecords.count,
          totalCount: totalCount.sum || 0
        },
        byDivision,
        byCrimeType
      }
    });
  } catch (error) {
    next(error);
  }
};

export const downloadCSV = async (req, res, next) => {
  try {
    const totalRecords = await db('crime_records').count('* as count').first();
    const totalCount = await db('crime_records').sum('count as sum').first();
    
    const byDivision = await db('crime_records as cr')
      .select('div.name as division')
      .sum('cr.count as count')
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .groupBy('cr.division_id', 'div.name');
    
    const csv = generateCSV(byDivision, ['division', 'count']);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const downloadPDF = async (req, res, next) => {
  try {
    const totalRecords = await db('crime_records').count('* as count').first();
    const totalCount = await db('crime_records').sum('count as sum').first();
    
    const byDivision = await db('crime_records as cr')
      .select('div.name as division')
      .sum('cr.count as count')
      .leftJoin('divisions as div', 'cr.division_id', 'div.id')
      .groupBy('cr.division_id', 'div.name')
      .orderBy('count', 'desc');
    
    const byCrimeType = await db('crime_records as cr')
      .select('ct.name as crime_type')
      .sum('cr.count as count')
      .leftJoin('crime_types as ct', 'cr.crime_type_id', 'ct.id')
      .groupBy('cr.crime_type_id', 'ct.name')
      .orderBy('count', 'desc');
    
    const data = {
      summary: {
        totalRecords: totalRecords.count,
        totalCount: totalCount.sum || 0
      },
      byDivision,
      byCrimeType
    };
    
    const pdfBuffer = await generateReportPDF(data);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// Blog Controller
export const getBlogPosts = async (req, res, next) => {
  try {
    const { page, pageSize, offset } = parsePagination(req.query);
    
    let query = db('blog_posts');
    
    // Public endpoint only shows published posts
    if (!req.user || req.user.role !== 'ADMIN') {
      query = query.where({ status: 'published' });
    }
    
    const totalQuery = query.clone();
    const total = await totalQuery.count('* as count').first();
    
    const posts = await query
      .orderBy('published_at', 'desc')
      .limit(pageSize)
      .offset(offset);
    
    res.json({
      success: true,
      ...buildPaginatedResponse(posts, total.count, page, pageSize)
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    let query = db('blog_posts').where({ slug });
    
    // Public can only see published
    if (!req.user || req.user.role !== 'ADMIN') {
      query = query.where({ status: 'published' });
    }
    
    const post = await query.first();
    
    if (!post) {
      const error = new Error('Blog post not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const { slug, title, excerpt, contentMd, author, publishedAt, status } = req.body;
    
    const id = uuidv4();
    await db('blog_posts').insert({
      id,
      slug,
      title,
      excerpt,
      content_md: contentMd,
      author,
      published_at: publishedAt,
      status: status || 'draft'
    });
    
    const post = await db('blog_posts').where({ id }).first();
    
    res.status(201).json({
      success: true,
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    
    const allowedFields = ['slug', 'title', 'excerpt', 'contentMd', 'author', 'publishedAt', 'status'];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        const dbKey = key === 'contentMd' ? 'content_md' : 
                      key === 'publishedAt' ? 'published_at' : key;
        updates[dbKey] = req.body[key];
      }
    });
    
    await db('blog_posts').where({ id }).update(updates);
    
    const post = await db('blog_posts').where({ id }).first();
    
    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('blog_posts').where({ id }).del();
    
    res.json({
      success: true,
      data: { message: 'Blog post deleted' }
    });
  } catch (error) {
    next(error);
  }
};