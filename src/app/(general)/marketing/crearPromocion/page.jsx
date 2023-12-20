'use client'
import { useState } from 'react';
import axiosInterceptorInstance from '../../../axios/interceptor';
import { ENDPOINTS } from '../../../constants/endpoints'
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

function CrearPromocion() {
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInterceptorInstance.post(ENDPOINTS.discount, {
        name,
        description,
        type_discount,
        use_max,
        date_start,
        value,
        date_end,
        discount,
        cupon,
        code,
    })
    .then(() => {
      setName('');
      setDescription('');
      setLimit('');
      setValue('');
      setSelectType('');
      setInitialDate('');
      setFinalDate('');
      setMostrarCodigo(false);
      setTipoPromocion(null);
    })
    .catch(error => {
        console.error("Error al crear promocion:", error);
    });
  };
 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tipoPromocion, setTipoPromocion] = useState(null);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [use_max, setLimit] = useState('');
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [type_discount, setSelectType] = useState(false);
  const [date_start, setInitialDate] = useState('');
  const [date_end, setFinalDate] = useState('');
  const [discount, setDiscount] = useState(false);
  const [cupon, setCupon] = useState(false);

  const handleChange = (event) => {
    setLimit(event.target.value);
  };
  const handleChangeValue = (event) => {
    setValue(event.target.value);
  };

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };  

  const handleChangeTipoDescuento = (event) => {
    setSelectType(event.target.value === "Bs" ? false : true);
  };

  const handleTipoPromocionChange = (event) => {
    const selectedValue = event.target.value;
    setTipoPromocion(selectedValue);
    setMostrarCodigo(selectedValue === 'cupon');
    
    if (selectedValue === 'descuento') {
      setDiscount(true);
      setCupon(false);
    } else if (selectedValue === 'cupon') {
      setCupon(true);
      setDiscount(false);
    }
  };

  const handleInitialDateChange = (event) => {
    setInitialDate(event.target.value);
  };

  const handleFinalDateChange = (event) => {
    setFinalDate(event.target.value);
  };

  return (
    <Box style={{ margin: '12vh' }}>
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '8vh', marginBottom: '3vh'}}>
      <Typography variant="h4" component="h1" gutterBottom>
        CREAR PROMOCIÓN
      </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Nombre:</Typography>
            </Grid>
            <Grid item xs={6}>
            <TextField 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            size="small"
            placeholder="Ingrese nombre"
            />
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
            <Typography variant="subtitle1">Tipo de descuento:</Typography>
            </Grid>
            <Grid item xs={4} style={{ marginRight: '4vh'}}>
              <TextField
                value={value}
                onChange={handleChangeValue}
                required
                fullWidth
                size="small"
                placeholder="Ingrese cantidad"
                type="number"
              />
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth>
                <Select style={{ height: '40px' }}
                value={type_discount} 
                onChange={handleChangeTipoDescuento}
                >
                  <MenuItem value={0}>Bs</MenuItem>
                  <MenuItem value={1}>%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Typography variant="subtitle1">Tiempo de validez:</Typography>
          </Grid>

          <Grid container alignItems="center">
          <Grid item xs={2} container justifyContent="center">
            <Typography variant="subtitle1">Desde:</Typography>
          </Grid>
            <Grid item xs={3}>
              <TextField
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
                value={date_start}
                onChange={handleInitialDateChange}
              />
            </Grid>
            <Grid item xs={2} container justifyContent="center">
            <Typography variant="subtitle1" >Hasta:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
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
                value={date_end}
                onChange={handleFinalDateChange}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
                size="small"
                placeholder="Ingrese descripción"
                multiline
                rows={5}
                />

            </Grid>
          </Grid>

          <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Límite de usos:</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={use_max}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                placeholder="Ingrese límite"
                type="number"
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
                checked={tipoPromocion === 'descuento'}
                onChange={handleTipoPromocionChange}
                value="descuento"
            />
            }
            label="Descuento"
            />
             </FormControl>
             <FormControl component="fieldset">
               <FormControlLabel
                control={
                  <Checkbox
                    checked={tipoPromocion === 'cupon'}
                    onChange={handleTipoPromocionChange}
                    value="cupon"
                  />
                }
                label="Cupón"
               />
             </FormControl>
            </Grid>
          </Grid>

          {mostrarCodigo && (
            <Grid container alignItems="center" style={{ marginBottom: '4vh' }}>
              <Grid item xs={4} container justifyContent="flex-end">
                <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Código:</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={code}
                  onChange={handleChangeCode}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ingrese código de cupón"
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end" spacing={2} alignItems="center">
              <Grid item>
                <Button variant="text">Cancelar</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">Confirmar</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Box> 
    </Box>
  );
}

export default CrearPromocion;

