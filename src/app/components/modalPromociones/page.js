'use client'
import { useEffect } from 'react';
import  {useState} from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel';
import Container  from '@mui/material/Container';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import axiosInterceptorInstance from '@/app/axios/interceptor';
import { ENDPOINTS } from '@/app/constants/endpoints';


const  DatosCupon = ({isOpen,onClose,id})=> {
  const [datosCupon, setDatosCupon] = useState({});

  useEffect(()=> {
    getAllDiscout();
  },[id]);

  const getAllDiscout = async () => {
    await axiosInterceptorInstance.get(`${ENDPOINTS.discount}/${id}`)
    .then(response => {
      setDatosCupon(response.data[0])
    })
    .catch(error => {
      console.error('Error al obtener los datos del descuento:',error);
    })
  };

   const deletePromotion = async (id) => {
    await axiosInterceptorInstance.delete(`${ENDPOINTS.discount}/${id}`)
      .then(response => {
        console.log('Promoción eliminada:', response);
        onClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al eliminar la promoción:', error);
      });
  }; 
  

   const modalStyle={
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    outline:'none',
    backgroundColor:'#fff',
    boxShadow: 24,
    padding: '16px 32px 24px',
};

const inputLabelStyle = {
  marginBottom: '20px',
  color: 'black',
};

const botonStyle = {
  marginRight: "25px",
  color: "#000",
  '&:hover':{
    backgroundColor:'#31649E ',
    color: '#fff',
  }
};

const containerStyle ={
  whiteSpace: 'pre-wrap', 
  lineHeight: '1.5', 
  fontSize: '16px', 
};

    return (
            <Modal
                open={isOpen}
                onClose={onClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 600,
                  style: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                }}
            >
             <Box sx={modalStyle}>
                     <Typography marginBottom='15px' align='center'  variant='h4' fontWeight="bold">Datos de la promocion</Typography>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Nombre:</Typography> {datosCupon.name} </InputLabel>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Descripcion: </Typography><Container sx={containerStyle}>{datosCupon.description}</Container></InputLabel>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Valor:</Typography> {datosCupon.value}</InputLabel>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Uso:</Typography> {datosCupon.use_max}</InputLabel>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Fecha de Inicio:</Typography> {datosCupon.date_start}</InputLabel>
                     <InputLabel sx={inputLabelStyle}><Typography fontWeight="bold" component="span">Creado:</Typography> {datosCupon.created_at}</InputLabel>

                     <Typography marginBottom='15px' align='center'  variant='h6' fontWeight="bold">¿Esta seguro de eliminar esta promocion?</Typography>

                     <Stack direction={'row'} justifyContent={'center'}>
                       <Button sx={botonStyle} onClick={()=>deletePromotion(id)}>Si</Button>
                       <Button sx={botonStyle} onClick={onClose}>No</Button>
                      </Stack>
               </Box>
      </Modal>
  );
}

export default DatosCupon