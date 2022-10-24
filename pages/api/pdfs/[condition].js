import { apiHandler, filesRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getFilesByName             //Khai báo webAPI dạng get
});

/**
 * WebAPI trả về danh sách các file
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getFilesByName(req, res) {
    /// Xác định mã của báo cáo
    const reportCode = req.query.condition
    console.log(`pages/api/pdfs/[condition].js/ getFiles(${reportCode})`)

    /// Gửi lên server và lấy về các file có tên phù hợp
    const response = filesRepo.getByFilter(reportCode);
    console.log("  HTTP reponse: " + JSON.stringify(response));
    return res.status(200).json(response);
}
