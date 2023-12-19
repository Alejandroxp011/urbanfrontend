"use client"
import { useEffect, useState, useRef, use } from 'react';
import { Typography, Box, Button } from '@mui/material';
import TextAvatar from '../../components/TextAvatar';
import { useRouter } from 'next/navigation';
import AlertDialogDelete from './alertDialog';
import axiosInterceptorInstance from "../../axios/interceptor";
import { DELETE_MESSAGES } from "../../constants/deletemessages";
import { ENDPOINTS } from "../../constants/endpoints";
import EditIcon from '@mui/icons-material/Edit';


function Profile() {
	const router = useRouter();
	const [userData, setUserData] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [text, setText] = useState();
	const [editModeCorreo, setEditModeName] = useState(userData?.name || '');
	const [editModeNombre, setEditModeEmail] = useState(userData?.email || '');
	const userIdToDelete = userData?.id;
	const [points, setpoints] = useState({});

	const redirectToModify = () => {
		router.push('/profile/modifyProfile');
	}
	const [selectedFile, setSelectedFile] = useState(null);
	const inputFileRef = useRef(null);
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (selectedFile !== null)
			handleUpload();
	}, [selectedFile]);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		try {
			const formData = new FormData();
			formData.append('image', selectedFile);
			const response = await axiosInterceptorInstance.post(`${ENDPOINTS.uploadProfileImage}`, formData);
			setSelectedFile(null);
			setImageUrl(response.data.url);
			window.location.reload();
		} catch (error) {
			console.error('Error al subir la imagen', error);
		}
	};

	useEffect(() => {
		axiosInterceptorInstance.get(ENDPOINTS.user).then((res) => {
			setUserData(res.data);
			setImageUrl(res.data.profile_image);
		}).catch((err) => {
		})

	}, []);

	const fetchData = async () => {

		try {

			const response = await axiosInterceptorInstance.get(`${ENDPOINTS.points}/${userData.id}`);

			setpoints(response.data);


		} catch (error) {
			console.error('Error al obtener datos:', error);
		}
	};
	useEffect(() => {
		fetchData();
	}, [userData]);





	const redirectToVerifyEmail = () => {
		router.push('/verifyEmail');
    }
  
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setText('');
	}

	const handleConfirmDeleteAccount = () => {
		deleteAccount();
		setOpenDialog(false);
		setText('');
		if (text === DELETE_MESSAGES.question) {
			router.push('/login');
		}
	}

	const handleConfirmDeleteImage = () => {
		deleteImage();
		setOpenDialog(false);
		setText('');
	}

	const deleteAccount = () => {
		axiosInterceptorInstance.delete(`${ENDPOINTS.user}/${userIdToDelete}`)
			.then(() => {
				localStorage.removeItem('user');
			})
			.catch((error) => {
				setText(error.response.data.errors.email[0]);
			})
			.finally(() => {
				setOpenDialog(true);
			});
	}

	const handleDeleteImage = () => {
		setText(DELETE_MESSAGES.imageElimination);
		setOpenDialog(true);
	}

	const deleteImage = () => {
		axiosInterceptorInstance.post(`${ENDPOINTS.deleteProfileImage}`)
			.then(() => {
				setImageUrl(null);
				window.location.reload();
			})
			.catch((error) => {

			})
	}

	const handleAlert = () => {
		setText(DELETE_MESSAGES.question);
		setOpenDialog(true);
	}
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', backgroundColor: 'white', }}>
			{userData && (
				<>
					<Box sx={{ width: 200, display: 'flex', flexDirection: 'column', margin: "2rem" }}>
						<Box sx={{ alignSelf: 'center', }}>
							<TextAvatar name={userData.name} imageUrl={imageUrl} />
						</Box>
						<Box sx={{ alignSelf: 'center', }}>
							<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} ref={inputFileRef} />
							<Button variant="contained" onClick={() => inputFileRef.current.click()}
								sx={{ alignSelf: 'center', backgroundColor: '#6788C3', '&:hover': { backgroundColor: '#32569B' }, borderRadius: '5px 5px 0px 0px', height: 20, fontSize: 11, padding: '6px 26px', }}>
								{imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
							</Button>
						</Box>

						<Button variant="contained"
							sx={{ alignSelf: 'center', backgroundColor: '#BF6565', '&:hover': { backgroundColor: '#98436C' }, borderRadius: '0px 0px 5px 5px', height: 20, marginRight: 0, fontSize: 11 }}>
							Eliminar imagen
						</Button>
					</Box>
					<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1rem' }}>
						<Box sx={{}}>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Nombre:
							</Typography>
							<Typography sx={{ color: 'black', paddingBottom: 4 }}>
								{userData.name}
							</Typography>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Puntos de fidelidad:
							</Typography>
							<Typography sx={{ color: 'black', paddingBottom: 4 }}>
								{points.puntos ? points.puntos : 0}
							</Typography>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Correo electrónico:
							</Typography>
							<Box sx={{ height: '1rem', display: "flex", flexDirection: "row" }} >
								<Typography sx={{ color: 'black', paddingBottom: 4 }}>
									{userData.email}
								</Typography>
								<Typography sx={{ color: '#98436C', fontWeight: 600, marginLeft: "0.5rem" }}>
									{userData.email_verified_at && 'Verificado'}
								</Typography>
							</Box>
							{!userData.email_verified_at && <Button sx={{ backgroundColor: '#32569B', '&:hover': { backgroundColor: '#35478C' }, color: "white", marginTop: "2.4rem" }} variant='contained' onClick={redirectToVerifyEmail}>
								Verificar correo
							</Button>}
						</Box>
						<Box sx={{display: 'flex', flexDirection: 'column'}}>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Dirección:
							</Typography>
							<Typography sx={{ color: 'black', paddingBottom: 4 }}>
								{userData.address}
							</Typography>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Ciudad:
							</Typography>
							<Typography sx={{ color: 'black', paddingBottom: 4 }}>
								{userData.city}
							</Typography>
							<Typography sx={{ color: 'black', fontWeight: 600 }}>
								Teléfono:
							</Typography>
							<Typography sx={{ color: 'black', paddingBottom: 0 }}>
								{userData.phone}
							</Typography>
							<EditIcon sx={{ color: '#98436C', margin: "0", alignSelf: 'flex-end', fontSize:30 }} onClick={redirectToModify} />
							<AlertDialogDelete handleClose={handleCloseDialog} handleConfirm={handleConfirmDeleteAccount} openDialog={openDialog} text={text} title={"Eliminar Cuenta"} />
					<AlertDialogDelete handleClose={handleCloseDialog} handleConfirm={handleConfirmDeleteImage} openDialog={openDialog} text={text} title={"Eliminar foto de Perfil"} />
					<Button variant="contained" onClick={handleAlert} sx={{ backgroundColor: '#D33838', '&:hover': { backgroundColor: '#98436C' }, width: 170}}>

						Eliminar cuenta
					</Button>
						</Box>
					</Box>
				</>
			)
			}
		</Box >
	);
}
export default Profile;
