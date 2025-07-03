import { useEffect, useMemo, useState } from "react";
import { imagePaths } from '../../assets/imagePaths';
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid';
import type { typProduct, typCategory } from '../../content/types';
import { deleteProductById } from '../../database/delete';
import { getAllCategories, getAllProducts } from '../../database/select';
import { getColumns } from './component/columns';
import { useNavigate } from "react-router";

export default function ProductList() {
    const [categories, setCategories] = useState<Record<string, typCategory>>({});
    const [products, setProducts] = useState<Record<string, typProduct>>({});
    const navigate = useNavigate()
    useEffect(() => {
        const unsubscribe = getAllCategories((data) => {
            setCategories(data);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = getAllProducts((data) => {
            setProducts(data);
        });
        return unsubscribe;
    }, []);

    const mappedProducts = useMemo(() => {
        return Object.entries(products).reduce((acc, [id, product]) => {
            const categoryMatch = Object.values(categories).find(cat => +cat.ID === +product.category);
            acc[id] = {
                ...product,
                id,
                categoryTitle: categoryMatch?.title || "Unknown"
            };
            return acc;
        }, {} as Record<string, typProduct & { id: string | number; categoryTitle?: string }>);
    }, [products, categories]);

    return (
        <SmartDataGrid<typProduct & { id: string | number; categoryTitle?: string }>
            getColumns={(rowModesModel, actions) => getColumns(rowModesModel, actions)}
            getData={(callback) => {
                callback(mappedProducts);
                return () => { };
            }}
            deleteData={deleteProductById}
            mapRow={(id, pro, index) => ({ ...pro, id, no: index + 1 })}
            imageBackground={imagePaths.beans}
            slotProps={{
                toolbar: {
                    title: "Product List",
                    showColumns: false,
                    showExport: false,
                    showAdd: true
                },
            }}
            onEdit={(id) => navigate(`/product/edit/${id}`)}
            onAdd={() => navigate('/product/add')}
            onView={(id) => navigate(`/product/${id}`)}
        />
    );
}
