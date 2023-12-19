import { useCart } from '../contexts/CartContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const ProductQuantityButtons = ({ product }) => {
    const { addToCart, decreaseQuantity } = useCart();

    const handleIncreaseQuantity = () => {
        addToCart({ ...product, quantity: product.quantity + 1 });
    };

    const handleDecreaseQuantity = () => {
        decreaseQuantity(product.id);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
            <Button
                onClick={handleDecreaseQuantity}
                disabled={product.quantity <= 1}
                style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    border: '2px solid black',
                    borderRadius: '50%',
                    padding: '4px 6px',
                    cursor: product.quantity <= 1 ? 'not-allowed' : 'pointer',
                    minWidth: '30px',
                    height: '30px',
                    fontSize: '17px',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                –
            </Button>
            <TextField
                value={product.quantity}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                    style: {
                        textAlign: 'center', 
                        border: 'none',
                        height: '30px',
                    }
                }}
                variant="standard"
                size="small"
                style={{
                    width: '27px',
                    paddingLeft: '13px',
                    marginle: '0', 
                    display: 'flex',
                    alignItems: 'center', 
                }}
            />

            <Button
                onClick={handleIncreaseQuantity}
                style={{
                    backgroundColor: 'black', 
                    color: 'white', 
                    border: '2px solid black',
                    borderRadius: '50%',
                    padding: '4px 6px',
                    cursor: 'pointer',
                    minWidth: '30px',
                    height: '30px',
                    fontSize: '20px',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                +
            </Button>          
        </div>
    );
};

export default ProductQuantityButtons;
