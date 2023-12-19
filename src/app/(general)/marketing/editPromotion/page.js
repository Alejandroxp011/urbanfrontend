'use client'
import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Grid,
  Box
} from '@mui/material';
import axiosInterceptorInstance from '@/app/axios/interceptor';
import { ENDPOINTS } from '@/app/constants/endpoints';
import { useRouter } from 'next/navigation';
import { registerPromotion } from '@/app/constants/schemas/promotion';

function MiComponente() {
  const [discountData, setDiscountData] = React.useState(null);
  
  const getAllDiscout = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const response = await axiosInterceptorInstance.get(`${ENDPOINTS.discount}/${id}`)
    if(response.status === 200){
        setDiscountData(response.data[0])
    }
  };
  useEffect(()=> {
    getAllDiscout();
  },[]);

  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  
  const handleTipoPromocionChange = (event) => {
    const selectedValue = event.target.value;
    setTipoPromocion(selectedValue);
    setMostrarCodigo(selectedValue === 'cupon');
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedType(value);
    setDiscountData((prevDiscountData) => ({
      ...prevDiscountData,
      type_discount: value === '%' ? 0 : 1,
    }));
  };


  const errorValues = {
    name: false,
    nameMessage: '',
    description: false,
    descriptionMessage: '',
    value: false,
    valueMessage: '',
    use_max: false,
    use_maxMessage: '',
    date_start: false,
    date_startMessage: '',
    date_end: false,
    date_endMessage: '',
    code: false,
    codeMessage: ''
  }
  const [error, setError] = useState(errorValues);

  const validateField = (event) => {
    const currentData = { ...discountData, [event.target.name]: event.target.value };
    registerPromotion.validateAt(event.target.name, currentData)
      .then(() => {
        setError({
          ...error,
          [event.target.name]: false,
          [event.target.name + 'Message']: ''
        });
      })
      .catch((err) => {
        setError({
          ...error,
          [event.target.name]: true,
          [event.target.name + 'Message']: err.message
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePromotion();
  };

  const handleFieldChange = (fieldName, value) => {
    validateField({ target: { name: fieldName, value: value } });
    setDiscountData((prevDiscountData) => ({
      ...prevDiscountData,
      [fieldName]: value,
    }));
  };
  const updatePromotion = async (id) => {
    try {
      const response = await axiosInterceptorInstance.put(`${ENDPOINTS.discount}/${id}`, discountData);
      handleCancel();
    } catch (error) {
      console.error('Error al actualizar la promoción:', error);
    }
  };
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };
  const modalStyle={
    margin: '12vh 0 0 15vw',
};
  return (
    <div>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginBottom: '6vh' }}>
        EDITAR PROMOCIÓN
      </Typography>
      <Grid container>
        <Grid item xs={6}>
          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Nombre:</Typography>
            </Grid>
            <Grid item xs={6}>
            <TextField
              value={discountData?.name || ''}
              onChange={(event) => {handleFieldChange('name', event.target.value)}}
              required
              fullWidth
              size="small"
              placeholder="Ingrese nombre"
              helperText={error.nameMessage}
              error={error.name}
            />
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
            <Typography variant="subtitle1">Tipo de descuento:</Typography>
            </Grid>
            <Grid item xs={4} style={{ marginRight: '4vh'}}>
                <TextField
                    value={discountData?.value || ''}
                    onChange={(event) => handleFieldChange('value', event.target.value)}
                    required
                    fullWidth
                    size="small"
                    placeholder="Ingrese cantidad"
                    type="number"
                    helperText={error.valueMessage}
                    error={error.value}
                />
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth>
                <Select style={{ height: '40px' }} value={discountData?.type_discount === 1 ? 'Bs' : '%'} onChange={handleTypeChange}>
                  <MenuItem value=""><em>Selecciona un tipo de descuento</em></MenuItem>
                  <MenuItem value="Bs">Bs</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '2vh' }}>
            <Typography variant="subtitle1">Tiempo de validez:</Typography>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="subtitle1">Desde:</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginRight: '2vh'}}>
              <TextField
                value={discountData?.date_start || ''}
                onChange={(event) => handleFieldChange('date_start', event.target.value)}
                required
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Hasta:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={discountData?.date_end || ''}
                onChange={(event) => handleFieldChange('date_end', event.target.value)}
                required
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: discountData?.date_start || new Date().toISOString().split('T')[0],
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Descripción:</Typography>
            </Grid>
            <Grid item xs={6}>
            <TextField
              value={discountData?.description || ''}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              required
              fullWidth
              size="small"
              placeholder="Ingrese descripción"
              multiline
              rows={5}
              helperText={error.descriptionMessage}
              error={error.description}
            />
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Límite de usos:</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={discountData?.use_max || ''}
                onChange={(event) => handleFieldChange('use_max', event.target.value)}
                required
                fullWidth
                size="small"
                placeholder="Ingrese límite"
                type="number"
                helperText={error.use_maxMessage}
                error={error.use_max}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Tipo de promoción:</Typography>
            </Grid>
            <Grid item xs={6} container flexDirection="row">
              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={discountData?.discount === 1}
                    onChange={handleTipoPromocionChange}
                    value="descuento"
                    color={discountData?.discount === 1 ? "primary" : "default"}
                    />
                  }
                  label="Descuento"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={discountData?.cupon === 1} 
                    onChange={handleTipoPromocionChange}
                    value="cupon"
                    color={discountData?.cupon === 1 ? "primary" : "default"}
                    />
                  }
                  label="Cupón"
                />
              </FormControl>
            </Grid>
          </Grid>

          {(discountData?.cupon === 1 || mostrarCodigo) &&(
            <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Código:</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={discountData?.code || ''}
                  onChange={(event) => handleFieldChange('code', event.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ingrese código de cupón"
                  helperText={error.codeMessage}
                  error={error.code}
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={10}>
            <Grid container justifyContent="flex-end" spacing={2} alignItems="center">
              <Grid item>
                <Button variant="text" onClick={handleCancel}>Cancelar</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">Confirmar</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Box> 
    </div>
  );
}

export default MiComponente;