'use client'

import { useState, useEffect } from 'react' ;
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Container } from '@mui/system';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton  from '@mui/material/IconButton';
import  Typography from  '@mui/material/Typography';

import axiosInterceptorInstance from '@/app/axios/interceptor';
import { ENDPOINTS } from '@/app/constants/endpoints';
import EditIcon from '@mui/icons-material/Edit';
import  Select  from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

import DatosCupon from '@/app/components/modalPromociones/page';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

  
function TableFilter () {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchName, setSearchName] = useState('');
  const router = useRouter();
  const [mostrar,setMostrar] = useState(false);
  const[id,setIde]=useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  

  const abrirCerrarModal = (id) => {
    setIde(id);
    setMostrar(!mostrar);
  }

  const abrirCerrarModalProducto = (id) => {
    router.push(`/marketing/sales?id=${id}`);
  }


  const handleEditPromotion = (id) => {
    router.push(`/marketing/editPromotion?id=${id}`);

  };
  


  const sendNotification = async (id) => { 
    try {
     await axiosInterceptorInstance.get(`${ENDPOINTS.email}/${id}`);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }


  const fetchData = async () => {
    try {
      
      const response = await axiosInterceptorInstance.get(ENDPOINTS.discounts);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, []);
 

  const handleSearch = () => {
    
    const filtered = data.filter(item =>{if (searchTerm === 'cupón') {
                          return item.cupon === 1;
                          } else if (searchTerm === 'descuento') {
                          return item.discount === 1;
                          } else {
                          return true; 
                         
    }
  
    });
   
   setFilteredData(filtered);
  };
  const handleOptionChange = (event) => {
    setSearchTerm(event.target.value);
   
  };
  const handleSearchName = () => {
    
    const filtered = data.filter(item =>
    item.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredData(filtered);
  };
  
  
  return (
    
   <>

    
    
      <Container fixed sx={{marginTop:"10vh",marginLeft:"15vw"}}>
      <Typography variant="h4" component="h1" align='center'>
        Gestionar Promoción
    </Typography>
          <Container fixed sx={{ height:"20px"}}></Container>
         
          <Stack direction="row" spacing={2} alignItems="center" alignContent={'center'}>
               <Typography variant="String"  align='center'>
                    Tipo de Promoción
               </Typography>
                
              <Select style={{ height: '50px',width:"300px" }}
                  value={searchTerm} 
                  onChange={handleOptionChange }
                >
                <MenuItem value="cupón">cupón</MenuItem>
                <MenuItem value="descuento">descuento</MenuItem>
               </Select>
      
              <IconButton onClick={() =>  handleSearch()}>
                  <SearchIcon/>
              </IconButton>
                 
              <Typography variant="String"  align='center'>
                   Nombre de la promoción
              </Typography>
                 
              <TextField
                     
                        label="promocion"
                        variant="outlined"
                        value={searchName}
                        sx={{ width: 300,height: '50px' }}s
                        onChange={(e) => setSearchName(e.target.value)}
                        onClick={() => {
                          handleSearchName();
        
                                }}
                  />
                   
              <IconButton onClick={() =>   handleSearchName()}>
              <SearchIcon/>
             </IconButton>
                  
              <Button  style={{ backgroundColor: 'blue', color: 'white'}} onClick={() => router.push('/marketing/crearPromocion')}> 
                          Añadir
              </Button>
        
        </Stack> 
  
        <Container fixed sx={{ height:"30px"}}></Container> 
         
      
   
                      
     
<TableContainer  sx={{ border: 1,maxHeight: 400, overflowY: 'auto' }}  component={Paper}>
      <Table sx={{ minWidth: 650,fontSize: 5}} stickyHeader aria-label="sticky table" >
        <TableHead >
          <TableRow   >
            <TableCell  align="center"   >id</TableCell>
            <TableCell align="center">Nombre </TableCell>
            <TableCell align="center">Descripción</TableCell>
            <TableCell align="center">Tipo de Promoción</TableCell>
            <TableCell align="center">Productos</TableCell>
            <TableCell  align="center">acciones</TableCell>     
          </TableRow>
        </TableHead >
        <TableBody >
          {filteredData.map((row) => (
            <TableRow
              key={row.id}
           
             
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="center" 
                    >{row.name}</TableCell>
              <TableCell align="center">{row.description }</TableCell>
              <TableCell align="center">{row.cupon===1?("cupón"):("descuento")}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => abrirCerrarModalProducto(row.id)}>
                  <AddCircleOutlineIcon/>
                </IconButton>
               </TableCell>
              
              <TableCell aling="center">
           
               <Stack direction="row" spacing={1} alignItems="raight" alignContent={'center'}>
                  
               <Button style={{ backgroundColor: 'blue', color: 'white'}} onClick={() => handleEditPromotion(row.id)}>
               <EditIcon/>
               </Button>
               <Button style={{ backgroundColor: 'red', color: 'white'}}  onClick={() => abrirCerrarModal(row.id)}> 
                    
                  <DeleteIcon/>
                        
                  </Button>
                  
                  <Button style={{ backgroundColor: 'green', color: 'white'}}  onClick={() => sendNotification(row.id)}> 
                    
                    <NotificationsActiveIcon/>
                          
                     </Button>
                  
               </Stack>
             

               </TableCell>
             


            </TableRow>
          ))}
                            

        </TableBody>
        
      </Table>
    </TableContainer>
    {
           mostrar &&  < DatosCupon isOpen={mostrar} onClose={abrirCerrarModal}  id={id}/>
    }
    <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
     
    </Container>
   
  
    </>
  );
}

export default TableFilter;
