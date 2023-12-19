import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import EnvioStepper from './ShippingProgressBar';

function ProductoConEstado({ producto }) {
  const estadosEnvio = ["Pendiente", "Procesando", "En camino", "Entregado"];
  const [estadoEnvio, setEstadoEnvio] = useState(estadosEnvio[0]);

  const avanzarEstadoEnvio = () => {
    const indiceActual = estadosEnvio.indexOf(estadoEnvio);
    const nuevoEstado = estadosEnvio[(indiceActual + 1) % estadosEnvio.length];
    setEstadoEnvio(nuevoEstado);
  };

  return (
    <Card 
      sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)',
        borderRadius: '10px',
        overflow: 'hidden',
        maxWidth: '100%',
        background: '#DFDFE6',
        mb: 2
      }} 
      onClick={avanzarEstadoEnvio}
    >
      <Grid container alignItems="center" sx={{ padding: 1.2 }}>
        <Grid item xs={2}>
          <CardMedia
            component="img"
            sx={{ width: '80px', height: '80px', borderRadius: '7px'}}
            image={producto.image}
            alt={producto.name}
          />
        </Grid>
        <Grid item xs={3}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4B4B4B' }}>
              {producto.name}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item xs={7}>
          <EnvioStepper estadoActual={estadoEnvio} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default ProductoConEstado;
