import { userService } from 'services';
import { Link } from 'components';

export default Home;

/**
 * Component giao diện chính sau đăng nhập
 * @returns 
 */
function Home() {
    return (
        <div className="p-4">
            <div className="container">
                <h1>Chào {userService.userValue?.firstName}!</h1>
                <p>Bạn đang sử dụng sản phẩm trích xuất báo cáo từ hệ thống HIS!!</p>
                <p><Link href="/users">Quản lý tài khoản đăng nhập</Link></p>
            </div>
        </div>
    );
}
