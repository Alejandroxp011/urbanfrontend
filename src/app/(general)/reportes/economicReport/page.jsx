'use client'
import {
   TableContainer,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Select,
   MenuItem,
   Stack,
   Typography,
   Container,
   Box
} from "@mui/material";
import axiosInterceptorInstance from "@/app/axios/interceptor";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/constants/endpoints";
import { MONTHS } from "@/app/constants/months";
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function EconomicReport() {
   const [data, setData] = useState([]);
   const [availableYears, setAvailableYears] = useState([]);
   const [yearSelected, setYearSelected] = useState();
   const [typeReport, setTypeReport] = useState('month');
   const [total, setTotal] = useState();
   const getData = async (params = {}) => {
      const res = await axiosInterceptorInstance.get(ENDPOINTS.economicReport, { params: params });
      if (res.status === 200) {
         setData(res.data.data);
         setTotal(res.data.total);
      }
   }
   const getAvailableYears = async () => {
      const res = await axiosInterceptorInstance.get(ENDPOINTS.ordersYear);
      if (res.status === 200) {
         setAvailableYears(res.data.data);
         setYearSelected(res.data.data[0].year);
      }
   }

   useEffect(() => {
      getAvailableYears();
   }, [])


   useEffect(() => {
      yearSelected && getData({ year: yearSelected, typeReport: typeReport });
   }, [yearSelected, typeReport])


   const generatePdf = () => {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Reporte de Ingresos', 14, 22);

      doc.setFontSize(12);
      doc.text(`Tipo de informe: ${typeReport === 'month' ? 'Mensual' : 'Anual'}`, 14, 32);

      if (typeReport === 'month') {
         doc.text(`Año: ${yearSelected}`, 14, 42);
      }

      const headers = typeReport === 'month' ? [['Mes', 'Subtotal']] : [['Año', 'Subtotal']];

      const bodyData = typeReport === 'month'
         ? data.map(element => [MONTHS[element.month - 1], `${element.total} Bs`])
         : data.map(element => [element.year, `${element.total} Bs`]);

      autoTable(doc, {
         startY: 50,
         head: headers,
         body: bodyData,
         theme: 'striped',
         headStyles: { fillColor: [196, 196, 196] },
         styles: { cellPadding: 5, fontSize: 11 },
      });

      doc.setFontSize(12);
      let finalY = doc.lastAutoTable.finalY || 50;
      doc.text(`Total: ${total} Bs`, doc.internal.pageSize.getWidth() - 70, finalY + 20);

      doc.save('reporte_ingresos.pdf');
   }


   return (
      <>
         <Container maxWidth={'lg'} sx={{ paddingLeft: '200px' }}>
            <Stack spacing={5} marginTop={'64px'}>
               <Typography variant="h4">Reporte de Ingresos</Typography>
               <Stack direction={'row'} spacing={3}>
                  <Select label='Tipo de informe' defaultValue={'month'} onChange={(e) => setTypeReport(e.target.value)}>
                     <MenuItem value={'month'} >{'Mensual'}</MenuItem>
                     <MenuItem value={'year'} >{'Anual'}</MenuItem>
                  </Select>
                  {
                     (availableYears.length > 0) &&
                     <Select defaultValue={availableYears[0].year} onChange={(e) => setYearSelected(e.target.value)} disabled={typeReport === 'year'}>
                        {
                           availableYears.map((year, index) => (
                              <MenuItem key={index} value={year.year}>
                                 {year.year}
                              </MenuItem>
                           ))
                        }
                     </Select>
                  }
               </Stack>
               <TableContainer sx={{ borderWidth: '2px', borderStyle: 'groove' }} >
                  <Table sx={{}}>
                     <TableHead sx={{ backgroundColor: '#C4C4C4' }}>
                        <TableRow >
                           <TableCell sx={{ textAlign: 'center' }}>
                              {typeReport === 'month' ? 'Mes' : 'Año'}
                           </TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>
                              {'Subtotal'}
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {
                           data.map((element, index) => (
                              <TableRow key={index}>
                                 <TableCell sx={{ textAlign: 'center' }}>{typeReport === 'month' ? MONTHS[element.month - 1] : element.year}</TableCell>
                                 <TableCell sx={{ textAlign: 'center' }}>{`${element.total} Bs`}</TableCell>
                              </TableRow>
                           ))
                        }

                     </TableBody>
                  </Table>
               </TableContainer>
               <Box alignSelf={'end'} sx={{ backgroundColor: '#C4C4C4', padding: '20px' }}>
                  <Typography fontWeight={'25px'}>
                     {'Total:    '}
                     {total ? `     ${total} Bs` : ""}
                  </Typography>
               </Box>
               <Box alignSelf={'end'} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={generatePdf}>Generar PDF</Button>
               </Box>
            </Stack>
         </Container>
      </>
   )
}
export default EconomicReport;
