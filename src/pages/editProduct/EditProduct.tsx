import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { getProductById, getAllCategories } from '../../database/select';
import type { typProduct, typCategory } from '../../content/types';
import { updateProduct } from '../../database/update';
import ImageUploader from './component/ImageUploader';
import ProductFields from './component/ProductFields';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/configuration'; // adjust path if needed
import { v4 } from 'uuid'; // for unique filenames
import { insertProduct } from '../../database/insert';
import { useDispatch } from 'react-redux';
import { setToast } from '../../redux/slices/toastSlice';
import { enmToastSeverity } from '../../content/enums';

type Props = {
    isEditMode: boolean;
};

export default function EditProduct({ isEditMode }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<typProduct | null>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<typCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<typCategory | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        let unsub: () => void;
        if (isEditMode && id) {
            Promise.all([
                getProductById(id),
                new Promise<typCategory[]>((resolve) => {
                    unsub = getAllCategories((data) => {
                        resolve(Object.values(data));
                    });
                }),
            ]).then(([productData, categoryList]) => {
                setCategories(categoryList);
                if (productData) {
                    setProduct(productData);
                    setTitle(productData.title);
                    setPrice(productData.price);
                    setDescription(productData.description);
                    setImages(productData.image ?? []);
                    const match = categoryList.find(c => +c.ID === +productData.category);
                    setSelectedCategory(match ?? null);
                }
            });
        } else {
            unsub = getAllCategories((data) => {
                const categoryList = Object.values(data);
                setCategories(categoryList);
                setSelectedCategory(categoryList[0] ?? null);
            });
        }

        return () => { if (unsub) unsub(); };
    }, [id, isEditMode]);


    const handleSubmit = async () => {
        if (!selectedCategory) return;

        const uploadedImageURLs = await Promise.all(
            images.map(async (img) => {
                if (img.startsWith('https://')) return img;
                const imgRef = ref(storage, `products/${id ?? v4()}/${v4()}.jpg`);
                await uploadString(imgRef, img, 'data_url');
                return await getDownloadURL(imgRef);
            })
        );

        const newOrUpdatedProduct: typProduct = {
            ...(product ?? {
                ID: v4(),
                createdAt: Date.now(),
                rate: 0,
            }),
            title,
            price,
            description,
            image: uploadedImageURLs,
            category: Number(selectedCategory.ID),
        };

        const saveAction = isEditMode ? updateProduct : insertProduct;
        await saveAction(newOrUpdatedProduct).then(() => {
            const msg = isEditMode ? 'Update' : 'Added'
            dispatch(setToast({ message: `${msg} Successfully` , severity: enmToastSeverity.success }));
            navigate(-1);
        }).catch((error) => {
            dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }))
        })
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5">{product ? 'Edit Product' : 'Add Product'}</Typography>
            <ImageUploader images={images} setImages={setImages} />
            <ProductFields
                title={title}
                setTitle={setTitle}
                price={price}
                setPrice={setPrice}
                description={description}
                setDescription={setDescription}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}
