'use client'
import ShoppingCart from "../../components/shoppingCart.js";
import { CartProvider } from '../../contexts/CartContext.js';

export default function CarritoPage() {
        
    const onQuantityChange = (id, newQuantity) => {
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === id ? { ...product, quantity: newQuantity } : product
            )
        );
    };
    
    return (   
        <CartProvider>
            <ShoppingCart onQuantityChange={onQuantityChange} />
        </CartProvider>
    );
}
