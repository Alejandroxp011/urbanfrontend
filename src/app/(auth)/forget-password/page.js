'use client'
import React, { useState } from 'react';
import { recoverSchema } from '../../constants/schemas/recover';
import { Typography, TextField, Button, Box } from "@mui/material"
import axiosInterceptorInstance from "../../axios/interceptor";
import { ENDPOINTS } from "../../constants/endpoints";

function PasswordRecoveryPage() {
    const [error, setError] = useState(false);
    const [data, setData] = useState({ email: '' });
    const [message, setMessage] = useState('');

    const handlePasswordRecovery = async (event) => {
        try {
            event.preventDefault();
            axiosInterceptorInstance.post(ENDPOINTS.forget+'?email='+data.email).then((response) => {
               setMessage(response.data.message);
               localStorage.setItem('token', JSON.stringify(response.data.token));
               localStorage.setItem('email', JSON.stringify(response.data.email));
            })
        } catch (error) {
            console.log(error);
        }
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
        recoverSchema.validateAt(event.target.name, actualData)
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
            <Typography variant="h3" sx={{ color: 'black', marginBottom: '2rem', textAlign: 'center' }}>Recuperar Contraseña</Typography>
            <Typography variant='body1' sx={{ color: 'black', marginBottom: '2rem', textAlign: 'center' }}>{message}</Typography>
            <TextField
                id="recoverEmail"
                name="email"
                label="Ingrese su Correo"
                variant="outlined"
                margin="normal"
                helperText={error.emailMessage}
                type="email"
                onChange={handleChange}
                error={error.email}
                value={data.email}
                sx={{ width: '30%', marginBottom: '1rem' }}
            />
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#6788C3', marginTop: '2rem' }}>Continuar</Button>
        </Box>
    );
}

export default PasswordRecoveryPage;
