const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { reportsRepo, omit } from 'helpers/api';   // Quản lý thông tin tài khoản trong file data/reports.json
 
export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

function getById(req, res) {
    const report = reportsRepo.getById(req.query.id);

    if (!report) throw 'Không tìm thấy tài khoản';

    // Trả về thông tin tài khoản, nhưng không bao gồm mật khẩu hash
    return res.status(200).json(omit(report, 'hash'));
}

function update(req, res) {
    const report = reportsRepo.getById(req.query.id);

    if (!report) throw 'Không tìm thấy tài khoản';

    // Loại bỏ phần thông tin password khỏi cấu trúc thông tin tài khoản
    const { password, ...params } = req.body;

    // validate
    if (report.reportname !== params.reportname && reportsRepo.find(x => x.reportname === params.reportname))
        throw `Tài khoản đăng nhập "${params.reportname}" đã tồn tại!`;

    // only update hashed password if entered
    if (password) {
        report.hash = bcrypt.hashSync(password, 10);
    }

    reportsRepo.update(req.query.id, params);
    return res.status(200).json({});
}


