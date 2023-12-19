'use client'
import React from "react";
import { Container, Typography, Paper, Button, Box } from '@mui/material';import Image from 'next/image'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInterceptorInstance from "@/app/axios/interceptor";
import { ENDPOINTS } from "@/app/constants/endpoints";
import { useRouter } from 'next/navigation';

function Product(){
  const router = useRouter();
  const [id,setId] =useState(5);
  const [Product, setProduct]=useState();
  const hello=true;

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const id1 = urlParams.get('id');
  setId(id1);
  const getProduct = async () => {
    try {
      if (hello) {
        const response = await axiosInterceptorInstance.get(
          `${ENDPOINTS.getProduct}${id1}`
        );
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };
  getProduct()
}, []);


    return(
    <div style={{width: '80%', margin: 'auto'}}>
      {Product ? (
        <Container maxWidth="100%" sx={{ padding: 0, marginTop: 12, backgroundColor: '#f0f0f0', textAlign: 'center' }}>
      <Paper sx={{ padding: 0, display: 'flex', gap: 3, margin: 'auto', textAlign: 'center' }}>
      <img
        src={`data:image/${Product.image.split('.').pop()};base64, ${Product.imagen_base64}`}
        alt="Imagen del producto"
        style={{ maxWidth: '45%', flex: '0 0 auto' }}
      />
        <Box sx={{ flex: '1 1 auto', padding: '3%' }}>
          <Box maxWidth="100%" sx={{padding: '6px' ,backgroundColor: '#D9D9D9', textAlign: 'center', marginBottom:'20px'}}>
            <Typography variant="h4" gutterBottom>
                {Product.name}
            </Typography>
          </Box>
          <Box maxWidth="100%" sx={{padding: '6px' ,backgroundColor: '#D9D9D9', textAlign: 'center', marginBottom:'20px'}}>
            <Typography variant="h6" sx={{ }}>
              {Product.price} Bs.
            </Typography>
          </Box>
          <Box maxWidth="100%" height="170px" sx={{padding: '6px' ,backgroundColor: '#D9D9D9', textAlign: 'center', marginBottom:'20px'}}>
            <Typography variant="body1" sx={{  }}>
             {Product.description}
            </Typography>
          </Box>
          
          <Button variant="contained" color="primary" sx={{ marginTop: 2, backgroundColor: "#3B5540", borderRadius: '20px', '&:hover': {
                backgroundColor: '#2DBA78', 
              },}}>
            Añadir al carrito
          </Button>

        </Box>
      </Paper>
    </Container>
    ) : (
      <p>Loading...</p>
    )}
    </div>
    )
}

export default Product;