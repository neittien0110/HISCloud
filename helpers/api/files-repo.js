const fs = require('fs');

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();  /** Đọc thông số cấu hình ở file next.config.js */

// reports in JSON file for simplicity, store in a db for production applications


function GetFiles(contain_text) {
    const files = fs.readdirSync(`${publicRuntimeConfig.reportDocumentRoot}`);
    let list = []
    files.forEach(name => {
        if (name.indexOf(contain_text)>=0) {
            let pos1 = name.indexOf('_',0)+1;
            let pos2 = name.indexOf('_',pos1)+1;
            let pos3 = name.indexOf('_',pos2)+1;
            let pos4 = name.indexOf('_',pos3)+1;
            
            let fromDate = name.substring(pos1,pos2-1);
            let fromTime = name.substring(pos2,pos3-1);
            let from = new Date(fromDate.substring(0,4),fromDate.substring(4,6)-1,fromDate.substring(6,8), 
                                fromTime.substring(0,2),fromTime.substring(2,4),fromTime.substring(4,6) )

            let toDate = name.substring(pos3,pos4-1);
            let toTime = name.substring(pos4,pos4+6);
            let to = new Date(toDate.substring(0,4),toDate.substring(4,6)-1,toDate.substring(6,8), 
                              toTime.substring(0,2),toTime.substring(2,4),toTime.substring(4,6) )            
            list.push({filename:name, fromDateTime:`${from.toLocaleString()}`,toDateTime:`${to.toLocaleString()}`});
        }
    });
    return list;
}


/**
 * Quản lý tìm và trả về tên loại báo cáo ở server-side. Chỉ thuần tuý là quản lý ổ lưu trữ trên server, chưa được phủ bởi lớp webapi
 * @remark Xem các file định nghĩa WebAPI ở thư mục pages/api/reports/..
 */
export const filesRepo = {
    /** Trả về danh sách các loại báo cáo đã lưu trong file cơ sở dữ liệu */
    getAll: () => GetFiles(),
    /** Lọc ra các file có tên thoả mãn tham số đầu vào của hàm getByFilter(contain_text) */
    getByFilter: contain_text => GetFiles(contain_text),
};
