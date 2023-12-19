import { useState, useEffect } from 'react';
import axiosInterceptorInstance from '../axios/interceptor';
import { ENDPOINTS } from '../constants/endpoints';
const useVerifyAuth = (router, pathname) => {
    const [redirecTo, setRedirecTo] = useState(null);
    useEffect(() => {
        axiosInterceptorInstance.get(ENDPOINTS.verifyAuthUser).then((res) => {
            if (pathname === '/login' || pathname === '/register') {
                setRedirecTo('/profile');
            }
        }).catch((err) => {
           if(pathname !== '/login' && pathname !== '/register')
            setRedirecTo('/login');
        })
    }, []);

    return (redirecTo && router) && router.push(redirecTo);
}
export default useVerifyAuth;