// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import express from 'express';
import { v4 } from 'uuid';
import db from './utils/db.js';
import { generateTokens } from './utils/jwt.js';
import { addRefreshToken, deleteRefreshToken, deleteAllRefreshTokensForUser, findRefreshTokenById } from './utils/authServices.js';
import { findUserByName, createUserByNameAndPassword, findUserById, deleteUserById } from './utils/userServices.js'; 
import hashToken from './utils/hashToken.js';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from './middleware.js';

const app = express();

app.use(express.json());

app.post('/api/v1/game/create', (req: express.Request, res: express.Response) => {
    
});

app.post('/api/v1/auth/register', async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        res.status(400).json({ message: 'Please provide a username and password.' });;
    }

    const existingUser = await findUserByName(username);
    if (existingUser) {
        res.status(409).json({ message: 'Username already taken.' });
    }

    const user = await createUserByNameAndPassword({id: v4(),name: username, password, createdAt: new Date(Date.now())});
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshToken(jti, refreshToken, user.id);

    res.json({ accessToken, refreshToken });
});

app.post('/api/v1/auth/login', async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        res.status(400).json({ message: 'Please provide a username and password.' });
    }

    const existingUser = await findUserByName(username);
    if (!existingUser) {
        res.status(403).json({ message: 'Incorrect login credentials.' });
    }

    const validPassword = await bcrypt.compare(password , existingUser?.password as string);
    if (!validPassword) {
        res.status(403).json({ message: 'Incorrect login credentials.' });
    }
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser as User, jti);
    await addRefreshToken(jti, refreshToken, existingUser?.id as string);

    res.json({ accessToken, refreshToken });
});

app.post('/api/v1/auth/refreshTokens', async (req: express.Request, res: express.Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: 'Please provide a refresh token.' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as jwt.Secret) as jwt.JwtPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti as string);
    if (!savedRefreshToken) {
        res.sendStatus(401);
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken?.hashedToken as string) {
        res.sendStatus(401);
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.sendStatus(401);
    }

    await deleteRefreshToken(savedRefreshToken?.id as string);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user as User, jti);
    await addRefreshToken(v4(), newRefreshToken, user?.id as string);
    res.json({ accessToken, refreshToken: newRefreshToken });
});

app.delete('/api/v1/user/delete', isAuthenticated, async (req: express.Request, res: express.Response) => {
    const { userId } = req.payload;
    await deleteAllRefreshTokensForUser(userId);
    await deleteUserById(userId);
    res.json({ message: 'User successfully deleted.'})
});

app.listen(2889, () => console.log('It\'s alive'));