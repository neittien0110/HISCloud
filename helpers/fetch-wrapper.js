import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();  /** Đọc thông số cấu hình ở file next.config.js */

import { userService } from 'services';

/**
 * Các HTTP Method truy cập vào máy chủ WebAPI
 */
export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

/**
 * Gửi HTTP GET tới server
 * @param {*} url       URL phía máy chủ
 * @description  Gửi HTTP Request tới server, kèm theo token xác định phiên. 
 *               Đợi kết quả trả về thì gọi hàm handleResponse() xử lý thô kết quả, trước khi chuyển lại cho hàm khác
 * @returns Promiss chứa dữ liệu HTTP reponse ở dạng json
 */
function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)  // Bổ sung thông tin phiên
    };
    //Gửi HTTP Request, đồng thời tiền xử lý HTTP Response.
    return fetch(url, requestOptions).then(handleResponse);
}

/**
 * Gửi HTTP POST tới server
 * @param {*} url       URL phía máy chủ
 * @param {*} body      Nội dung gói tin 
 * @description  Gửi HTTP Request tới server, kèm theo token xác định phiên. 
 *               Đợi kết quả trả về thì gọi hàm handleResponse() xử lý thô kết quả, trước khi chuyển lại cho hàm khác
 * @returns Promiss chứa dữ liệu HTTP reponse ở dạng json
 */
function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },  // Bổ sung thông tin phiên
        credentials: 'include',
        body: JSON.stringify(body)
    };
    //Gửi HTTP Request, đồng thời tiền xử lý HTTP Response.
    return fetch(url, requestOptions).then(handleResponse);
}

/**
 * Gửi HTTP PUT tới server
 * @param {*} url       URL phía máy chủ
 * @param {*} body      Nội dung gói tin 
 * @description  Gửi HTTP Request tới server, kèm theo token xác định phiên. 
 *               Đợi kết quả trả về thì gọi hàm handleResponse() xử lý thô kết quả, trước khi chuyển lại cho hàm khác
 * @returns Promiss chứa dữ liệu HTTP reponse ở dạng json
 * @see   pasteimages/2022-10-22-17-37-36.png
 */
function put(url, body) {
    console.log(`helper/fetch-wrapper.js/ put(`+url+`,`+ JSON.stringify(body)+")")
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) }, // Bổ sung thông tin phiên
        body: JSON.stringify(body)
    };
    //Gửi HTTP Request, đồng thời tiền xử lý HTTP Response.
    return fetch(url, requestOptions).then(handleResponse);    
}

/**
 * Gửi HTTP DELETE tới server
 * @param {*} url       URL phía máy chủ, phải hợp lệ như đã cấu hình
 * @description  thong tin cần xoá đã nằm trong URL. Tự động đính kèm token xác định phiên. 
 *               hàm handleResponse() xử lý thô kết quả, trước khi chuyển lại cho hàm khác
 * @returns Promiss chứa dữ liệu HTTP reponse ở dạng json
 * @remark tên hơi lệch một chút vì delete là từ khoá trong javascript
 */
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)        // Bổ sung thông tin phiên
    };
    //Gửi HTTP Request, đồng thời tiền xử lý HTTP Response.
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions
/**
 * Bổ sung thông tin header chứa token của phiên cho các gói tin HTTP Request
 * @param {*} url   phải hợp lệ như đã cấu hình
 * @returns  Chuỗi kí tự token xác định phiên
 * @example  Authorization: Bearer 939435935d9f924hj9g92n30202he0
 */
function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    // Xác nhận user đã đăng nhập và có token
    const isLoggedIn = user && user.token;
    // Xác nhận url là phù hợp với cấu hình đã chỉ định
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    // Kết hợp các điều kiện hợp lệ và trả về chuỗi token
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

/**
 * Hàm callback xử lý thô các thông tin mà WebAPI trả về cho browser
 * @param {*} response      Kết quả nhận được từ server
 * @returns Promiss chứa dữ liệu dạng json
 */
function handleResponse(response) {
    return response.text().then(text => {
        console.log(`helper/fetch-wrapper.js/ handleResponse()`)
        console.log("   Nội dung http response từ webapi:" + text)
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}