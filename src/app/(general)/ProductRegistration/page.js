"use client"
import { Container, Typography, Paper, TextField, Button, Grid, Box, Select, MenuItem, InputLabel, Input, FormHelperText } from '@mui/material';
import { useState,useEffect } from 'react';
import {registroProducto,productSchema} from '../../constants/schemas/validacionProducto';
import { ENDPOINTS } from '../../constants/endpoints';
import axiosInterceptorInstance from '../../axios/interceptor';
import { useRouter } from 'next/navigation';
function ProductRegistration() {
  const router = useRouter();
  const [Categories, setCategories] =useState([]);
  const [product, setProduct] = useState({
    name: '',
    code: '',
    description:'',
    price:'0',
    stock:'0',
    brand:'',
    provider:'',
    image:'',
    category_id:0,
    updated_at:"2023-10-30",
    created_at:"2023-10-30",
  });

  const errorValues = {
    name: false,
    code: '',
    description:false,
    price:false,
    stock:false,
    brand:false,
    provider:'',
    image:false,
    category_id: false,
    updated_at:'',
    created_at:''
  }

  const [error, setError] = useState(errorValues);

  useEffect(() => {
    const getCategories = async () => {
      try {
          const response = await axiosInterceptorInstance.get(
            ENDPOINTS.getCategories
          );
          setCategories(response.data);
          console.log(response.data);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
      }
    };
    getCategories()
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Si es un campo de archivo, actualiza la imagenProducto
    if (name === 'image') {
      setProduct((prevCategory) => ({
        ...prevCategory,
        image: files[0],
      }));
    } else {
      validateField('name',product.name);
      validateField('price',product.price);
      validateField('stock',product.stock);
      validateField('description',product.description);
      validateField('brand',product.brand);
      //validateField(e.target.image,e.target.value);
      setProduct((prevProducto) => ({ ...prevProducto, [name]: value }));
    }
  };

  const validateField = async (fieldName, value) => {
    try {
      await registroProducto.validateAt(fieldName, { [fieldName]: value });
      setError((prevError) => ({ ...prevError, [fieldName]: false, [fieldName + 'Message']: '' }));
    } catch (err) {
      setError((prevError) => ({ ...prevError, [fieldName]: true, [fieldName + 'Message']: err.message }));
    }
  };

  const handleSave = () => {
    // Validar que los campos requeridos no estén vacíos
    const requiredFields = ['name', 'price', 'stock','description','brand'];
    const emptyFields = requiredFields.filter(field => !product[field]);
  
    if (emptyFields.length > 0) {
      alert('Todos los campos requeridos deben estar llenos');
      return false;
    }else {
      return true;
    }
  }  


  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica para enviar los datos del producto al servidor
    console.log('Datos del nuevo producto:', product);
    // También puedes agregar aquí la lógica para redirigir a la página de detalles del producto, etc.

    console.log('validacion nombre: ', error.name );
    console.log('validacion descripcion: ', error.description );
    console.log('validacion precio: ', error.price );
    console.log('validacion stock', error.stock);
    console.log('validacion marca' , error.brand);
    console.log('validacion categoria' , error.category_id);

    console.log("validacion final: " , ((!error.name || !error.description || !error.price || !error.stock || !error.brand) && handleSave() /*!error.image */));

    if ((!error.name || !error.description || !error.price || !error.stock || !error.brand) && handleSave() /*!error.image */){
      console.log("estoy entrando")
      const formData = new FormData();
      console.log ("formData");
      formData.append('name', product.name);
      formData.append('code', product.code);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('stock', product.stock);
      formData.append('brand', product.brand);
      formData.append('provider', product.provider);
      formData.append('image', product.image);
      formData.append('category_id', 1);
      console.log (formData.get('name'));
      axiosInterceptorInstance.post(ENDPOINTS.registerProduct,
        formData
        )
        .then(() => {
        alert("Producto registrado exitosamente")
      })
    }

    
  };

  return (
    <Container maxWidth="80%" sx={{ marginTop: 4, width: '70%' }}>
      <Paper sx={{ padding: '5%', paddingTop: '2%', paddingBottom: '2%' }}>
        <Typography variant="h1" gutterBottom  sx={{color:'#3B5540', fontSize: '32px'}}>
        Registrar producto
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nombre de producto"
                name="name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.name}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.name}
                helperText = {error.nameMessage}
                sx={{ marginBottom: 0 }}
                

              />
              <TextField
                label="Código de producto"
                name="code"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.code}
                onChange={handleChange}
                sx={{ marginBottom: 0 }}
              />
              <TextField
                label="Precio de producto"
                name="price"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.price}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.price}
                helperText = {error.priceMessage}
                sx={{ marginBottom: 0 }}
              />
              <TextField
                label="Marca de producto"
                name="brand"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.brand}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.brand}
                helperText = {error.brandMessage}
                sx={{ marginBottom: 0 }}
              />
              <TextField
                label="Proveedor"
                name="provider"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.provider}
                onChange={handleChange}
                sx={{ marginBottom: 0 }}
              />
              
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoria"
                name="category_id"
                fullWidth
                value={product.category_id}
                onChange={handleChange}
                error={error.category_id}
                helperText = {error.category_idMessage}
                label="Categoría"
                sx={{ marginBottom: 0 }}
              >
                {
                  Categories.map((category)=>
                  <MenuItem value={category.id}>{category.name}</MenuItem>)
                }
              </Select>
              
            </Grid>

            {/* Centro: Cuadro para subir imagen */}
            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Box sx={{ border:'1px solid #C4C4C4', padding: '5%', height: '365px', borderRadius: '4px'}}>
                <Input
                    type="file"
                    accept="image/*"
                    id='image'
                    name='image'
                    onChange={handleChange}
                    /*onChange={(e) =>{
                      handleChange(e);
                      validateField(e);
                    }}
                    error = {error.image}*/
                    sx={{ marginTop: 1, marginBottom: 1 }}
                />
                <Typography variant="caption">
                    Sube la imagen del producto
                </Typography>
              </Box>
              <TextField
                label="Cantidad"
                name="stock"
                fullWidth
                margin="normal"
                variant="outlined"
                value={product.stock}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.stock}
                helperText = {error.stockMessage}
                sx={{ marginBottom: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="description"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                variant="outlined"
                value={product.description}
                onChange={(e) =>{
                  handleChange(e);
                  validateField(e);
                }}
                error = {error.description}
                helperText = {error.descriptionMessage}
                sx={{ marginTop: 0.5 }}
              />
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

export default ProductRegistration;