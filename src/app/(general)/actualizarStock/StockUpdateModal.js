

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import {validacionCampos} from '../../constants/schemas/validacion'
import { ENDPOINTS } from '@/app/constants/endpoints';
import axiosInterceptorInstance from '@/app/axios/interceptor';

const StockUpdateModal = ({ open, onClose, onUpdate, id }) => {
  const [buying_price, setPrice] = useState('');
  const [buying_date, setDate] = useState('');
  const [buying_amount, setAmount] = useState('');

  const handleUpdate = async() => {

    try {
      await validacionCampos.validate({
      buying_price: parseFloat(buying_price),
      buying_amount: parseInt(buying_amount),
    });  

    onUpdate({
      buying_price: parseFloat(buying_price),
      buying_date,
      buying_amount: parseInt(buying_amount),
    });
    axiosInterceptorInstance.post(ENDPOINTS.registerInventary, 
      {
        "buying_price":buying_price,
        "buying_date":buying_date,
        "buying_amount": buying_amount,
        "product_id": "5",
        "created_at":"",
        "updated_at":""
    }
      )
    .then(() => {
      alert("Inventario registrado exitosamente")
    })

    onClose();
    }catch(error){
      alert(`Error de validación: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Actualizar Stock</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingresa la información para actualizar el stock del producto.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Precio de Compra (Precio en Bs)"
          type="number"
          fullWidth
          value={buying_price}
          onChange={(e) => setPrice(e.target.value)}
          InputProps={{
            readOnly: false,
          }}
        />
        <TextField
          margin="dense"
          label="Fecha de Compra"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { marginTop: '16px' }, 
          }}
          value={buying_date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Cantidad Adquirida"
          type="number"
          fullWidth
          value={buying_amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            readOnly: false,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary"
         sx={{
          backgroundColor: '#DE6666', 
          borderRadius: '15px',
          height: '50px', 
          width: '200px', 
          color: "#ffffff",
          '&:hover': {
          backgroundColor: '#D33835', 
          }, 
        }}
        >Cancelar</Button>

        <Button onClick={handleUpdate} variant="contained" color="primary" 
         sx={{
          backgroundColor: '#6788C3' , 
          borderRadius: '15px',
          height: '50px', 
          width: '200px', 
          '&:hover': {
          backgroundColor: '#32569B',
          }, 
        }}
        >Actualizar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockUpdateModal;