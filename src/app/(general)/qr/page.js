'use client'
import PagoQR from '../../components/pagoQR'
import { CartProvider } from '../../contexts/CartContext.js';
import { UserProvider } from "@/app/contexts/UserContext.js";

export default function QrPage() {    
    return (
        <CartProvider>
            <UserProvider>
                    <PagoQR/>
            </UserProvider>
        </CartProvider>
    );
}

