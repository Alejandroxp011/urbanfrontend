'use client'
import { useState, useEffect } from "react";
import { verifyCodeSchema } from "@/app/constants/schemas/verificationEmail";
import { Typography, TextField, Button, Box, Icon } from "@mui/material"
import axiosInterceptorInstance from "../../axios/interceptor";
import { ENDPOINTS } from "../../constants/endpoints";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function VerifyCodePage() {

    const initialValues = {
        verificationCode: '',
    }
    const errorValues = {
        verificationCode: false,
        verificationCodeMessage: '',
    }
    const router = useRouter();
    const [data, setData] = useState(initialValues);
    const [error, setError] = useState(errorValues);
    const [sent, setSent] = useState(false);

    const handleChange = (event) => {
        validateField(event);
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    const validateField = (event) => {
        const actualData = { ...data, [event.target.name]: event.target.value }
        verifyCodeSchema.validateAt(event.target.name, actualData).then(()=>{
            setError({
                ...error,
                [event.target.name]: false,
                [event.target.name + 'Message']: ''
            })
        }).catch((err)=>{
            setError({
                ...error,
                [event.target.name]: true,
                [event.target.name + 'Message']: err.message
            })
        })

    }

    const validateAll = () => {
        try {
            verifyCodeSchema.validateSync(data, { abortEarly: false });
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
        axiosInterceptorInstance.post(ENDPOINTS.emailVerification, data).then((response) => {
        redirectToLogin();
        }).catch((err) => {
           let newError = { ...errorValues };
            newError.verificationCode = true;
            newError.verificationCodeMessage = err.response.data.message;
            setError(newError);
        })

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        validateAll();
    }

    const handleResend = () => {
        axiosInterceptorInstance.get(ENDPOINTS.emailResend).then((response) => {
            setSent(true);
        }).catch((err) => {
            console.log(err)
            let newError = { ...errorValues };
            newError.verificationCode = true;
            newError.verificationCodeMessage = err.response.data.message;
            setError(newError);
        })
    }

    const redirectToProfile = () => {
        router.push('/profile');
    }
    
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', backgroundColor: 'white', minHeight: '100vh', paddingTop: '10%',
            minWidth: '100vw'
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Button variant="outlined" onClick={redirectToProfile} sx={{padding: "0.5rem", marginBottom: "1rem" }}>
                    <ArrowBackIcon/>
                </Button>
                <Typography variant="h3" sx={{ color: 'black', marginTop:"6rem" }}>Verificar Correo Electrónico</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'black', marginBottom: '2rem' }}>Se enviará un código de 7 dígitos a su correo electrónico.</Typography>
            <Button variant="outlined" onClick={handleResend} sx={{ color: '#98436C', borderColor: "#98436C", margin: "0.2rem" }}>{sent ? "Reenviar": "Enviar"}</Button>
            <TextField
                id="verificationCode"
                name="verificationCode"
                label="Código de verificación"
                variant="outlined"
                margin="normal"
                helperText={error.verificationCodeMessage}
                onChange={handleChange}
                error={error.verificationCode}
                value={data.verificationCode}
            />
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#6788C3', margin: "0.2rem"}}>Continuar</Button>
        </Box>
    )
}