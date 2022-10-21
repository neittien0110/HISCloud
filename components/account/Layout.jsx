import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { userService } from 'services';

export { Layout };

/**
 * Component layout của 2 giao diện Đăng nhập và Đăng ký mới
 * @param {*} children 
 * @returns 
 * @see  ../../pages/account/login.jsx 
 * @see  ../../pages/account/register.jsx
 */
function Layout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue) {
            router.push('/');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            {/** -------------------- Logo của bệnh viện ---------------------------*/}
            <div className={"text-center mt-4"}>
                &nbsp;
                <img src='http://benhvientimhanoi.vn/upload/16521/20180523/logo-dd.png'/>
                <br/>
                <br/>
                <h2>HIS - Hệ thống quản lý y tế thông minh</h2>
                <div className="text-center mt-4 font-italic">phân hệ báo cáo trực tuyến</div>
            </div>     
            {//**  ----------------------- Nội dung chính ------------------------ */}       
            {children}
            {/**  ----------------------- Nội dung chính ------------------------ */}       
        </div>
    );
}