const fs = require('fs');

// reports in JSON file for simplicity, store in a db for production applications
let reports = require('data/reports.json');

/**
 * Quản lý các loại báo cáo ở server-side
 * @see 
 */
export const reportsRepo = {
    /** Trả về danh sách các loại báo cáo đã lưu trong file cơ sở dữ liệu */
    getAll: () => reports,
    /** Tìm kiếm thông tin về loại báo cáo đã lưu trong file cơ sở dữ liệu */
    getByCode: code => reports.find(x => x.code.toString() === code.toString()),
    find: x => reports.find(x),
};
