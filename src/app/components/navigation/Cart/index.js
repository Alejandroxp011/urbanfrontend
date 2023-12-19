import { Badge, IconButton, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function Cart({ itemCount = 0 }) {
    return (
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
                <Tooltip title="Carrito" arrow>
                    <Badge badgeContent={itemCount} color="secondary">
                        <ShoppingCartIcon sx={{ color: 'white' }} />
                    </Badge>
                </Tooltip>
            </IconButton>
        </Link>
    );
};