"use client"
import { Container, Typography, Paper, TextField, Button, Grid, Box, Select, MenuItem, InputLabel, Input} from '@mui/material';
import { useState } from 'react';
import {registerCategory} from '../../constants/schemas/category';
import {ENDPOINTS} from '../../constants/endpoints'
import axiosInterceptorInstance from '@/app/axios/interceptor';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function CreateCategory() {
  const router = useRouter();
  const [category, setCategory] = useState({
    name: "",
    detail: "",
    icon: null,
    category_parent_id: ""
  });

  const errorValues = {
    name: false,
    detail: false,
    icon:false,
    categoryParent: ''
  }

  const [error, setError] = useState(errorValues);

  const [Categories, setCategories] =useState([]);

useEffect(() => {
    const getCategories = async () => {
      try {
          const response = await axiosInterceptorInstance.get(
            ENDPOINTS.getCategories
          );
          setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
      }
    };
    getCategories()
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Si es un campo de archivo, actualiza el icono de la categoria
    if (name === 'icon') {
      setCategory((prevCategory) => ({
        ...prevCategory,
        icon: files[0],
      }));
    }else {
      setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
    }
  };

  const validateField = async (fieldName, value) => {
    try {
      await registerCategory.validateAt(fieldName, { [fieldName]: value });
      setError((prevError) => ({ ...prevError, [fieldName]: false, [fieldName + 'Message']: '' }));
      return false;
    } catch (err) {
      setError((prevError) => ({ ...prevError, [fieldName]: true, [fieldName + 'Message']: err.message }));
      return true;
    }
  };

  const handleSave = () => {
    const requiredFields = ['name', 'detail'];
    const emptyFields = requiredFields.filter(field => !category[field]);
  
    if (emptyFields.length > 0) {
      alert('Todos los campos requeridos deben estar llenos');
      return false;
    }else {
      return true;
    }
  }  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de la nueva categoria:', category);
    validateField('name',category.name);
    validateField('detail',category.detail);

    console.log(error.name);
    console.log(error.detail);

    if (!(error.name || error.detail) && handleSave()){
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('detail', category.detail);
      formData.append('category_parent_id', category.category_parent_id);
      formData.append('icon', category.icon);
      axiosInterceptorInstance.post(ENDPOINTS.creatcategory,   
      formData
        )
      .then(() => {
        alert("Categoria registrada exitosamente")
      })
    }
  };

  return (
    <Container maxWidth="80%" sx={{ marginTop: '90px', width: '70%' }}>
      <Paper sx={{ padding: '5%', paddingTop: '2%', paddingBottom: '2%' }}>
        <Typography variant="h1" gutterBottom  sx={{color:'#3B5540', fontSize: '32px', marginTop: '20px'}}>
        Crear Categoria
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nombre de categoria"
                name="name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={category.name}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.name}
                helperText = {error.nameMessage}
                sx={{ marginBottom: '14px' }}
              /> 
              <TextField
                label="Detalle"
                name="detail"
                fullWidth
                multiline
                rows={8}
                margin="normal"
                variant="outlined"
                value={category.detail}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.detail}
                helperText = {error.detailMessage}
                sx={{ marginBottom: '14px' }}
              />

            <InputLabel id="categoria-label">Categoría padre</InputLabel>
              <Select
                labelId="categoria-label"
                id="Categoria Padre"
                name="category_parent_id"
                fullWidth
                value={category.category_parent_id}
                onChange={handleChange}

                label="Categoría"
                sx={{ marginBottom: 0 }}
              >
                
                {
                  Categories.map((category)=>
                  <MenuItem value={category.id}>{category.name}</MenuItem>)
                }
              </Select>

            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Box sx={{ border:'1px solid #C4C4C4', padding: '5%', height: '365px', borderRadius: '4px', marginTop:'15px'}}>
                <Input
                    type="file"
                    accept="image/*"
                    id='icon'
                    name="icon"
                    onChange={handleChange}
                    sx={{ marginTop: 1, marginBottom: 1 }}
                />
                <Typography variant="caption">
                    Sube el icono de la categoria
                </Typography>
              </Box>
            </Grid>

              
              
          </Grid>

          <Box sx={{ marginTop: 2, width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="contained" sx={{backgroundColor: '#D33838', borderRadius: '15px',height: '50px', width: '200px', '&:hover': {
                backgroundColor: '#1976D2', // Cambia al color que desees al pasar el mouse
              }, }} onClick={() => router.push('/productAdmin')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{backgroundColor: '#6788C3' , borderRadius: '15px',height: '50px', width: '200px', '&:hover': {
                backgroundColor: '#32569B', // Cambia al color que desees al pasar el mouse
              }, }} >
              Registrar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCategory;
 