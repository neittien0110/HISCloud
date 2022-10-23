import { errorHandler, jwtMiddleware } from 'helpers/api';

export { apiHandler };

/**
 * Xử lý thô các HTTP Request nhận được, sau đó forward lại cho các hàm callback. Server side.
 * @param {*} handler   Là tên hàm callback sẽ xử lý tinh các HTTP request, có dạng json với http_method: callback. 
 *                      Ví dụ {get: getById, put: Myupdate}
 * @returns 
 * @example   Ví dụ cách sử dụng: 
 *            import { apiHandler } from 'helpers/api';
 *            export default apiHandler({
 *               get: getById,               
 *               put: update,        
 *               delete: _delete                 
 *              });
 */
function apiHandler(handler) {
    return async (req, res) => {
        console.log("Một HTTP WebAPI Request đã xảy ra")

        /// Xác dịnh HTTP Method của gói tin Request. Viết chữ thường.
        const method = req.method.toLowerCase();

        /// Nếu HTTP Request sử dụng một HTTP Method chưa có hàm callback tương ứng thì báo không hợp lệ
        if (!handler[method])
            return res.status(405).end(`Method ${req.method} không được cho phép`);

        try {
            // global middleware
            await jwtMiddleware(req, res);

            /// Triệu gọi hàm callback để thực thi tiếp
            await handler[method](req, res);
        } catch (err) {
            // Định hướng các lỗi xảy ra thì trỏ tới 1 hàm xử lý duy nhất
            errorHandler(err, res);
        }
    }
}