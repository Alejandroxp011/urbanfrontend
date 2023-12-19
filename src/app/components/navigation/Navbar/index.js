'use client'
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import Cart from "../Cart";
import User from "../User";
import Sidebar from "../Sidebar";
import { useRouter, usePathname } from "next/navigation";
import useVerifyAuth from "@/app/hooks/verifyAuth";
import Promotions from "../Promotions";


export default function Navbar() {
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const handleDrawerClose= () => {
        setOpen(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    }
    
    useVerifyAuth(router, pathname);

    return (
        <Box name="NavBar" sx={{ display: 'flex'}}>
            <AppBar position="fixed">
                <Toolbar sx={{backgroundColor:"#16193B"}}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography sx={{ color: '#FFF',  fontFamily:'Skeina', fontSize: '40px', fontWeight: 500}}>UrbanMarket</Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Promotions/>
                        <Cart />
                        <User />
                    </Box>
                </Toolbar>
            </AppBar>
            <Sidebar open={open} handleDrawerState={handleDrawerClose}>

            </Sidebar>
        </Box>
    );
}