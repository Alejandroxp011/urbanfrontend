import { MenuItem } from "@mui/material"
import axiosInterceptorInstance from '../axios/interceptor';
import { ENDPOINTS } from "../constants/endpoints";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axiosInterceptorInstance.post(ENDPOINTS.logout);
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
    }
  };

  return (
    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
  );
};

export default LogoutButton;
