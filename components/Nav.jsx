import { useState, useEffect } from 'react';

import { NavLink } from '.';
import { userService } from 'services';

export { Nav };

/**
 * Thanh NAV, kiêm nhiệm vụ xác thực tài khoản
 * @returns 
 */
function Nav() {

    // Biến trạng thái user 
    const [user, setUser] = useState(null);

    // Tự động chạy khi Nav được khởi tạo
    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        console.log("Kiểm tra thông tin tài khoản");
        return () => subscription.unsubscribe();
    }, []);

    /**
     * Hàm sự kiện khi bấm vào nút Đăng xuất trên thanh Nav
     */
    function logout() {
        userService.logout();
    }

    /** Chỉ hiển thị thanh Nav khi người dùng đã đăng nhập */
    if (!user) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div class="container-fluid">
                <div className="navbar-nav me-auto mb-10 mb-lg-10">
                    <NavLink href="/" exact className="nav-item nav-link">Trang chủ</NavLink>
                </div>
                <div className="navbar-nav">
                    <NavLink href="/users" className="nav-item nav-link">Quản lý tài khoản</NavLink>
                    <span style={{color:'white'}}> . </span>
                    {/** Vừa hiển thị tài khoản, vừa kích hoạt việc kiểm tra trạng thái đăng nhập để gọi tới giao diện login */}
                    <NavLink href={"/users/edit/" + userService.userValue?.id} className="nav-item nav-link ">Chào {userService.userValue?.lastName + " " + userService.userValue?.firstName}</NavLink>
                    <span style={{color:'white'}}> . </span>
                    <a onClick={logout} className="nav-item nav-link">Đăng xuất</a>                    
                </div>
            </div>
        </nav>
    );
}