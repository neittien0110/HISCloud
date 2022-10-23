const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';

import { apiHandler, usersRepo } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

export default apiHandler({
    post: authenticate
});

function authenticate(req, res) {
    
    // Trích lọc thông tin username và password từ gói http
    const { username, password } = req.body;

    // Tìm user tương ứng
    const user = usersRepo.find(u => u.username === username);

    // user và mật khẩu phải phù hợp
    if (!(user && bcrypt.compareSync(password, user.hash))) {
        throw 'Tài khoản hoặc mật khẩu không đúng';
    }

    // Tạo jwt token có thời hạn trong 7 ngày
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });
    console.log(token)

    // trả về thông tin người dùng
    return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token
    });
}
