// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import bcrypt from 'bcrypt';
import db from './db.js';
import { User } from '@prisma/client';

function findUserByName(userName: string) {
    return db.user.findUnique({
        where: {
            name: userName
        },
    });
}

function createUserByNameAndPassword(user: User) {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: user
    });
}

function findUserById(id: string) {
    return db.user.findUnique({
        where: {
            id
        }
    })
}

function deleteUserById (userId: string) {
    return db.user.deleteMany({
        where: {
            id: userId
        }
    })
}

export {
    findUserByName,
    createUserByNameAndPassword,
    findUserById,
    deleteUserById
};