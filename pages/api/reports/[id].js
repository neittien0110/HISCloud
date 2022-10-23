const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { reportsRepo, omit } from 'helpers/api';   // Quản lý thông tin tài khoản trong file data/reports.json

const { exec } = require('child_process');

/**
 * Các cổng WebAPI đáp ứng
 */
export default apiHandler({
    get: getById,                   //khi nhận được http get có url là /reports/[id] thì gọi hàm getById bên dưới    
    put: execute,                    //khi nhận được http put có url là /reports/[id] thì gọi hàm execute bên dưới
});

function getById(req, res) {
    const report = reportsRepo.getById(req.query.id);

    if (!report) throw 'Không tìm thấy tài khoản';

    // Trả về thông tin tài khoản, nhưng không bao gồm mật khẩu hash
    return res.status(200).json({res:'tôi đang chạy. bạn đợi tí'});
}

/** 
 * Hàm serverside để xuất báo cáo 
 * @description     Kích hoạt HISBot để lấy báo cáo
*/
function execute(req, res) {
    console.log("--------------Thực thi xuất báo cáo ------------------------")
    
    /** Mã loại báo cáo. Ví dụ MRS00272.*/
    const reportCode = req.query.id;
    process.stdout.write("Loại báo cáo: " + reportCode)
    
    /** Kiểm tra với thông tin về báo cáo được lưu trong file cấu hình */
    const reportInfo = reportsRepo.getByCode(reportCode);
    if (reportInfo) {
        console.log(" , có trong db data/reports.json");
    } else {
        console.log(" , không có trong db data/reports.json");
        throw "Báo cáo không tồn tại trong db data/reports.json"
    }
    
    /** Trích ra các tham số cần thiết từ http request */
    const { fromDateTime, toDateTime, name, ...params } = req.body;
    console.log("Tham số: " + fromDateTime + " --> " + toDateTime + " | " + name);

    let cmd_output = RunApp("date /T")
    console.log("Ket quả: " + cmd_output)
    return res.status(200).json({code:reportCode, ver:"1", message:cmd_output});
}



/**
 * Thực hiện lệnh ở phía server side
 * @description     Bình thường
 * @param {*} cmd   Lệnh cần thực thi 
 */
function RunApp(cmd) {
    console.log("Chạy lệnh: " + cmd)
    var yourscript = exec(cmd,
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}