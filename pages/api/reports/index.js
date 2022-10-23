import { apiHandler, reportsRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getReports             //Khai báo webAPI dạng get
});

/**
 * WebAPI trả về danh sách
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getReports(req, res) {
    console.log("pages/api/reports/index.js/ getReports(..)")
    // return reports without hashed passwords in the response
    const response = reportsRepo.getAll().map(x => omit(x, 'hash'));
    return res.status(200).json(response);
}
