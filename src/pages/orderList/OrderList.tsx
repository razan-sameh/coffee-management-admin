
import { useEffect, useMemo, useState } from "react";
import { imagePaths } from '../../assets/imagePaths';
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid';
import type { typOrder } from '../../content/types';
import { deleteProductById } from '../../database/delete';
import { getAllOrders } from '../../database/select';
import { getColumns } from './component/columns';
import { useNavigate } from "react-router";
import { useStaticData } from "../../hook/useStaticData";

export default function OrderList() {
    const [orders, setOrders] = useState<Record<string, typOrder>>({});
    const { users } = useStaticData();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeOrders = getAllOrders((data) => {
            setOrders(data);
        });
        return () => {
            unsubscribeOrders();
        };
    }, []);

    const mappedOrders = useMemo(() => {
        return Object.entries(orders).reduce((acc, [id, order]) => {
            const user = users[order.userId];
            acc[id] = {
                ...order,
                id,
                userName: user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Unknown"
            };
            return acc;
        }, {} as Record<string, typOrder & { id: string; userName?: string }>);
    }, [orders, users]);

    return (
        <SmartDataGrid<typOrder & { id: string | number; userName?: string }>
            getColumns={(rowModesModel, actions) => getColumns(rowModesModel, actions)}
            getData={(callback) => {
                callback(mappedOrders);
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
