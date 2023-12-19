'use client'
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axiosInterceptorInstance from '@/app/axios/interceptor';
import { ENDPOINTS } from '@/app/constants/endpoints';
import DoneIcon from '@mui/icons-material/Done';

const style = {
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 width: 400,
 bgcolor: 'background.paper',
 border: '2px solid #FFF',
 boxShadow: 24,
 p: 4,
 borderRadius: '20px',
};

export default function BasicModal() {
 const [open, setOpen] = useState(true);
 const handleClose = () => setOpen(false);
 const [codigo, setCodigo] = useState('');
 const [datosCupon, setDatosCupon] = useState({});
 const [showDoneIcon, setShowDoneIcon] = useState(false);

 const getRandomId = async () => {
  const response = await axiosInterceptorInstance.get(`${ENDPOINTS.discounts}`);
  const ids = Object.keys(response.data)
   .filter(key => response.data[key].cupon === 1)
   .map(key => response.data[key].id);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  getAllDiscount(randomId);
 };

 useEffect(()=> {
  getRandomId();
 },[]);

  const handleCopyCode = (text) => {
  navigator.clipboard.writeText(text);
  setShowDoneIcon(true);
  setTimeout(() => {
    setShowDoneIcon(false);
  }, 1000);
  };

 const getAllDiscount = async (id) => {
  await axiosInterceptorInstance.get(`${ENDPOINTS.discount}/${id}`)
  .then(response => {
   if (response.data[0].cupon === 1) { 
     setDatosCupon(response.data[0]);
     setCodigo(response.data[0].code);
   }
  })
  .catch(error => {
   console.error('Error al obtener los datos de la promocion:',error);
  })
 };
 

 return (
  <Box style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton 
          onClick={handleClose} 
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center'}}>
          Cupón
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
        {datosCupon && datosCupon.name}
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Descuento de: {datosCupon && datosCupon.value} {datosCupon && datosCupon.type_discount === 1 ? '%' : 'Bs'}
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Código: {codigo}
        {showDoneIcon ? <DoneIcon /> : <IconButton onClick={() => handleCopyCode(codigo)}>
          <ContentCopyIcon />
        </IconButton>}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
        • {datosCupon && datosCupon.date_start} - {datosCupon && datosCupon.date_end}
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
        • Valido solo para productos seleccionados.
        </Typography>
      </Box>
    </Modal>
  </Box>
 );
}
