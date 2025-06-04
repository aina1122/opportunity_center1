import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getByField } from './db.js';

// Generate JWT token
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'your_super_secret_key_change_in_production', 
    { expiresIn: '1d' }
  );
}

// Verify password
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Authentication middleware
export async function authenticate(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_super_secret_key_change_in_production'
    );
    
    // Get user from database to ensure they still exist and have correct permissions
    const user = await getByField('users', 'id', decoded.id);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Authorization middleware - checks if user has required role
export function authorize(user, requiredRole = 'admin') {
  if (!user) return false;
  
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return false;
  }
  
  if (requiredRole === 'editor' && !['admin', 'editor'].includes(user.role)) {
    return false;
  }
  
  return true;
}

export default {
  generateToken,
  verifyPassword,
  hashPassword,
  authenticate,
  authorize
};