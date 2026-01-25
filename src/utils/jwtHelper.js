const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '1d';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

class JwtHelper {
    generateAccessToken(payload) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRATION
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRATION
        });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw error;
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch (error) {
            throw error;
        }
    }

    generateTokenPair(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken
        };
    }
}

module.exports = new JwtHelper();
