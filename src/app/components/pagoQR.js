'use client'
import { useEffect, useState } from 'react';
import { QRCode } from 'react-qr-code';
import { Box, Grid, Typography, Button } from "@mui/material";
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import emailjs from 'emailjs-com';
import { useMemo } from 'react';
import { ENDPOINTS } from "../constants/endpoints";
import axiosInterceptorInstance from "../axios/interceptor";

const PagoQR = () => {
  const [idOrder, setIdOrder] = useState(0);
  const [mail, setMail] = useState(null);
  const apiURL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const { shippingItems, cartItems, transferToShipping} = useCart();
  const { userInfo, updateUserInfo } = useUser();
  const sendEmail = async () => {
    try {
      const emailBody = generateEmailBody();
      const emailParams = {
        to_name: userInfo.name,
        from_name: 'Urban-Market',
        message: emailBody,
        to_email: userInfo.email,
      };
    
      const result = await emailjs.send('service_dcb11vx', 'template_8wwav66', emailParams, 'K4SUrYtPfHDIG7vqN');
    } catch (error) {
    }
  };
  
  
  const generateEmailBody = () => {
    let body = `Nombre: ${userInfo.name}\n`;
    body += `Email: ${userInfo.email}\n`;
    body += `Dirección: ${userInfo.address}\n\n`;
    body += `Productos comprados:\n\n`;
    cartItems.forEach(item => {
        const discountInfo = calculateDiscountForItem(item);
        const discountDisplay = discountInfo.type === '%' ? `${discountInfo.originalValue}${discountInfo.type}` : `Bs ${discountInfo.value.toFixed(2)}`;
        body += `Producto: ${item.name}\n`;
        body += `Cantidad: ${item.quantity}\n`;
        body += `Precio Unitario: Bs ${item.price.toFixed(2)}\n`;
        body += `Descuento: ${discountDisplay}\n`;
        body += `Total c/Descuento: Bs ${(item.price * item.quantity - discountInfo.value).toFixed(2)}\n\n`;
    });

    const totalDiscountValue = cartItems.reduce((total, item) => {
        const discountInfo = calculateDiscountForItem(item);
        return total + discountInfo.value;
    }, 0);

    body += `Total Descuentos: Bs ${totalDiscountValue.toFixed(2)}\n`;
    body += `Total Final: Bs ${(totalAmount - totalDiscountValue).toFixed(2)}\n\n`;

    return body;
};

  

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userObject = JSON.parse(userString);
      const userData = userObject.user;
      updateUserInfo({
        name: userData.name,
        email: userData.email,
        address: userData.address,
      });
    }
  }, [updateUserInfo]);

  const calculateDiscountForItem = (item) => {
    const currentDate = new Date();
  
    return item.discout.reduce((totalDiscount, discountDetail) => {
      const { discount } = discountDetail;
      if (discount.discount === 1 && new Date(discount.date_start) <= currentDate && currentDate <= new Date(discount.date_end)) {
        const discountValue = parseFloat(discount.value);
        switch(discount.type_discount) {
          case 1: 
            return { value: totalDiscount.value + (discountValue * item.price / 100) * item.quantity, originalValue: discountValue, type: '%' };
          case 0: 
            return { value: totalDiscount.value + discountValue * item.quantity, type: 'Bs' };
          default:
            return totalDiscount;
        }
      }
      return totalDiscount;
    }, { value: 0, type: '' });
};



  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalDiscount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const discountAmount = calculateDiscountForItem(item);
      return total + discountAmount;
    }, 0);
  }, [cartItems]);

  const totalPrice = totalAmount - totalDiscount;

  
  const handleConfirmQR = async () => {
    try {
      const response = await axiosInterceptorInstance.get(`${ENDPOINTS.validar}/${idOrder}`);
      console.log('Respuesta de validación:', response.data.pago);
      if (response.data.pago === 0) {
        alert('No se ha realizado el pago');
      }
      else {
        alert('Se ha realizado correctamente el pago');
        await sendEmail();
        transferToShipping();
        window.location.href = '/cart';
      }
    } catch (error) {
    }

  };

  const qrExit = async () => {
    window.location.href = '/cart';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem("user"));
      setMail(user.user.email);
      const cart = JSON.parse(localStorage.getItem("cartItems"));
      let totalPrice = 0;
      let productAmount = 0;
      const details = cart.map((item) => {
        const subtotal = item.quantity * item.price;
        let discount = 0
        if (!(Array.isArray(item.discout) && item.discout.length === 0)) {
          item.discout[0].discount.type_discount==0? discount = item.discout[0].discount.value:discount =(item.price*item.discout[0].discount.value)/100;
        }

        totalPrice += subtotal;
        totalPrice -= discount;
        productAmount += item.quantity;
        return {
          product_id: item.id,
          quantity: item.quantity,
          price_unit: item.price,
          subtotal,
          discount,
        };
      })

      const sendData = async () => {
        try {
          const response = await axiosInterceptorInstance.post(ENDPOINTS.saveSale,
            {
              total: totalPrice,
              user_id: user.user.id,
              product_amount: productAmount,
              details: details,
            });
          setIdOrder(response.data.id);
        } catch (error) {
          console.error('Error al guardar:', error);
        }
      };

      sendData();
    }
  }, []);
  return (
    <Box sx={{ marginTop: "10vh", marginLeft: "26vh" }}>
      <Grid container sx={{ width: '100%' }} alignItems="center" justifyContent="center">
        <Grid item sm={6} align="center">
          <Typography variant="h4">Paga con QR</Typography>
          <Box mt={4}>
            <Typography variant="body1" sx={{ marginTop: "10vh", marginLeft: "5vh", marginRight: "5vh" }}>
              Por favor, verifique si el correo electrónico {mail} es correcto para el envío de su factura. En caso de error, presione el botón Cancelar, corrija su correo y vuelva a generar el código QR.
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "10vh", marginLeft: "5vh", marginRight: "5vh" }}>
              Escanee el código QR, luego verifique con el botón “Verificar Pago QR” para validar su transacción
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={6} align="center">
          <QRCode value={`${apiURL}/compra/payment/${idOrder}`} style={{ marginTop: "10vh" }} />
        </Grid>
      </Grid>
      <Grid container sx={{ width: '100%', marginTop: "10vh" }} alignItems="center" justifyContent="center">
        <Grid item sm={6} align="center">
          <Button
            sx={{
              backgroundColor: "#98436C",
              marginTop: "5vh",
              '&:hover': {
                backgroundColor: "#7a2a4d"
              }
            }}
            variant="contained"
            onClick={qrExit}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid item sm={6} align="center">
          <Box mt={4}>
            <Button
              sx={{
                backgroundColor: "#16193b",
                '&:hover': {
                  backgroundColor: "#0f1129"
                }
              }}
              variant="contained"
              onClick={handleConfirmQR}
            >
              Verificar Pago QR
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PagoQR;
