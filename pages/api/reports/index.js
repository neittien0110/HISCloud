import { apiHandler, reportsRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getReports
});

function getReports(req, res) {
    // return reports without hashed passwords in the response
    const response = reportsRepo.getAll().map(x => omit(x, 'hash'));
    return res.status(200).json(response);
}
