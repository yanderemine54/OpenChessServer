// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

function generateAccessToken(user: User) {
    return jwt.sign({ userName: user.name }, process.env.JWT_ACCESS_SECRET as jwt.Secret, {
        expiresIn: '5m',
    });
}

function generateRefreshToken(user: User, jti: string) {
    return jwt.sign({
        userName: user.name,
        jti
    }, process.env.JWT_REFRESH_SECRET as jwt.Secret, {
        expiresIn: '8h',
    });
}

function generateTokens(user: User, jti: string) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
  
    return {
        accessToken,
        refreshToken,
    };
}

export {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
};