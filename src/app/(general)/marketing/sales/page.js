'use client'
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import { ENDPOINTS } from '@/app/constants/endpoints';
import EnhancedTable from './table';
import axiosInterceptorInstance from '@/app/axios/interceptor';

function Sale(){
  useEffect(() => {
    getAllDiscout();
  }, []);
  const modalStyle={
  position: 'fixed',
  top: '10vh',
  left: '15vw',
  width: '83%',
  height: '88%',
  display: 'flex',
  backgroundColor:'#fff',
};
const containerStyle ={
  position: 'fixed',
  width: '80%',
  top: '32vh',
  left: '16vw'
};
const subtitle = {
  position: 'fixed',
  top: '25vh',
  left: '17vw',
}
const inputLabelStyle = {
  marginBottom: '20px',
  color: 'black',
  fontSize: '15px',
};
const [discountData, setDiscountData] = useState([]);
const router = useRouter();
const getAllDiscout = async () => {
const urlParams = new URLSearchParams(window.location.search);
const idDiscount = urlParams.get('id');
  const response = await axiosInterceptorInstance.get(`${ENDPOINTS.discount}/${idDiscount}`)
  if(response.status === 200){
    setDiscountData(response.data[0]);
  }
};

const buttonContainerStyle = {
  justifyContent: 'center',
  width: '83%',
  height: '88%',
  position: 'absolute',
  top: '90%',
  left: '90%',
};

const handleCancel = () => {
  router.back();
};

useEffect(()=> {
  getAllDiscout();
},[]);

const [open, setOpen] = useState(true);
  return(
    <Modal open={open}>
      <Box sx={modalStyle}>
        <Typography margin='25px 30vw' variant='h4'>Añadir producto</Typography>
      <Box sx={subtitle}>
      <Stack direction="row" spacing={2}>
        <InputLabel sx={inputLabelStyle}><Typography fontSize={15} fontWeight="bold" component="span">
          Id: </Typography>{discountData?.id}</InputLabel>
        <InputLabel sx={inputLabelStyle}><Typography fontSize={15} fontWeight="bold" component="span">
          Nombre: </Typography>{discountData?.name}</InputLabel>
        <InputLabel sx={inputLabelStyle}><Typography fontSize={15} fontWeight="bold" component="span">
          Fecha Inicio: </Typography>{discountData?.date_start}</InputLabel>
        <InputLabel sx={inputLabelStyle}><Typography fontSize={15} fontWeight="bold" component="span">
          Fecha Fin: </Typography>{discountData?.date_end}</InputLabel>
        <InputLabel sx={inputLabelStyle}><Typography fontSize={15} fontWeight="bold" component="span">
          Tipo: </Typography>{discountData?.discount === 1 ? "discount" : "cupon"}</InputLabel>
      </Stack>
      </Box>
      <Box sx={containerStyle}>
        <EnhancedTable idDiscount={discountData?.id} margin='15px'/>
      </Box>
      <Box sx={buttonContainerStyle}>
          <Button variant="contained" color="primary" onClick={handleCancel}>
            SALIR
          </Button>
        </Box>
      </Box>
      
    </Modal>
  );
}

export default Sale;