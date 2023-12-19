'use client'

import React, { useState } from 'react';
import { Button } from '@mui/material';
import StockUpdateModal from './StockUpdateModal';

const ProductDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStockUpdate = (updatedData) => {
    console.log('Datos actualizados:', updatedData);
    closeModal();
  };

  return (
    <div>
      <h1>Detalles del Producto</h1>
      <Button variant="outlined" onClick={openModal}>
        Actualizar Stock
      </Button>

      <StockUpdateModal open={isModalOpen} onClose={closeModal} onUpdate={handleStockUpdate}  />
    </div>
  );
};

export default ProductDetails;