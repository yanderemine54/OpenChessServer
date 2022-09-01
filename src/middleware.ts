// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import express from 'express';
import jwt from 'jsonwebtoken';

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.sendStatus(401);
    }
    const token = authorization?.split(' ')[1] as string;
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as jwt.Secret);
    req.payload = payload;
    return next();
}

export {
    isAuthenticated
};