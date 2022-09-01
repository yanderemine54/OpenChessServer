// Copyright (c) 2022 Yanderemine54
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import crypto from 'crypto';

function hashToken(token: string) {
    return crypto.createHash('sha512').update(token).digest('hex');
}

export default hashToken;