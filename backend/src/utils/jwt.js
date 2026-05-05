import jwt from 'jsonwebtoken';

// Generate Access Token (short lived)
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

// Generate Refresh Token (long lived)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// Set cookies with tokens
export const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Clear cookies
export const clearTokenCookies = (res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
