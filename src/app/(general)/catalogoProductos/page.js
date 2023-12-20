'use client'
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { PRODUCT_SELECT_OPTIONS } from '@/app/constants/productSelectOptions';
import ProductCard from '../../components/ProductCard';
import { CartProvider } from "@/app/contexts/CartContext";
import axiosInterceptorInstance from "@/app/axios/interceptor";
import { ENDPOINTS } from "@/app/constants/endpoints";
import { Tooltip, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import BasicModal from "../marketing/cuponDescuento/page";

function ProductsCatalog() {
  const [products, setProducts] = useState([]);
  const [selectValue, setSelectValue] = useState(PRODUCT_SELECT_OPTIONS.all);

  const navigateToGestion = () => {
    window.location.href = '/marketing/gestion';
  };

  useEffect(() => {
   const getProducts = async () => {
     try {
         const response = await axiosInterceptorInstance.get(
           `${ENDPOINTS.products}/${200}/${selectValue}`
         );
         setProducts(response.data.data);
     } catch (error) {
     }
   };
   getProducts()
 }, [selectValue]);

return (
  <>
  <BasicModal />
  <CartProvider>
  <Grid container spacing={3} sx={{ width: '70%', margin: 'auto', marginTop: 12}}>
    <Grid item xs={12}>
      <Tooltip title="Gestionar promoción" arrow>
        <IconButton onClick={navigateToGestion}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <TextField 
        label="Productos" 
        select 
        variant="filled" 
        fullWidth 
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
      >
        <MenuItem value={PRODUCT_SELECT_OPTIONS.all}>Todos</MenuItem>
        <MenuItem value={PRODUCT_SELECT_OPTIONS.inOffer}>En Oferta</MenuItem>
        <MenuItem value={PRODUCT_SELECT_OPTIONS.noOffer}>Sin Oferta</MenuItem>
      </TextField>
    </Grid>
    {products.map((product) => (
      <ProductCard 
        key={product.id} 
        product={product}
      />
    ))}
  </Grid>
  </CartProvider>
  </>
);
}

export default ProductsCatalog;



