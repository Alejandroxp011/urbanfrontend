import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const shippingSteps = ["Pendiente", "Procesando", "En camino", "Entregado"];

function ShippingProgressBar({ estadoActual }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const i = shippingSteps.indexOf(estadoActual);
    setActiveStep(i >= 0 ? i : 0);
  }, [estadoActual]);

  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      {shippingSteps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default ShippingProgressBar;
