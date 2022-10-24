const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';          // Quản lý chung toàn bộ các HTTP Request
import { reportsRepo, omit } from 'helpers/api';   // Quản lý thông tin tài khoản trong file data/reports.json

const { exec } = require('child_process');

const fs = require('fs') 
var path = require('path');     
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

/**
 * Khai báo các hàm callback để xử lý tinh các HTTP Method, sau khi đã được hàm @see apiHandler.js xử lý trước
 */
export default apiHandler({
    get: getFileByName,               //khi nhận được http get có url là /reports/[id] thì gọi hàm getFileByName bên dưới    
    put: execute,                    //khi nhận được http put có url là /reports/[id] thì gọi hàm execute bên dưới
});

/**
 * Trả về file pdf báo cáo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getFileByName(req, res) {
    console.log("--------------Trả về báo cáo đã có sẵn------------------------")
    
    /** Mã loại báo cáo. Ví dụ MRS00272.*/
    const FileName = req.query.id;
    process.stdout.write(`Loại báo cáo: ${FileName} \n`)
    
    /** Xác định file pdf */
    const filePath = `${publicRuntimeConfig.reportDocumentRoot}/${FileName}`;    
    process.stdout.write(`Đường dẫn: ${filePath} `)
    if (!fs.existsSync(filePath)) {
        process.stdout.write(` không tồn tại`);
        return res.status(404).json({message:`${filePath} không tồn tại`});
    }

    /** Soạn gói tin và gửi về */
    var data =fs.readFileSync(filePath);
    res.setHeader('accept-ranges', 'bytes'); 
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); 
    res.setHeader('filename',FileName);
    return res.status(200).send(data)
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

    let cmd_output = RunApp(publicRuntimeConfig.cmdHISBot + ` --tu "${fromDateTime}"  --den "${toDateTime}" --baocao "${reportCode}"`)
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