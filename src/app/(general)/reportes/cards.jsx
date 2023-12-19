"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, Button } from "@mui/material";

export default function ActionAreaCard({
  control,
  title,
  amount,
  color,
  icono,
  fun,
}) {
  function formatNumberInBob(number) {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }).format(number);
  }

  return (
    <Card sx={{ maxWidth: "100%", height: "100%", backgroundColor: color }}>
      <CardContent sx={{ color: "white" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              fontWeight={"bold"}
            >
              {control === 1 ? formatNumberInBob(amount) : amount}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              height: "50px",
              width: "50px",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              color: color,
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{ marginY: "10px" }}
            >
              {icono}
            </Typography>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{ color: "white", fontWeight: "bold" }}
          onClick={fun}
        >
          Ver gráfica
        </Button>
      </CardActions>
    </Card>
  );
}
