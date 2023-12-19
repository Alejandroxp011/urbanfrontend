import { createContext, useContext, useState, useEffect, useMemo} from 'react';
import { Snackbar } from '@mui/material';

const CartContext = createContext({
    cartItems: [],
    shippingItems: [],
    addToCart: () => {},
    decreaseQuantity: () => {},
    removeFromCart: () => {},
    transferToShipping: () => {},
    clearShippingItems: () => {},
    clearCart: () => {},
    itemCount: 0,
    couponCode: '',
    setCouponCode: () => {},
    applyCoupon: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [shippingItems, setShippingItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [snackbar, setSnackbar] = useState({open: false,message: '',});
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    
    useEffect(() => {
        const localData = localStorage.getItem('cartItems');
        const localShippingData = localStorage.getItem('shippingItems');
        if (localData) {
        setCartItems(JSON.parse(localData));
        }
        if (localShippingData) {
        setShippingItems(JSON.parse(localShippingData));
        }
    }, []);

    const itemCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    useEffect(() => {
        if (isCouponApplied) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isCouponApplied]);

    const applyCoupon = () => {
        if (isCouponApplied) {
            setSnackbar({ open: true, message: 'Ya se aplicó un cupón' });
            return;
        }
        let couponApplied = false;
        setCartItems((prevItems) => {
            const newItems = prevItems.map(item => {
                const discount = item.discout.find(d => d.discount.code === couponCode && d.discount.cupon === 1);
                if (discount) {
                    couponApplied = true;
                    const discountValue = parseFloat(discount.discount.value);
                    let newPrice = item.price;
                    if (discount.discount.type_discount === 1) { // Porcentaje
                        newPrice -= (discountValue / 100) * item.price;
                    } else if (discount.discount.type_discount === 0) { // Valor fijo
                        newPrice -= discountValue;
                    }
                    return { ...item, price: Math.max(newPrice, 0) };
                }
                return item;
            });
            return newItems;
        });
    
        if (couponApplied) {
            setSnackbar({ open: true, message: 'Cupón aplicado con éxito.' });
            setIsCouponApplied(true);
        } else {
            setSnackbar({ open: true, message: 'Cupón no válido.' });
        }
        setCouponCode('');
    };
                
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(item => item.id === product.id);
            let newItems;
            if (existingProduct) {
                if (existingProduct.quantity < product.stockAmount) {
                    newItems = prevItems.map(item => 
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    setSnackbar({ open: true, message: `Se ha agregado otra unidad de ${product.name} al carrito.` });
                } else {
                    setSnackbar({ open: true, message: 'No se pueden agregar más unidades de este producto, stock limitado.' });
                    return prevItems;
                }
            } else {
                newItems = [...prevItems, { ...product, quantity: 1 }];
                setSnackbar({ open: true, message: `${product.name} agregado al carrito.` });
            }
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };
    
    

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(item => item.id === productId);
            let newItems;
            if (existingProduct && existingProduct.quantity > 1) {
                newItems = prevItems.map(item => 
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                newItems = prevItems.filter(item => item.id !== productId);
            }
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const newItems = prevItems.filter(item => item.id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        setIsCouponApplied(false);
    };

    const transferToShipping = () => {
        try {
            setShippingItems(cartItems);
            localStorage.setItem('shippingItems', JSON.stringify(cartItems));
            setCartItems([]);
            localStorage.removeItem('cartItems');
        } catch (error) {
            console.error("Error al transferir productos al envío: ", error);
        }
    };

    const clearShippingItems = () => {
        setShippingItems([]);
        localStorage.removeItem('shippingItems');
    };
    
    return (
        <CartContext.Provider value={{ 
            cartItems, 
            shippingItems,
            addToCart, 
            decreaseQuantity, 
            removeFromCart, 
            transferToShipping,
            clearShippingItems,
            clearCart, 
            itemCount,
            couponCode,
            setCouponCode,
            applyCoupon
        }}>
            {children}
            <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            ContentProps={{
                style: {
                backgroundColor: '#93bfed',
                color: 'black',
                fontSize: '16px',
                },
            }}
            message={<span id="message-id">{snackbar.message}</span>}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            />

        </CartContext.Provider>
    );
};
