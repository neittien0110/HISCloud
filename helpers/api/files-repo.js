const fs = require('fs');

// reports in JSON file for simplicity, store in a db for production applications
let files = require('data/reports.json');

/**
 * Quản lý tìm và trả về tên loại báo cáo ở server-side. Chỉ thuần tuý là quản lý ổ lưu trữ trên server, chưa được phủ bởi lớp webapi
 * @remark Xem các file định nghĩa WebAPI ở thư mục pages/api/reports/..
 */
export const filesRepo = {
    /** Trả về danh sách các loại báo cáo đã lưu trong file cơ sở dữ liệu */
    getAll: () => files,
    /** Lọc ra các file có tên thoả mãn tham số đầu vào của hàm getByFilter(contain_text) */
    getByFilter: contain_text => [{filename:"MRS00.pdf",fromDateTime:123, toDateTime:456},{filename:"MRS00272.pdf",fromDateTime:123, toDateTime:456}, {filename:"MRS00272_20221024_010203_20221024_040506.pdf",fromDateTime:123, toDateTime:456}]
                        .filter(x => x.filename.indexOf(contain_text)>=0),
};
