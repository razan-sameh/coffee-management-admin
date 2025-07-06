
import { useEffect, useMemo, useState } from "react";
import { imagePaths } from '../../assets/imagePaths';
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid';
import type { typProduct, typCategory, typOrder } from '../../content/types';
import { deleteProductById } from '../../database/delete';
import { getAllCategories, getAllProducts } from '../../database/select';
import { getColumns } from './component/columns';
import { useNavigate } from "react-router";

export default function OrderList() {
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
        <SmartDataGrid<typOrder & { id: string | number; userName?: string }>
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
                    title: "Order List",
                    showColumns: false,
                    showExport: false,
                    showAdd: false
                },
            }}
            onView={(id) => navigate(`/order/${id}`)}
        />)
}
