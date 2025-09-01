/**
 * JWT Token utilities for authentication and authorization
 */

export interface JWTPayload {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (for client-side use only)
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if expired, false if valid
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Get time until token expires
 * @param token JWT token string
 * @returns milliseconds until expiration, negative if expired
 */
export const getTimeUntilExpiry = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload) return -1;
  
  const now = Math.floor(Date.now() / 1000);
  return (payload.exp - now) * 1000;
};

/**
 * Check if token needs refresh (within 5 minutes of expiry)
 * @param token JWT token string
 * @returns true if refresh is needed
 */
export const needsRefresh = (token: string): boolean => {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  return timeUntilExpiry > 0 && timeUntilExpiry < fiveMinutes;
};

/**
 * Extract user information from JWT token
 * @param token JWT token string
 * @returns User info object or null
 */
export const extractUserInfo = (token: string) => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    issuedAt: new Date(payload.iat * 1000),
    expiresAt: new Date(payload.exp * 1000),
  };
};

/**
 * Validate JWT token format and basic structure
 * @param token JWT token string
 * @returns true if valid format
 */
export const isValidJWTFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if all parts are base64 encoded
  try {
    parts.forEach(part => atob(part));
    return true;
  } catch {
    return false;
  }
};

/**
 * Log JWT token information for debugging (without exposing sensitive data)
 * @param token JWT token string
 */
export const logTokenInfo = (token: string): void => {
  if (!isValidJWTFormat(token)) {
    console.warn('Invalid JWT token format');
    return;
  }
  
  const payload = decodeJWT(token);
  if (!payload) {
    console.warn('Could not decode JWT payload');
    return;
  }
  
  const userInfo = extractUserInfo(token);
  if (userInfo) {
    console.log('🔐 JWT Token Info:', {
      userId: userInfo.userId,
      email: userInfo.email,
      role: userInfo.role,
      issuedAt: userInfo.issuedAt.toISOString(),
      expiresAt: userInfo.expiresAt.toISOString(),
      timeUntilExpiry: getTimeUntilExpiry(token),
      needsRefresh: needsRefresh(token),
    });
  }
};
