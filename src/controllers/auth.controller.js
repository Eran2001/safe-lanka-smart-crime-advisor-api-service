import { v4 as uuidv4 } from 'uuid';

import db from '../db/knex.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { signAccessToken, signRefreshToken, storeRefreshToken, verifyRefreshToken, isTokenRevoked, rotateRefreshToken } from '../utils/jwt.js';
import { sendWelcomeEmail } from '../email/mailer.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, division } = req.body;
    
    // Check if email already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      const error = new Error('Email already registered');
      error.code = 'CONFLICT';
      throw error;
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const userId = uuidv4();
    await db('users').insert({
      id: userId,
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role: role || 'OFFICER',
      division: division || null,
      approved: false
    });
    
    // Fetch created user
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'full_name', 'email', 'role', 'division', 'approved')
      .first();
    
    // Send welcome email
    await sendWelcomeEmail({
      full_name: user.full_name,
      email: user.email,
      role: user.role
    });
    
    res.status(201).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await db('users').where({ email }).first();
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.code = 'AUTH_FAILED';
      throw error;
    }
    
    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) {
      const error = new Error('Invalid email or password');
      error.code = 'AUTH_FAILED';
      throw error;
    }
    
    // Check if approved
    if (!user.approved) {
      const error = new Error('Account pending approval');
      error.code = 'FORBIDDEN';
      throw error;
    }
    
    // Generate tokens
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    
    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);
    
    // Return tokens and user info
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          division: user.division,
          approved: user.approved,
          avatarUrl: user.avatar_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.code = 'AUTH_FAILED';
      throw error;
    }
    
    // Verify token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Check if revoked
    const revoked = await isTokenRevoked(refreshToken);
    if (revoked) {
      const error = new Error('Token has been revoked');
      error.code = 'AUTH_FAILED';
      throw error;
    }
    
    // Generate new tokens
    const newAccessToken = signAccessToken({ userId: decoded.userId });
    const newRefreshToken = await rotateRefreshToken(refreshToken, decoded.userId);
    
    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await db('refresh_tokens')
        .where({ token: refreshToken })
        .update({ revoked: true });
    }
    
    res.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  } catch (error) {
    next(error);
  }
};