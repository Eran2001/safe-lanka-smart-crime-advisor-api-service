import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config/env.js';
import db from '../db/knex.js';

export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpires
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const storeRefreshToken = async (userId, token) => {
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);
  
  await db('refresh_tokens').insert({
    id: uuidv4(),
    user_id: userId,
    token,
    expires_at: expiresAt
  });
};

export const revokeRefreshToken = async (token) => {
  await db('refresh_tokens')
    .where({ token })
    .update({ revoked: true });
};

export const isTokenRevoked = async (token) => {
  const result = await db('refresh_tokens')
    .where({ token })
    .first();
  
  return result ? result.revoked : true;
};

export const rotateRefreshToken = async (oldToken, userId) => {
  // Revoke old token
  await revokeRefreshToken(oldToken);
  
  // Generate new token
  const newToken = signRefreshToken({ userId });
  await storeRefreshToken(userId, newToken);
  
  return newToken;
};