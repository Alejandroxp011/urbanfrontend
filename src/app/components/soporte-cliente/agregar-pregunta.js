import {useState} from 'react';
import axiosInterceptorInstance from '../../axios/interceptor'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Typography} from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import {ENDPOINTS} from '../../constants/endpoints'

const style = {
  width:"500px",
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    margin-top:20px;
    margin-bottom: 20px;
    width: 500px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  return (
    <>
      <Box sx={{margin:'5rem'}}>
      <Button onClick={handleOpen} startIcon={<AddIcon />}>
        Agregar
      </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h4" gutterBottom>
         Pregunta frecuente
      </Typography>

        <TextField sx={{width:"100%",margi:'50px'}} id='titulo' label="Titulo de la pregunta"/>
        <Textarea  id='respuesta' aria-label="minimum height" minRows={6} placeholder="Respuesta" />

        <Box>
            <Button sx={"margin-left:30px;"} variant="contained" onClick={handleClose}>Cancelar</Button>
            <ChildModal id={props.user_id} sx={"margin-right:40px;"} handleClose={handleClose} />
        </Box>
        </Box>
      </Modal>
    </>
  );
}

function ChildModal(props) {
  const [open, setOpen] = useState(false);
  const [message,setmessage]= useState("");
  const [error,setError] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const agregarPregunta=()=>{
    
    let title= document.getElementById("titulo").value;
    let answer=document.getElementById("respuesta").value;
    const questionData = {
      title: title,
      answer: answer,
      user_id: props.id,
  };
  
  axiosInterceptorInstance.post(ENDPOINTS.addFAQ, questionData)
      .then(response => {
          setError(false);
          handleOpen();
      })
      .catch(error => {
        setError(true);
          handleOpen();
      });
  }

  return (
    <>
      <Button sx={"margin-left:30px;"} variant="outlined" onClick={agregarPregunta}>Agregar</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ width: "250px",
    position: "absolute",
    top: '40%',
  left: '40%',
    padding: "5px 20px 13px 20px",
    background: "#fff",
    borderRadius:"5px"}}>
          <Typography variant="h6" id="child-modal-title">{error?"Error":"Creado Exitosamente"}</Typography>

          <Button variant="contained" color={error?"error":"success"}onClick={()=>{
            window.location.reload();
          }}>ok</Button>
        </Box>
      </Modal>
    </>
  );
}