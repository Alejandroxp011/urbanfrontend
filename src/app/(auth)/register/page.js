'use client'
import { useState } from "react";
import { registerSchema } from "../../constants/schemas/register";
import { Typography, TextField, Button, Box } from "@mui/material"
import axiosInterceptorInstance from "../../axios/interceptor";
import BackdropRegister from "./backdrop";
import AlertDialogRegister from "./alertDialog";
import { REGISTER_MESSAGES } from "../../constants/registermessages";
import { ENDPOINTS } from "../../constants/endpoints";
import { useRouter, usePathname } from "next/navigation";
import useVerifyAuth from "@/app/hooks/verifyAuth";

export default function RegisterPage() {
    const router = useRouter();
    const pathname = usePathname();
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        repeatPassword: ''
    }

    const errorValues = {
        name: false,
        nameMessage: '',
        email: false,
        emailMessage: '',
        password: false,
        passwordMessage: '',
        repeatPassword: false,
        repeatPasswordMessage: ''
    }
    useVerifyAuth(router, pathname);
    const [data, setData] = useState(initialValues);
    const [error, setError] = useState(errorValues);
    const [openDialog, setOpenDialog] = useState(false);
    const [text, setText] = useState();
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setText('');
        if(text === REGISTER_MESSAGES.success){
            router.push('/login');
        }
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
        registerSchema.validateAt(event.target.name, actualData)
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

    const validateAll= () => {
        try {
            registerSchema.validateSync(data, { abortEarly: false });
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

    const sendData = () => {
        axiosInterceptorInstance.post(ENDPOINTS.user, data)
            .then(() => {
                handleCloseBackdrop();
                setText(REGISTER_MESSAGES.success);
            })
            .catch((error) => {
                setText(error.response.data.errors.email[0]);
            })
            .finally(() => {
                handleCloseBackdrop();
                setOpenDialog(true);
            });
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        validateAll();
    }

    const redirectToLogin = () => {
        router.push('/login');
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', backgroundColor: 'white', minHeight: '100vh', paddingTop: '10%',
            minWidth: '100vw'
        }}>
            <Typography variant="h3" sx={{ color: 'black', marginBottom: '2rem' }}>Registro de Cuenta</Typography>
            <TextField
                id="registerName"
                name="name"
                label="Nombre"
                variant="outlined"
                margin="dense"
                helperText={error.nameMessage}
                error={error.name}
                value={data.name}
                onChange={handleChange}
            />
            <TextField
                id="registerEmail"
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
                id="registerPassword"
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
            <TextField
                id="registerRepeatPassword"
                name="repeatPassword"
                label="Repetir Contraseña"
                variant="outlined"
                margin="normal"
                helperText={error.repeatPasswordMessage}
                type="password"
                onChange={handleChange}
                error={error.repeatPassword}
                value={data.repeatPassword}
            />
            <Typography variant="body1" sx={{ color: '#E4D8D8', margin: '1rem' }} >¿Ya tienes una cuenta?
                <Button variant="text" onClick={redirectToLogin} sx={{ "&:hover": { backgroundColor: 'white' } }}>Click aquí</Button>
            </Typography>
            <AlertDialogRegister handleClose={handleCloseDialog} openDialog={openDialog} text={text} />
            <BackdropRegister handleClose={handleCloseBackdrop} open={openBackdrop} />
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#6788C3' }}>Continuar</Button>
        </Box>
    )

}