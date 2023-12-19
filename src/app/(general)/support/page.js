'use client'
import { useEffect, useState } from 'react'
import FAQ from '../../components/soporte-cliente/preguntas-frecuentes/preguntas';
import BasicModal from '../../components/soporte-cliente/agregar-pregunta';
import SearchBar from "../../components/soporte-cliente/SearchBar";
import { Box } from "@mui/material";
import axiosInterceptorInstance from '../../axios/interceptor'
import { ENDPOINTS } from '../../constants/endpoints'
import styles from './page.module.css'

export default function SupportPage() {
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    
    const fetchFaqs = async () => {
      try {
        const response = await axiosInterceptorInstance.get(ENDPOINTS.FAQS);
        const userData = await axiosInterceptorInstance.get('/user')
        setUser( userData.data);
        setFaqs(response.data.faqs);
        setData(response.data.faqs);

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };

    fetchFaqs();
  }, []);





  return (
    <Box sx={ {margin: "10rem"  }}>
      {user?.is_admin==1?<BasicModal user_id={user.id}></BasicModal>:""}
      <SearchBar faqs={faqs} setFaqs={setFaqs} initialData={data} />
      <FAQ admin={user?.is_admin} faqs={faqs} />
   </Box>
   
  )
}
