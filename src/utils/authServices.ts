// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import db from './db.js';
import hashToken from './hashToken.js';

function addRefreshToken(jti: string, refreshToken: string, userId: string) {
    return db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId
        },
    });
}

function findRefreshTokenById(id: string) {
    return db.refreshToken.findUnique({
        where: {
            id,
        },
    });
}

function deleteRefreshToken(id: string) {
    return db.refreshToken.delete({
        where: {
            id
        },
    });
}

function deleteAllRefreshTokensForUser(userId: string) {
    return db.refreshToken.deleteMany({
        where: {
            userId
        }
    });
}

export {
    addRefreshToken,
    findRefreshTokenById,
    deleteRefreshToken,
    deleteAllRefreshTokensForUser
};