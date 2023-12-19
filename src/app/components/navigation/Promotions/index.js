import { IconButton, Tooltip } from "@mui/material";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Link from "next/link";

export default function Promotions(){
  return(
    <Link href="/catalogoProductos" style={{ display: 'flex', alignItems: 'center'}}>
      <IconButton>
        <Tooltip title="Promociones" arrow>
          <CardGiftcardIcon sx={{ color: 'white' }} ></CardGiftcardIcon>
        </Tooltip>
      </IconButton>
    </Link>
  );
};