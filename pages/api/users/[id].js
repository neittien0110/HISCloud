const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { usersRepo, omit } from 'helpers/api';   // Quản lý thông tin tài khoản trong file data/users.json
 
export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

function getById(req, res) {
    const user = usersRepo.getById(req.query.id);

    if (!user) throw 'Không tìm thấy tài khoản';

    // Trả về thông tin tài khoản, nhưng không bao gồm mật khẩu hash
    return res.status(200).json(omit(user, 'hash'));
}

function update(req, res) {
    const user = usersRepo.getById(req.query.id);

    if (!user) throw 'Không tìm thấy tài khoản';

    // Loại bỏ phần thông tin password khỏi cấu trúc thông tin tài khoản
    const { password, ...params } = req.body;

    // validate
    if (user.username !== params.username && usersRepo.find(x => x.username === params.username))
        throw `Tài khoản đăng nhập "${params.username}" đã tồn tại!`;

    // only update hashed password if entered
    if (password) {
        user.hash = bcrypt.hashSync(password, 10);
    }

    usersRepo.update(req.query.id, params);
    return res.status(200).json({});
}

function _delete(req, res) {
    usersRepo.delete(req.query.id);
    return res.status(200).json({});
}
