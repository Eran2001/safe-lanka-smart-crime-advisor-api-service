import { verifyAccessToken } from '../utils/jwt.js';
import db from '../db/knex.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'No authentication token provided'
        }
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    // Fetch user from database
    const user = await db('users')
      .where({ id: decoded.userId })
      .first();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'User not found'
        }
      });
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      approved: user.approved
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_FAILED',
        message: error.message || 'Invalid token'
      }
    });
  }
};

export const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'Not authenticated'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
    
    next();
  };
};

export const requireApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_FAILED',
        message: 'Not authenticated'
      }
    });
  }
  
  if (!req.user.approved) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Account not approved yet'
      }
    });
  }
  
  next();
};