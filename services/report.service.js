import { BehaviorSubject, delay } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/reports`;

export const reportService = {
    getAll,
    getPDFByCode: getPDFByCode,                          // xem file pdf
    execute,                            //Thực thi xuất báo cáo
};


function getAll() {
    console.log(`${baseUrl}`)
    //Gửi HTTP Request, đồng thời trả về kết quả dưới dạng json Promiss<json>
    return fetchWrapper.get(baseUrl);
}

/**
 * Gửi HTTP request tới server để xem file pdf có sẵn
 * HTTP Response sẽ được:
 * 1. xử lý thô bởi hàm helper/fetch-wrapper.js/ handleResponse()
 * 2. xử lý tinh bởi hàm này.
 * @param {*} id 
 * @returns 
 */
function getPDFByCode(id) {
    // Gửi http request, đồng thời nhận blob dữ liệu về và xử lý tiếp
    return fetchWrapper.get(`${baseUrl}/${id}`).then (pdf_blob => {
        // Tạo ra một URL trỏ tới file dữ liệu tạm, hoặc blob
        const fileURL = URL.createObjectURL(pdf_blob);
        // Mở file pdf tạm
        window.open(fileURL);
    });
}

/**
 * Gửi yêu cầu chạy báo cáo tới WebAPI
 * @param {*} id        Mã loại báo cáo
 * @param {*} params    Các tham số của báo cáo
 * @returns 
 */
function execute(id, params) {
    console.log(`report.servce.js / execute(`+id+`,`+ JSON.stringify(params)+")")
    console.log('    put ' + `${baseUrl}/${id}` );
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            console.log("report.servce.js / execute(await)")
            // update stored report if the logged in report updated their own record
            return x;
        });
}