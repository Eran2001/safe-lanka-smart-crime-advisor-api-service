import { v4 as uuidv4 } from 'uuid';

import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const traceId = uuidv4();
  
  // Log error with trace ID
  console.error(`[${traceId}] Error:`, err);
  
  // Known error types
  if (err.code === 'VALIDATION_ERROR') {
    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || []
      }
    });
  }
  
  if (err.code === 'AUTH_FAILED') {
    return res.status(401).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  if (err.code === 'FORBIDDEN') {
    return res.status(403).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  if (err.code === 'NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  if (err.code === 'CONFLICT') {
    return res.status(409).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  if (err.code === 'RATE_LIMITED') {
    return res.status(429).json({
      success: false,
      error: {
        code: err.code,
        message: err.message || 'Too many requests'
      }
    });
  }
  
  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Duplicate entry'
      }
    });
  }
  
  // Default 500 error
  const response = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
      traceId
    }
  };
  
  // Include stack trace in development
  if (config.env === 'development') {
    response.error.stack = err.stack;
  }
  
  res.status(500).json(response);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
};