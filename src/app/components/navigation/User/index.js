'use client'
import { Avatar, Icon, IconButton, Menu, MenuItem } from "@mui/material"
import { useState, useEffect } from "react";
import Logout from '../../LogoutButton';
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/app/constants/endpoints";
import axiosInterceptorInstance from "@/app/axios/interceptor";

export default function User() {
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState(null);


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const redirectToProfile = () => {
        handleClose();
        router.push('/profile');
    };

    
    useEffect(() => {
		axiosInterceptorInstance.get(ENDPOINTS.user).then((res) => {
			setImageUrl(res.data.profile_image);
		}).catch((err) => {
		})

	}, []);



    return (
        <>
            <IconButton onClick={handleClick}>
                <Avatar src={imageUrl}>
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}

                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={redirectToProfile}>Ver Perfil</MenuItem>
                <Logout />
            </Menu>
        </>
    )
}