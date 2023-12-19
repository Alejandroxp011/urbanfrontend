"use client";
import axiosInterceptorInstance from "../../../axios/interceptor";
import { useEffect, useState, useMemo, Fragment } from "react";
import { Button, Container, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EnhancedTableHead from "./enhancedTableHead";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import pdf from "../pdfGenerator";
import { ENDPOINTS } from "../../../constants/endpoints";

const Reports = () => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    const res = await axiosInterceptorInstance.get(ENDPOINTS.userReportData);
    if (res.status == 200) {
      let data = await res.data;
      setSourceData(data);
      setData(data);
    }
  };

  const generateReport = () => {
    getData();
  };

  const clientSearch = (text) => {
    let matchData;
    if (text === "") {
      matchData = sourceData;
    } else {
      let useData = [];
      matchData = sourceData.filter((client) => {
        let clientData =
          client.name.toLowerCase() + " " + client.email.toLowerCase();
        return clientData.includes(text.toLowerCase());
      });
    }
    setData(matchData);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const visibleRows = useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [data, order, orderBy, page, rowsPerPage]
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
    return order === "desc"
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
    let pdfInfo = {
      title: "Reporte de usuarios registrados",
      fileName: "reporte_usuarios",
    };
    let filters = [
      {
        name: " ",
        value: " ",
      },
      {
        name: " ",
        value: " ",
      },
    ];
    const tableHeads = [
      "Nombre",
      "Dirección",
      "E-mail",
      "Celular",
      "Fecha de Registro",
    ];
    const data2 = data.map((item) => {
      return [
        item.id,
        item.name,
        item.address,
        item.email,
        item.phone,
        item.created_at,
      ];
    });
    pdf(pdfInfo, filters, tableHeads, data2);
  };

  return (
    <Container style={{ marginTop: "10vh" }}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Typography
            sx={{ flex: "1 1 100%", p: 2 }}
            variant="h5"
            id="tableTitle"
            component="div"
          >
            Informe de usuarios registrados
          </Typography>
          <Toolbar>
            <Grid container spacing={2}></Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ width: "100%" }}
                id="clientSearch"
                label="Buscar cliente..."
                variant="outlined"
                size="small"
                onKeyUp={(e) => clientSearch(e.target.value)}
              />
            </Grid>
          </Toolbar>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
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
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.address}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">
                        {dayjs(row.created_at).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
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
            labelRowsPerPage={"Clientes por pagina"}
          />
        </Paper>

        <Box sx={{ width: "100%" }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Espaciado de filas denso"
            style={{ width: "88%" }}
          />
          <Button variant="outlined" onClick={generatePdf}>
            Generar PDF
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Reports;
