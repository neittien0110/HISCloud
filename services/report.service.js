import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/reports`;
const reportSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('report')));

export const reportService = {
    report: reportSubject.asObservable(),
    get reportValue () { return reportSubject.value },
    getAll,
    getByCode,
    execute,
};


function getAll() {
    console.log(`${baseUrl}`)
    return fetchWrapper.get(baseUrl);
}

function getByCode(id) {
    
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function execute(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored report if the logged in report updated their own record
            if (id === reportSubject.value.id) {
                // update local storage
                const report = { ...reportSubject.value, ...params };
                localStorage.setItem('report', JSON.stringify(report));

                // publish updated report to subscribers
                reportSubject.next(report);
            }
            return x;
        });
}