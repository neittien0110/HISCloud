import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import 'styles/globals.css';

import { userService } from 'services';
import { Nav, Alert } from 'components';

export default App;

function App({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        setUser(userService.userValue);
        const publicPaths = ['/account/login', '/account/register'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/account/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

    /**
     *                          BÔ CỤC TOÀN TRANG WEB 
     */
    return (
        <>
            <Head>
                <title>HIS: báo cáo trực tuyến</title>
                <link href="http://benhvientimhanoi.vn/upload/16521/20161109/favicon56.ico" rel="shortcut icon" type="image/x-icon" />
                
                {/* eslint-disable-next-line @next/next/no-css-tags */}
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>
            {/* -----------------------------HEADETER---------------------------------- */}
            <div className={`app-container ${user ? 'bg-light' : ''}`}>
                <Nav />
                <Alert />
                {authorized &&
                    <Component {...pageProps} />
                }
            </div>

            {/* -----------------------------FOOTER---------------------------------- */}
            <div className="text-center mt-4">
                <p>
                    <a href="http://benhvientimhanoi.vn/" target="_blank" rel="noreferrer">Website Bệnh viện Tim Hà Nội</a>
                </p>
                <p>
                    Thực hiện: N T D, <a href="http://benhvientimhanoi.vn/gioi-thieu/khoi-van-phong/phong-cong-nghe-thong-tin" target="_blank" rel="noreferrer"> phòng CNTT</a> 
                </p>                
            </div>
        </>
    );
}
