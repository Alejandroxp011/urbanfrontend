'use client'
import axiosInterceptorInstance from '../../../axios/interceptor'
import { useEffect, useState, useMemo } from 'react';
import { Button, Container, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import pdf from '../pdfGenerator';
import EnhancedTableHead from './enhancedTableHead';
import { ENDPOINTS } from '@/app/constants/endpoints';

const Reports = () => {
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [data, setData] = useState([]);
    const [sourceData, setSourceData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await axiosInterceptorInstance.get(ENDPOINTS.inventaryReportData + startDate + '/' + endDate);
        if (res.status == 200) {
            let data = await res.data;
            data = processData(data);
            setSourceData(data);
            setData(data);
        }  
    }

    const generateReport = () => {
        getData();
    };

    const handleDateChange = (newDate, dateSource) => {
        newDate = dayjs(newDate).format("YYYY-MM-DD");
        if (dateSource === 'start') {
            setStartDate(newDate);
        } else {
            setEndDate(newDate);
        }
    };


    const processData = (data) => {
        let processedData = [];
        data.map(inventary => {
            let totalQuantity = 0;
            let totalAmount = 0;
            let dateInventorie = 'none';
            inventary.inventories.map(inventorie => {
                totalAmount += inventorie.buying_amount;
                dateInventorie = inventorie.buying_date;

            })
            inventary.selection_details.map(inventorie => {
                totalQuantity += inventorie.quantity;                ;
           
            })

            dateInventorie = dateInventorie== 'none' ? '': dayjs(dateInventorie).format("DD-MM-YYYY");
            processedData.push(
                getProductJSON(inventary.id, inventary.name, totalQuantity, totalAmount, dateInventorie, inventary.stock));
        });
        return processedData;
    };

    const getProductJSON = ( id, name, quantity, amount, buyDate, stock) => {
        let inventorieData =
        {
            id: id,
            name: name,
            quantity: quantity,
            amount: amount,
            buyDate: buyDate,
            stock: stock,
        };
        return inventorieData;
    };

    const productSearch = (text) => {
        let matchData;
        if (text === "") {
            matchData = sourceData;
        } else {
            matchData = sourceData.filter(product => {
                let productName = product.name.toLowerCase();
                return productName.includes(text.toLowerCase())
            });
        }
        setData(matchData);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const visibleRows = useMemo(
        () =>
            stableSort(data, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [data, order, orderBy, page, rowsPerPage],
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return 1;
        }
        if (b[orderBy] > a[orderBy]) {
            return -1;
        }
        return 0;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const generatePdf = () => {
        let pdfInfo = {title: "Reporte de inventarios", fileName: "reporte_inventarios"};
        let filters = [
            {
                name: "Fecha inicio",
                value: startDate
            },
            {
                name: "Fecha fin",
                value: endDate
            },
        ];
        const tableHeads = ["Producto", "Cant. Adquirida", "Cant. Vendida", "Fecha de Compra", "Cant. Actual"];
        pdf(pdfInfo, filters, tableHeads, data);
    };

    return (
        <Container style={{ marginTop: "10vh" }}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Typography
                        sx={{ flex: '1 1 100%', p: 2 }}
                        variant="h5"
                        id="tableTitle"
                        component="div"
                    >
                        Informe de Inventarios
                    </Typography>
                    <Toolbar>
                        <Grid container spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid item xs={2}>
                                    <DatePicker
                                        format='DD/MM/YYYY'
                                        defaultValue={dayjs(startDate)}
                                        maxDate={dayjs(endDate)}
                                        onChange={(newValue) => handleDateChange(newValue, 'start')}
                                        slotProps={{ textField: { size: 'small', helperText: 'Fecha inicio' } }} />
                                </Grid>
                                <Grid item xs={2}>
                                    <DatePicker
                                        format='DD/MM/YYYY'
                                        defaultValue={dayjs(endDate)}
                                        minDate={dayjs(startDate)}
                                        onChange={(newValue) => handleDateChange(newValue, 'end')}
                                        slotProps={{ textField: { size: 'small', helperText: 'Fecha fin' } }} />
                                </Grid>
                            </LocalizationProvider>
                            <Grid item xs={2}>
                                <Button variant="outlined" onClick={e => generateReport()}>Generar</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField sx={{ width: '100%' }} id="productSearch" label="Buscar producto..."
                                    variant="outlined" size='small' onKeyUp={(e) => productSearch(e.target.value)} />
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            stickyHeader
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.quantity}</TableCell>
                                            <TableCell align="right">{row.buyDate}</TableCell>
                                            <TableCell align="right">{row.stock}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={"Productos por pagina"}
                    />
                </Paper>
                <Box sx={{ width: '100%' }}>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Espaciado de filas denso"
                        style={{ width: '88%' }}
                    />
                    <Button variant="outlined" onClick={generatePdf}>Generar PDF</Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Reports