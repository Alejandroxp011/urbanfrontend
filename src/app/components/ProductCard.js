import { Card, CardMedia, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';

function transformProduct(item) {
    return {
        id: item.id,
        name: item.name,
        productCode: item.code,
        description: item.description,
        price: parseFloat(item.price),
        stockAmount: item.stock,
        productBrand: item.brand,
        provider: item.provider,
        image: `data:image/${item.image.split('.').pop()};base64, ${item.imagen_base64}`,
        categoryId: item.category_id,
        quantity: item.stock,
        discout: item.promotions,
            };
}

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasPromotion = product.promotions && product.promotions.length > 0;

  const handleAddToCart = (product) => {
    const transformedProduct = transformProduct(product);
    const productString = JSON.stringify(transformedProduct, null, 2);
    addToCart(transformedProduct);
};

const handleCardClick = () => {
  window.location.href = `/producto?id=${product.id}`;
};

  const styleLabel = {
    position: 'absolute',
    top:0,
    left: 0,
    zIndex: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 20px',
  };

  const styleDescription = {
    width:'100%',
    position:'absolute',
    top: '40%',
    left: 0,
    zIndex:99,
    padding:'2px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  };

  return (
    <Card sx={{ width:"30%", position: 'relative', marginX:1, marginY:1}}>
      <CardMedia
        component="img"
        height="200"
        src={`data:image/${product.image.split('.').pop()};base64, ${product.imagen_base64}`}
        alt={product.name}
        onClick={handleCardClick}
      />

      {hasPromotion && (
        <>
          <Box sx={styleLabel}>
            <Typography>Oferta limitada</Typography>
          </Box>
          <Box sx={styleDescription}>
            <Typography>{product.promotions[0].discount.name}</Typography>
          </Box>
        </>
      )}

      <CardContent>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
          {product.name}
        </Typography>

        {hasPromotion ? (
          <Stack direction={'row'} justifyContent={'space-around'}>
            <Box>
              <Typography variant="body2">Antes:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {product.price} Bs.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">Ahora:</Typography>
              <Typography variant="body2" color="text.secondary">
                {Number((Number(product.price) - Number(product.promotions[0].discount.value)).toFixed(2))} Bs.
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {product.price} Bs.
          </Typography>
        )}

        <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginTop: 2,
              backgroundColor: "#6788C3",
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: '#6788D9',
              },
            }}
            onClick={() => handleAddToCart(product)}
          >
            Añadir al carrito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
