const fs = require('fs');

// reports in JSON file for simplicity, store in a db for production applications
let reports = require('data/reports.json');

/**
 * Quản lý các tài khoản người dùng ở server-side
 */
export const reportsRepo = {
    getAll: () => reports,
    getById: id => reports.find(x => x.id.toString() === id.toString()),
    find: x => reports.find(x),
    execute: id => reports.find(x => x.id.toString() === id.toString()),
};
