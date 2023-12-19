'use client'
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { Paper, Table, TableBody, TableCell, TableContainer, Button, TableHead, TableRow } from '@mui/material';

const Invoice = () => {
  const { cartItems } = useCart();
  const { userInfo, updateUserInfo } = useUser();

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
                case 1: // Porcentaje
                    return { value: totalDiscount.value + (discountValue * item.price / 100) * item.quantity, originalValue: discountValue, type: '%' };
                case 0: // Valor fijo
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
        const discountInfo = calculateDiscountForItem(item);
        return total + discountInfo.value;
    }, 0);
}, [cartItems]);


  const handleCart = () => {
    window.location.href = '/cart';
  };

  const totalPrice = totalAmount - totalDiscount;

  const styles = {
    paperContainer: {
      padding: 20,
      fontSize: '0.875rem',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      width: '60%',
      margin: 'auto',
      padding: '20px',
      height: '100vh'
    },
    header: {
      fontWeight: 'bold',
      padding: '16px 0',
      textAlign: 'center',
    },
    section: {
      margin: '20px 0',
    },
    table: {
      width: '100%',
      marginBottom: '20px',
    },
    tableRow: {
      backgroundColor: '#dedcdc',
    },
    tableCell: {
      border: '1px solid #ddd',
      padding: '8px',
    },
    bold: {
      fontWeight: 'bold',
    },
    totalsRow: {
      backgroundColor: '#dedcdc',
    },
  };

  return (
    <Paper style={styles.paperContainer}>
      <div style={styles.header}>FACTURA</div>
      <div style={styles.section}>
        <div style={styles.bold}>Información de facturación:</div>
        <div>{userInfo.name}</div>
        <div>{userInfo.email}</div>
        <div>{userInfo.address}</div>
        
      </div>
      <TableContainer component={Paper} style={styles.table}>
        <Table>
          <TableHead>
            <TableRow style={styles.tableRow}>
              <TableCell style={styles.tableCell}>Cantidad</TableCell>
              <TableCell style={styles.tableCell}>Descripción</TableCell>
              <TableCell style={styles.tableCell}>Precio (Unitario)</TableCell>
              <TableCell style={styles.tableCell}>Descuento</TableCell>
              <TableCell style={styles.tableCell}>Total c/Descuento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {cartItems.map((item, index) => {
              const discountInfo = calculateDiscountForItem(item);
              const discountDisplay = discountInfo.type === '%' ? `${discountInfo.originalValue}${discountInfo.type}` : `${discountInfo.value.toFixed(2)} Bs`;
              return (
                  <TableRow key={index}>
                      <TableCell style={styles.tableCell}>{item.quantity}</TableCell>
                      <TableCell style={styles.tableCell}>{item.name}</TableCell>
                      <TableCell style={styles.tableCell}>{`${item.price.toFixed(2)} Bs`}</TableCell>
                      <TableCell style={styles.tableCell}>{discountDisplay}</TableCell>
                      <TableCell style={styles.tableCell}>
                          {`${(item.price * item.quantity - discountInfo.value).toFixed(2)} Bs`}
                      </TableCell>
                  </TableRow>
              );
          })}
            <TableRow style={styles.totalsRow}>
              <TableCell colSpan={4} style={styles.tableCell}>Total Descuentos</TableCell>
              <TableCell style={styles.tableCell}>{`${totalDiscount.toFixed(2)} Bs`}</TableCell>
          </TableRow>
            <TableRow style={styles.totalsRow}>
              <TableCell colSpan={4} style={styles.tableCell}>Total Final</TableCell>
              <TableCell style={styles.tableCell}>{`${totalPrice.toFixed(2)} Bs`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
        <Button
            variant="contained" onClick={handleCart}
            color="primary"
            fullWidth
            sx={{ marginBottom: 2, backgroundColor: '#16193b', color: 'white', ':hover': { backgroundColor: '#32569b' } }}
        >
            regresar
        </Button>
    </Paper>
  );
};

export default Invoice;
