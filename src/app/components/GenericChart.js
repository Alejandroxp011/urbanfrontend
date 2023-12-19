import { Box, Typography } from '@mui/material';
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GenericChart = ({ yaxisData, xaxisData, chartName, month, year }) => {

   const COLORS = new Map([["Ventas", "#f44336"], ["Ingresos", "#4caf50"], ["Egresos", "#2196f3"], ["Usuarios", "#ffd301"]]);

   const data = [
      {
         name: chartName,
         type: 'area',
         data: yaxisData,
      },
   ];
   const chartOptions = {
      chart: {
         type: 'line',
         zoom: {
            enabled: false,
         },
      },
      dataLabels: {
         enabled: true,
         style: {
            colors: [COLORS.get(chartName)],
            opacity: 0.6,
         },
      },
      stroke: {
         curve: 'smooth',
         colors: [COLORS.get(chartName)],
      },
      fill: {
         type: 'solid',
         opacity: [0.35, 1],
         colors: [COLORS.get(chartName), 'transparent'],
      },
      grid: {
         row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
         },
      },
      xaxis: {
         categories: xaxisData
      },
      noData: {
         text: 'No hay datos para mostrar.',
         align: 'center',
         verticalAlign: 'middle',
         offsetX: 0,
         offsetY: 0,
         style: {
            color: '#547290',
            fontSize: '16px',
         },
      },
   };
   return (
      <Box sx={{ minHeight: "100%", width: "100%" }}>
         <Typography
            sx={{ fontWeight: 'bold', color: '#16193b', marginTop: "10px" }}
            variant="h6"
            id="dashBoardTitle"
         >
            Grafica de {chartName} - {month} {year}
         </Typography>
         <ApexChart options={chartOptions} series={data} height={400}/>
      </Box>
   )
}

export default GenericChart;