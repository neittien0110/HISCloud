import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/reports`;

export const reportService = {
    getAll,
    getByCode,
    execute,
};


function getAll() {
    console.log(`${baseUrl}`)
    //Gửi HTTP Request, đồng thời trả về kết quả dưới dạng json Promiss<json>
    return fetchWrapper.get(baseUrl);
}

function getByCode(id) {
    
    return fetchWrapper.get(`${baseUrl}/${id}`);
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