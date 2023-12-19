'use client'
import  { useState, useEffect } from 'react';
import { restoreSchema } from '../../constants/schemas/restore';
import { Typography, TextField, Button, Box } from "@mui/material"
import axiosInterceptorInstance from "../../axios/interceptor";
import { ENDPOINTS } from "../../constants/endpoints";
import { useRouter } from "next/navigation";

function PasswordRecoveryPage() {
    const errorValues ={
        password: false,
        passwordMessage: '',
        repeatPassword: false,
        repeatPasswordMessage: ''
    }
    
    const initialValues = {
        password: '',
        email: '',
        token: ''
    }

    const router = useRouter();
    const [error, setError] = useState(errorValues);
    const [data, setData] = useState(initialValues);


    useEffect(() => {
        try {
            const token= JSON.parse(localStorage.getItem('token'));
            const email = JSON.parse(localStorage.getItem('email'));
            console.log(token, email);
            setData((data) => { return { ...data, token: token, email: email } });
        } catch (error) {
            console.log(error);
        }

    }, []);
    

    const handlePasswordRecovery = (event) => {
        event.preventDefault();
        axiosInterceptorInstance.post(ENDPOINTS.restore, data).then((response) => {
            console.log(response);
        });
        router.push(ENDPOINTS.login);
    };

    const handleChange = (event) => {
        validateField(event);
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }
    const validateField = (event) => {
        const actualData = { ...data, [event.target.name]: event.target.value }
        restoreSchema.validateAt(event.target.name, actualData)
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

    return (
        <Box component="form" onSubmit={handlePasswordRecovery} sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', backgroundColor: 'white', minHeight: '100vh', paddingTop: '10%',
            minWidth: '100vw'
        }}>
            <Typography variant="h3" sx={{ color: 'black', marginBottom: '2rem', textAlign: 'center' }}>Crear Nueva Contreseña</Typography>
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
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#6788C3', marginTop: '2rem' }}>Continuar</Button>
        </Box>
    );
}

export default PasswordRecoveryPage;
