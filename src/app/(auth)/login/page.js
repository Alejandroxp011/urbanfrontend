'use client'
import { use, useState } from "react";
import { loginSchema } from "../../constants/schemas/login";
import { Typography, TextField, Button, Box } from "@mui/material"
import axiosInterceptorInstance from "../../axios/interceptor";
import BackdropLogin from "./backdrop";
import AlertDialogLogin from "./alertDialog";
import { LOGIN_MESSAGES } from "../../constants/loginmessages"
import { ENDPOINTS } from "../../constants/endpoints";
import { useRouter, usePathname } from "next/navigation";
import useVerifyAuth from "@/app/hooks/verifyAuth";
export default function LoginPage() {
    const initialValues = {
        email: '',
        password: ''
    }
    const errorValues = {
        email: false,
        emailMessage: '',
        password: false,
        passwordMessage: ''
    }
    const router = useRouter();
    const pathname = usePathname();
    useVerifyAuth(router, pathname);
    const [data, setData] = useState(initialValues);
    const [error, setError] = useState(errorValues);
    const [openDialog, setOpenDialog] = useState(false);
    const [text, setText] = useState();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setText('');
    }
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    }
    const handleChange = (event) => {
        validateField(event);
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }
    const validateField = (event) => {
        const actualData = { ...data, [event.target.name]: event.target.value }
        loginSchema.validateAt(event.target.name, actualData)
            .then(() => {
                setError({
                    ...error,
                    [event.target.name]: false,
                    [event.target.name + 'Message']: ''
                })
            })
            .catch((err) => {
                setError({
                    ...error,
                    [event.target.name]: true,
                    [event.target.name + 'Message']: err.message
                })
            })
    }
    const validateAll = () => {
        try {
            loginSchema.validateSync(data, { abortEarly: false });
            setOpenBackdrop(true);
            sendData();
        } catch (err) {
            let newError = { ...errorValues };
            err.inner.forEach((error) => {
                newError[error.path] = true;
                newError[error.path + 'Message'] = error.message;
            })
            setError(newError);
        }
    }

    const redirectToRegister = () => {
        router.push('/register');
    }
    const redirectToForgotPassword = () => {
        router.push('/forget-password');
    }
    const sendData = () => {
        axiosInterceptorInstance.post(ENDPOINTS.login, data).then((response) => {
            handleCloseBackdrop();
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data));
            router.push('/catalogoProductos');
        }).catch((error) => {
            setText(LOGIN_MESSAGES.errorLogin);
            setOpenDialog(true);
        })
        handleCloseBackdrop();
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        validateAll();
    }
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', backgroundColor: 'white', minHeight: '100vh', paddingTop: '10%',
            minWidth: '100vw'
        }}>
            <Typography variant="h3" sx={{ color: 'black', marginBottom: '2rem' }}>Inicio de Sesión</Typography>
            <TextField
                id="loginEmail"
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                helperText={error.emailMessage}
                type="email"
                onChange={handleChange}
                error={error.email}
                value={data.email}
            />
            <TextField
                id="loginPassword"
                name="password"
                label="Contraseña"
                variant="outlined"
                margin="normal"
                type="password"
                helperText={error.passwordMessage}
                error={error.password}
                onChange={handleChange}
                value={data.password}
            />
            <Typography variant="body1" sx={{ color: '#E4D8D8', margin: '1rem' }} >¿No tienes una cuenta?
                <Button onClick={redirectToRegister} variant="text" sx={{ "&:hover": { backgroundColor: 'white' } }}>Click aquí</Button>
            </Typography>
            <AlertDialogLogin handleClose={handleCloseDialog} openDialog={openDialog} text={text} />
            <BackdropLogin handleClose={handleCloseBackdrop} open={openBackdrop} />
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#6788C3' }}>Ingresar</Button>
            <Typography variant="body1" sx={{ color: '#E4D8D8', margin: '1rem' }} >¿Olvidaste tu Contraseña?
                <Button onClick={redirectToForgotPassword} variant="text" sx={{ "&:hover": { backgroundColor: 'white' } }}>Click aquí</Button>
            </Typography>
        </Box>
    )
}