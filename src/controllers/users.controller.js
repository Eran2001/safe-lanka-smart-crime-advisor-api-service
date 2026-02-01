import db from '../db/knex.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, approved, q } = req.query;
    const { page, pageSize, offset } = parsePagination(req.query);
    
    let query = db('users').select(
      'id', 'full_name', 'email', 'role', 'division', 
      'approved', 'avatar_url', 'created_at', 'updated_at'
    );
    
    if (role) {
      query = query.where({ role });
    }
    
    if (approved !== undefined) {
      query = query.where({ approved: approved === 'true' });
    }
    
    if (q) {
      query = query.where(function() {
        this.where('full_name', 'like', `%${q}%`)
          .orWhere('email', 'like', `%${q}%`);
      });
    }
    
    const totalQuery = query.clone();
    const total = await totalQuery.count('* as count').first();
    
    const users = await query
      .orderBy('created_at', 'desc')
      .limit(pageSize)
      .offset(offset);
    
    res.json({
      success: true,
      ...buildPaginatedResponse(users, total.count, page, pageSize)
    });
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    const user = await db('users').where({ id }).first();
    
    if (!user) {
      const error = new Error('User not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    await db('users')
      .where({ id })
      .update({ 
        approved,
        updated_at: db.fn.now()
      });
    
    const updatedUser = await db('users')
      .where({ id })
      .select('id', 'full_name', 'email', 'role', 'division', 'approved')
      .first();
    
    res.json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await db('users').where({ id }).first();
    
    if (!user) {
      const error = new Error('User not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    
    await db('users')
      .where({ id })
      .update({ 
        role,
        updated_at: db.fn.now()
      });
    
    const updatedUser = await db('users')
      .where({ id })
      .select('id', 'full_name', 'email', 'role', 'division', 'approved')
      .first();
    
    res.json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'full_name', 'email', 'role', 'division', 'approved', 'avatar_url', 'created_at')
      .first();
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { fullName, division, avatarUrl, currentPassword, newPassword } = req.body;
    
    const updates = {};
    
    if (fullName) updates.full_name = fullName;
    if (division) updates.division = division;
    if (avatarUrl) updates.avatar_url = avatarUrl;
    
    // Handle password change
    if (currentPassword && newPassword) {
      const user = await db('users').where({ id: req.user.id }).first();
      const isValid = await comparePassword(currentPassword, user.password_hash);
      
      if (!isValid) {
        const error = new Error('Current password is incorrect');
        error.code = 'AUTH_FAILED';
        throw error;
      }
      
      updates.password_hash = await hashPassword(newPassword);
      
      // Revoke all refresh tokens on password change
      await db('refresh_tokens')
        .where({ user_id: req.user.id })
        .update({ revoked: true });
    }
    
    if (Object.keys(updates).length > 0) {
      updates.updated_at = db.fn.now();
      
      await db('users')
        .where({ id: req.user.id })
        .update(updates);
    }
    
    const updatedUser = await db('users')
      .where({ id: req.user.id })
      .select('id', 'full_name', 'email', 'role', 'division', 'approved', 'avatar_url')
      .first();
    
    res.json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};