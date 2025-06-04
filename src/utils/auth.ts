// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import type { APIContext } from 'astro';
// import db from '../db/database';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
// const SALT_ROUNDS = 10;

// // Hash a password
// export async function hashPassword(password: string): Promise<string> {
//   return await bcrypt.hash(password, SALT_ROUNDS);
// }

// // Compare a password with a hash
// export async function comparePassword(password: string, hash: string): Promise<boolean> {
//   return await bcrypt.compare(password, hash);
// }

// // Generate a JWT token
// export function generateToken(user: any): string {
//   const payload = {
//     id: user.id,
//     username: user.username,
//     email: user.email,
//     role: user.role
//   };
  
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
// }

// // Verify a JWT token
// export function verifyToken(token: string): any {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// }

// // Middleware to check if user is authenticated
// export async function isAuthenticated(context: APIContext): Promise<boolean> {
//   const token = context.cookies.get('token')?.value;
  
//   if (!token) {
//     return false;
//   }
  
//   const decoded = verifyToken(token);
//   if (!decoded) {
//     return false;
//   }
  
//   return true;
// }

// // Middleware to check if user is an admin
// export async function isAdmin(context: APIContext): Promise<boolean> {
//   const token = context.cookies.get('token')?.value;
  
//   if (!token) {
//     return false;
//   }
  
//   const decoded = verifyToken(token);
//   if (!decoded || decoded.role !== 'admin') {
//     return false;
//   }
  
//   return true;
// }

// // Get current user from token
// export async function getCurrentUser(context: APIContext): Promise<any> {
//   const token = context.cookies.get('token')?.value;
  
//   if (!token) {
//     return null;
//   }
  
//   const decoded = verifyToken(token);
//   if (!decoded) {
//     return null;
//   }
  
//   try {
//     const user = await db.query('SELECT id, username, email, full_name, role, profile_image, bio FROM users WHERE id = ?', [decoded.id]);
//     return user[0] || null;
//   } catch (error) {
//     console.error('Error getting current user:', error);
//     return null;
//   }
// }

// // Login user
// export async function loginUser(username: string, password: string): Promise<any> {
//   try {
//     const users: any = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    
//     if (!users || users.length === 0) {
//       return { success: false, message: 'User not found' };
//     }
    
//     const user = users[0];
//     const passwordMatch = await comparePassword(password, user.password);
    
//     if (!passwordMatch) {
//       return { success: false, message: 'Invalid password' };
//     }
    
//     // Update last login timestamp
//     await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    
//     const token = generateToken(user);
//     return { 
//       success: true, 
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         full_name: user.full_name
//       } 
//     };
//   } catch (error) {
//     console.error('Login error:', error);
//     return { success: false, message: 'Login failed' };
//   }
// }

import jwt from 'jsonwebtoken';
import type { APIContext } from 'astro';
import db from '../db/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// --- Remove bcrypt usage ---
// const SALT_ROUNDS = 10;

// --- Removed: bcrypt.hash ---
// export async function hashPassword(password: string): Promise<string> {
//   return await bcrypt.hash(password, SALT_ROUNDS);
// }

// --- Removed: bcrypt.compare ---
// export async function comparePassword(password: string, hash: string): Promise<boolean> {
//   return await bcrypt.compare(password, hash);
// }

// Generate a JWT token
export function generateToken(user: any): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify a JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(context: APIContext): Promise<boolean> {
  const token = context.cookies.get('token')?.value;
  if (!token) return false;
  return !!verifyToken(token);
}

// Check if user is an admin
export async function isAdmin(context: APIContext): Promise<boolean> {
  const token = context.cookies.get('token')?.value;
  const decoded = token ? verifyToken(token) : null;
  return !!decoded && decoded.role === 'admin';
}

// Get current user from token
export async function getCurrentUser(context: APIContext): Promise<any> {
  const token = context.cookies.get('token')?.value;
  const decoded = token ? verifyToken(token) : null;
  if (!decoded) return null;

  try {
    const user = await db.query('SELECT id, username, email, full_name, role, profile_image, bio FROM users WHERE id = ?', [decoded.id]);
    return user[0] || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Plain-text password comparison (NOT recommended for production)
export async function loginUser(username: string, password: string): Promise<any> {
  try {
    const users: any = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, username]
    );

    if (!users || users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = users[0];

    // Direct comparison without bcrypt
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    // Update last login timestamp
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = generateToken(user);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
}
