'use client'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import  Typography from  '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useEffect } from 'react';
import axiosInterceptorInstance from "../../axios/interceptor";
import { ENDPOINTS } from "../../constants/endpoints";
import { useRouter } from 'next/navigation';
import StockUpdateModal from './StockUpdateModal';

const productAdmin = () => {
  const router = useRouter();
  const [productos, setproductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idStock, setIdStock]=useState(0)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axiosInterceptorInstance.get(ENDPOINTS.getProducts);
        setproductos(response.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    getProducts();
  }, []);
  const openModal = (id) => {
    setIdStock(id)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStockUpdate = (updatedData) => {
    closeModal();
  };
  return (
    <Box sx={{ marginTop: "10vh", marginLeft: "30vh"}}>
      <Typography variant="h4" align='center'>GESTION DE PRODUCTOS</Typography>
      <Button  sx={{
                margin: "5px",
                backgroundColor: "#16193b", 
                '&:hover': { 
                  backgroundColor: "#0f1129"
                }
              }}variant="contained" onClick={() => router.push('/productRegistration')}> 
                          Añadir Producto
      </Button>
      <Button  sx={{
                margin: "5px",
                backgroundColor: "#16193b", 
                '&:hover': { 
                  backgroundColor: "#0f1129"
                }
              }}variant="contained" onClick={() => router.push('/categoryRegister')}> 
                          Añadir categorias
      </Button>
      <TableContainer sx={{ border: 1, maxHeight: 500, overflowY: 'auto' }} component={Paper}>
        <Table sx={{ minWidth: 650, fontSize: 5 }} stickyHeader aria-label="sticky table" >
          <TableHead >
            <TableRow   >
              <TableCell align="center">id</TableCell>
              <TableCell align="center">Nombre </TableCell>
              <TableCell align="center">Descripción</TableCell>
              <TableCell align="center">Precio</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Marca</TableCell>
              <TableCell align="center">Proveedor</TableCell>
              <TableCell align="center">Categoria</TableCell>
              <TableCell align="center">Editar</TableCell>
            </TableRow>
          </TableHead >
          <TableBody >
            {productos.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{row.stock}
                <IconButton onClick={() => openModal(row.id)}>
                  <AddCircleOutlineIcon/>
                </IconButton>
                </TableCell>
                <TableCell align="center">{row.brand}</TableCell>
                <TableCell align="center">{row.provider}</TableCell>
                <TableCell align="center">{row.category_id}</TableCell>
                
                <TableCell aling="center">

                  <Stack direction="row" spacing={1} alignItems="raight" alignContent={'center'}>

                    <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => router.push(`/edicionProducto?id=${row.id}`)}>
                      <EditIcon />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StockUpdateModal open={isModalOpen} onClose={closeModal} onUpdate={handleStockUpdate} id={idStock} />
    </Box>
    
  )

}
export default productAdmin;