'use client'
import { Box } from "@mui/material"
import axiosInterceptorInstance from "@/app/axios/interceptor"
import GenericChart from "@/app/components/GenericChart"
import { CHART_NAMES } from "@/app/constants/chartNames"
import { ENDPOINTS } from "@/app/constants/endpoints"
import { useState, useEffect } from "react"
import { MONTHS } from '@/app/constants/months'

const RenevueChart = () => {
   const [data, setData] = useState([]);

   const getData = async () => {
      const res = await axiosInterceptorInstance.get(
         ENDPOINTS.economicReport,
         {
            params: { year: 2023, typeReport: 'month' }
         })
      if (res.status === 200) {
         getOnlyTotal(res.data.data);
      }
   }

   const getOnlyTotal = (arrayTotalPerMonth) => {
      const onlyTotal = arrayTotalPerMonth.map((totalPerMonth) => totalPerMonth.total);
      console.log(onlyTotal);
      setData(onlyTotal);
   }

   useEffect(() => {
      getData();
   }, [])

   useEffect(() => {
   }, [data])


   return (
      <Box sx={{ minHeight: "100%" }}>
         <GenericChart xaxisData={MONTHS} yaxisData={data} chartName={CHART_NAMES.revenueChart} />
      </Box>
   )
}

export default RenevueChart;