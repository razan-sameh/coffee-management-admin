import { useCallback, useEffect, useReducer, useState } from 'react';
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
import { formReducer } from '../../reducers/productFormReducer';

type Props = {
    isEditMode: boolean;
};

export default function EditProduct({ isEditMode }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<typProduct | null>(null);
    const [categories, setCategories] = useState<typCategory[]>([]);
    const [form, dispatchForm] = useReducer(formReducer, {
        title: '',
        price: 0,
        description: '',
        images: [],
        selectedCategory: null,
    });

    const setImages = useCallback((imgs: string[]) => {
        dispatchForm({ type: 'SET_IMAGES', payload: imgs });
    }, []);

    const setSelectedCategory = useCallback((cat: typCategory | null) => {
        dispatchForm({ type: 'SET_CATEGORY', payload: cat });
    }, []);

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
                    dispatchForm({ type: 'SET_TITLE', payload: productData.title });
                    dispatchForm({ type: 'SET_PRICE', payload: productData.price });
                    dispatchForm({ type: 'SET_DESCRIPTION', payload: productData.description });
                    dispatchForm({ type: 'SET_IMAGES', payload: productData.image ?? [] });
                    const matched = categoryList.find(c => +c.ID === +productData.category);
                    dispatchForm({ type: 'SET_CATEGORY', payload: matched ?? null });
                }
            });
        } else {
            unsub = getAllCategories((data) => {
                const list = Object.values(data);
                setCategories(list);
                dispatchForm({ type: 'SET_CATEGORY', payload: list[0] ?? null });
            });
        }

        return () => { if (unsub) unsub(); };
    }, [id, isEditMode]);

    const handleSubmit = async () => {
        if (!form.selectedCategory) return;

        try {
            const uploadedImageURLs = await Promise.all(
                form.images.map(async (img) => {
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
                title: form.title,
                price: form.price,
                description: form.description,
                image: uploadedImageURLs,
                category: Number(form.selectedCategory.ID),
            };

            const saveAction = isEditMode ? updateProduct : insertProduct;

            await saveAction(newOrUpdatedProduct);
            dispatch(setToast({
                message: `${isEditMode ? 'Updated' : 'Added'} Successfully`,
                severity: enmToastSeverity.success,
            }));
            navigate(-1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }));
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5">{product ? 'Edit Product' : 'Add Product'}</Typography>
            <ImageUploader images={form.images} setImages={setImages} />
            <ProductFields
                title={form.title}
                setTitle={(val) => dispatchForm({ type: 'SET_TITLE', payload: val })}
                price={form.price}
                setPrice={(val) => dispatchForm({ type: 'SET_PRICE', payload: val })}
                description={form.description}
                setDescription={(val) => dispatchForm({ type: 'SET_DESCRIPTION', payload: val })}
                categories={categories}
                selectedCategory={form.selectedCategory}
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
