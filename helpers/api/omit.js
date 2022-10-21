export { omit };

/**
 *  Loại bỏ trường thông tin khỏi một đối tượng nào đó
 * @param {*} obj   Đối tượng cần loại bỏ trường thông tin. Ví dụ {"name":"abc","password":"123"}
 * @param {*} key   Tên trường thông tin cần loại. Ví dụ "password"
 * @return Đối tượng đã loại trừ trường thông tin được chỉ định. Ví dụ {"name":"abc"}
*/
function omit(obj, key) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}