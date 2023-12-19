"use client"
import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, FormControl } from '@mui/material';
import TextAvatar from '../../../components/TextAvatar';
import { useRouter } from 'next/navigation';
import axiosInterceptorInstance from "../../../axios/interceptor";
import { ENDPOINTS } from '@/app/constants/endpoints';
import { modifyProfileSchema } from '@/app/constants/schemas/modifyProfile';

function ModifyProfile() {
    const router = useRouter();

    const initialValues = {
        name: '',
        email: '',
        city: '',
        address: '',
        phone: ''
    }

    const errorValues = {
        name: false,
        nameMessage: '',
        email: false,
        emailMessage: '',
        city: false,
        cityMessage: '',
        address: false,
        addressMessage: '',
        phone: false,
        phoneMEssage: ''
    }

    const [userData, setUserData] = useState(initialValues);
    const [error, setError] = useState(errorValues);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        axiosInterceptorInstance.get('/user').then((res) => {
            const { data } = res;
            if (data !== null) {
                const newData = {};
                Object.keys(data).forEach((key) => {
                    if (data[key] !== null) {
                        newData[key] = data[key];
                    }
                });
                setUserData(newData);
            }
        }).catch((err) => {
        })

    }, []);

    const handleChange = (event) => {
        validateField(event);
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    }


    const validateField = (event) => {
        const actualData = { ...userData, [event.target.name]: event.target.value }
        modifyProfileSchema.validateAt(event.target.name, actualData)
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
            console.log(userData);
            modifyProfileSchema.validateSync(userData, { abortEarly: false });
            
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
        axiosInterceptorInstance.put(ENDPOINTS.updateProfile, userData)
            .then(() => {
                redirectToProfile();
            })
            .catch((error) => {
                // Handle error
            });
    }


    const handleUpdate = (event) => {
        event.preventDefault();
        validateAll();
    }

    const redirectToProfile = () => {
        router.push('/profile');
    }



    return (
        <Box component="form" onSubmit={handleUpdate} sx={{
            display: 'flex', alignItems: 'center',
            flexDirection: 'column', backgroundColor: 'white',
        }}>
            {userData !== null && (
                <>
                <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', margin: "2rem" }}>
                    <TextAvatar name={userData.name} />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1rem' , width: 500 }}>
                        <Box sx={{paddingTop:'0.6rem'}}>
                    <TextField
                        id="registerName"
                        name="name"
                        label="Nombre"
                        variant="outlined"
                        margin="dense"
                        helperText={error.nameMessage}
                        error={error.name}
                        value={userData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        disabled
                        id="points"
                        name="points"
                        label="Puntos de fidelidad"
                        variant="outlined"
                        margin="normal"
                        value={userData.points ? userData.points : 0}
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
                        value={userData.email}
                    />
                    </Box>
                    <Box>
                    <TextField
                        id="registerPassword"
                        name="city"
                        label="Ciudad"
                        variant="outlined"
                        margin="normal"
                        type="text"
                        helperText={error.cityMessage}
                        error={error.city}
                        onChange={handleChange}
                        value={userData.city}
                    />
                    <TextField
                        id="registerRepeatPassword"
                        name="address"
                        label="Direccion"
                        variant="outlined"
                        margin="normal"
                        helperText={error.addressPasswordMessage}
                        type="text"
                        onChange={handleChange}
                        error={error.address}
                        value={userData.address}
                    />
                    <TextField
                        id="registerRepeatPassword"
                        name="phone"
                        label="Telefono"
                        variant="outlined"
                        margin="normal"
                        helperText={error.phoneMessage}
                        type="text"
                        onChange={handleChange}
                        error={error.phone}
                        value={userData.phone}
                    />
                    </Box>
                    </Box>
                    <Button variant="contained" type="submit" sx={{ backgroundColor: '#32569B', '&:hover': { backgroundColor: '#35478C' }, marginTop: "2rem" }}>
                        Guardar cambios
                    </Button>
                    <Button variant="contained" onClick={redirectToProfile} sx={{ backgroundColor: '#D33838', '&:hover': { backgroundColor: '#98436C' }, marginTop: "2rem" }}>
                        Cancelar
                    </Button>
                </>
            )
            }
        </Box >
    );
}
export default ModifyProfile;
