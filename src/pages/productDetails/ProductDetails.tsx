import { useEffect, useState } from 'react';
import { Typography, Box, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router';
import { getProductById } from '../../database/select';
import type { typProduct } from '../../content/types';
import { enmSize } from '../../content/enums';
import ProductActions from './component/ProductActions';
import ProductImageSection from './component/ProductImageSection';
import ProductPriceAndRating from './component/ProductPriceAndRating';
import ProductQuantityControl from './component/ProductQuantityControl';
import ProductSizeSelector from './component/ProductSizeSelector';
import { imagePaths } from '../../assets/imagePaths';

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<typProduct | null>(null);
    const [mainImage, setMainImage] = useState('');
    const [rating, setRating] = useState<number | null>(4);
    const [size, setSize] = useState<enmSize>(enmSize.medium);
    const isMobile = useMediaQuery('(max-width:740px')	;

    useEffect(() => {
        if (id) {
            getProductById(id).then((data) => {
                if (data) {
                    setProduct(data);
                    setMainImage(data.image?.[0] ?? '');
                    setRating(data.rate ?? 4);
                }
            });
        }
    }, [id]);

    if (!product) return <Typography>Loading...</Typography>;

    const thumbnails = product.image?.filter((img) => img !== mainImage) ?? [];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 120px)',
                backgroundImage: !isMobile ?`url(${imagePaths.beans})` : '',
                backgroundPosition: 'right bottom',
                backgroundRepeat: 'no-repeat',
            }}
        >

                <Typography variant={isMobile ? 'h6' : 'h5'} mb={2}>
                    Product Details
                </Typography>

                <Box
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    gap={isMobile ? 2 : 4}
                >
                    <ProductImageSection
                        mainImage={mainImage}
                        thumbnails={thumbnails}
                        onImageClick={setMainImage}
                    />

                    <Box flex={1}>
                        <ProductActions />
                        <Typography variant={isMobile ? 'h6' : 'h5'} mt={2}>
                            {product.title}
                        </Typography>

                        <ProductPriceAndRating
                            price={product.price}
                            rating={rating}
                            description={product.description}
                        />

                        <ProductSizeSelector size={size} onChange={setSize} />

                        <ProductQuantityControl
                            productID={product.ID.toString()}
                            size={size}
                        />
                    </Box>
                </Box>
            </Box>
    );
}
