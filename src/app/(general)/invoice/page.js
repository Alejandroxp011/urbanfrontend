'use client'
import Invoice from "@/app/components/Invoice.js";
import { CartProvider } from '../../contexts/CartContext.js';
import { UserProvider } from "@/app/contexts/UserContext.js";

export default function InvoicePage() {   
    return (
        <CartProvider>
           <UserProvider>
                <Invoice/>
           </UserProvider>
        </CartProvider>
        );
}
