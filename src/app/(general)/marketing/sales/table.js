'use client'
import React,{ useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import axiosInterceptorInstance from '@/app/axios/interceptor';
import { ENDPOINTS } from '@/app/constants/endpoints';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


const headCells = [
  {
    id: 'id',
    label: 'ID',
  },
  {
    id: 'name',
    label: 'Nombre producto',
  },
  {
    id: 'precio',
    label: 'Precio',
  },
  {
    id: 'stock',
    label: 'Stock',
  },
  {
    id: 'marca',
    label: 'marca',
  },
];

function EnhancedTableHead(props) {
  const {order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


function EnhancedTable({idDiscount}) {
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataProduct, setFilteredDataProduct] = useState([]);

const getAllPromotion = async () => {
  const response = await axiosInterceptorInstance.get(`${ENDPOINTS.promotionAndProduct}`)
    if(response.status === 200){
      setFilteredData(response.data); 
    }
};


const getAllProduct = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idDiscount = urlParams.get('id');
  const response = await axiosInterceptorInstance.get(`${ENDPOINTS.promotionAndProducts}/${idDiscount}`)
    if(response.status === 200){
      setFilteredDataProduct(response.data);
    }
};

useEffect(() => {
  getAllPromotion();
  getAllProduct();
}, []);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

 
  const [clickedRows, setClickedRows] = useState([]);

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    const dataPromotion = {
      discount_id: idDiscount,
      product_id: id,
    };
    const insertProduct = async () => {
      const response = await axiosInterceptorInstance.post(`${ENDPOINTS.promotionAndProduct}`,dataPromotion)
        if(response.status === 200){
          console.log("Producto añadido correctamente");
          setFilteredData(response.data); 
        }
    };
    if (selectedIndex === -1) {
      insertProduct();
    }
    setSelected(newSelected);
    setClickedRows([...clickedRows, id]);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (id) => {
    if (selected.indexOf(id) !== -1 || filteredDataProduct.some(item => item.product_id === id)) {
      return true;
    }
    return false;
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
  const visibleRows = useMemo(
    () =>
        stableSort(filteredData, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
    [filteredData, order, orderBy, page, rowsPerPage],
);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    selected={isItemSelected}
                  >
                    <TableCell>
                    <Checkbox
                      color='primary'
                      onClick={(event) => handleClick(event, row.id)}
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                      disabled={clickedRows.includes(row.id)}
                    />
                    </TableCell>
                    <TableCell>
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                    <TableCell align="left">{row.stock}</TableCell>
                    <TableCell align="left">{row.brand}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      
    </Box>
  );
}
export default EnhancedTable;