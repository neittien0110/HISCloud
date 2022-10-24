import { BehaviorSubject, delay } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/pdfs`;

export const pdfService = {
    getByName: getFilesByName,
};


function getFilesByName(condition) {
    console.log(`${baseUrl}/${condition}`)
    //Gửi HTTP Request, đồng thời trả về kết quả dưới dạng json Promiss<json>
    return fetchWrapper.get(`${baseUrl}/${condition}`);
}