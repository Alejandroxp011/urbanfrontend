import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Paper, Card, Box, Grid, Typography, Container, Button, IconButton } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductQuantityButtons from "./productQuantityButtons";
import { useCart } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';
import ProductoConEstado from './ProductWithStatus';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const ShoppingCart = ({ onQuantityChange }) => {
    const { shippingItems, cartItems, removeFromCart, clearCart, clearShippingItems, couponCode, setCouponCode, applyCoupon} = useCart();
    const handleCouponChange = (event) => {
        setCouponCode(event.target.value);
    };

    const handleRemoveProduct = (productId) => {
        removeFromCart(productId);
    };

    const handleEmptyCart = () => {
        clearCart();
    };

    const handleBackToHome = () => {
        window.location.href = '/catalogoProductos';
    };

    const handleInvoice = () => {
        window.location.href = '/invoice';
    };

    const handleQR = () => {
        window.location.href = '/qr';
    };

    const handleEnvios = () => {
        clearShippingItems();
    }

    const totalmount = () => {
        let totalPrice = 0;
    
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        const roundedTotal = Number(totalPrice.toFixed(2));        
        return roundedTotal;
    };
    const totalDiscount = () => {
        return cartItems.reduce((total, item) => {
            return total + calculateTotalDiscountForItem(item);
        }, 0);
    };

    const getTotalBuy = () => {    
        const roundedTotal = Number((totalmount()-totalDiscount()).toFixed(2));        
        return roundedTotal;
    };

    const calculateTotalDiscountForItem = (item) => {
        if (!item.discout) return 0;
    
        return item.discout.reduce((total, discountDetail) => {
            if (discountDetail.discount.discount !== 1) return total;
    
            const discountValue = parseFloat(discountDetail.discount.value);
            return discountDetail.discount.type_discount === 1 
                ? total + (discountValue * item.price / 100) * item.quantity
                : total + discountValue * item.quantity;
        }, 0);
    };

    return (
    <UserProvider>
    <Container sx={{ maxWidth: 'lg', margin: '0 auto', padding: '10px', height: '100vh'}}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
                <Paper elevation={3} sx={{ paddingTop: 10, paddingRight: 2, paddingLeft: 18, margin: '0 auto' }}>
                    <Grid container alignItems="center">
                        <Grid item xs={0}>
                            <ShoppingCartOutlinedIcon sx={{ fontSize: 50 }} />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000', marginLeft: 1 }}>
                                Tu Carrito de Compras
                            </Typography>
                        </Grid>                
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                startIcon={<DeleteSweepIcon />}
                                onClick={handleEmptyCart}
                                sx={{ backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                            >
                                Vaciar carrito
                            </Button>
                        </Grid>
                    </Grid>
                    <Container sx={{ width: '95%', mx: 'auto', mt: 5, mb: 0 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={5}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#868585' }}>
                                    PRODUCTO
                                </Typography>            
                            </Grid>
                            <Grid item xs={4} container justifyContent="center">
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#868585' }}>
                                    PRECIO
                                </Typography>
                            </Grid>
                            <Grid item xs={3} container justifyContent="center">
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#868585' }}>
                                    CANTIDAD
                                </Typography>
                            </Grid>                    
                        </Grid>
                    </Container>
                    {cartItems.map(item => (
                        <Box key={item.id} sx={{ mt: 1 }}>
                            <Card variant="outlined" sx={{ transition: "0.3s",'&:hover': { backgroundColor: 'rgba(0,0,0,0.00)', transform: 'scale(1.03)' }, borderRadius: '10px', borderWidth:2,}}>
                                <Grid container alignItems="center" sx={{ padding: 1.2 }} height="200"> 
                                    <Grid item xs={5}>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', marginRight:20, borderRadius: '7px'}} />
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4B4B4B' }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.provider}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4} container justifyContent="center">
                    <Box>
                        <Typography>{'Precio: Bs '}{item.price}</Typography>
                        {item.discout && item.discout.map((discountDetail, index) => {
                            const { discount } = discountDetail;
                            const discountDisplay = discount.type_discount === 1 ? `${discount.value}%` : `Bs${discount.value}`;
                            return (
                                <Typography key={index}>
                                    {discount.discount === 1 ? `Descuento: ${discountDisplay}` : ''}
                                </Typography>
                            );
                        })}
                    </Box>
                </Grid>

                                    <Grid item xs={2} container justifyContent="center">
                                        <ProductQuantityButtons product={item} onQuantityChange={onQuantityChange} />
                                    </Grid>

                                    <Grid item xs={1} container justifyContent="flex-end">
                                        <IconButton onClick={() => handleRemoveProduct(item.id)} aria-label="delete" sx={{ color: 'black', '&:hover': { color: '#32569b'} }}>
                                            <DeleteIcon sx={{ fontSize: '2rem' }} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    ))}
                </Paper>
                <Paper elevation={3} sx={{ paddingTop: 3, paddingRight: 2, paddingBottom: 3, paddingLeft: 18, margin: '0 auto' }}>
                    <Grid container alignItems="center">
                        <Grid item xs={0}>
                            <LocalShippingOutlinedIcon sx={{ fontSize: 50 }} />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000', marginLeft: 1 }}>
                                Pedidos
                            </Typography>
                        </Grid> 
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                startIcon={<DeleteSweepIcon />}
                                onClick={handleEnvios}
                                sx={{ backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                            >
                                Limpiar Pedidos
                            </Button>
                        </Grid>
                    </Grid> 
                    <Box sx={{ mt: 2 }}>
                        {shippingItems.map((producto, index) => (
                            <ProductoConEstado key={index} producto={producto} />
                        ))}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3} sx={{ paddingTop: 10, position: 'sticky', top: 60, height: 'fit-content'}}>
                <Grid container justifyContent="center" >
                    <Button variant="contained" onClick={handleBackToHome} fullWidth
                        sx={{ marginTop: 7, backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                    >
                    Agregar Productos
                    </Button>
                </Grid>
                <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Resumen de pedido
                </Typography>
                <Typography variant="body1">
                    Subtotal: {'Bs '}{totalmount()}
                </Typography>
                <Typography variant="body1">
                    Descuento total: {'Bs '}{totalDiscount().toFixed(2)}
                </Typography>      
                <Typography variant="body1">
                    Total de la compra: {'Bs '}{getTotalBuy()}
                </Typography>
                    <Box sx={{ marginTop: 4 }}>
                    <TextField
                        label="Código del Cupón"
                        variant="outlined"
                        value={couponCode}
                        onChange={handleCouponChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={applyCoupon}
                        fullWidth
                        sx={{ mb: 2, backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                    >
                        Aplicar Cupón
                    </Button>
                    <Button 
                        variant="contained" onClick={handleInvoice} 
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                        >
                        Ver Factura
                    </Button>
                    <Button
                        variant="contained" onClick={handleQR}
                        color="primary"
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
                    >
                        Finalizar Compra
                    </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    </Container>
    </UserProvider>
    );
};

ShoppingCart.propTypes = {
    onQuantityChange: PropTypes.func.isRequired
};

export default ShoppingCart;
