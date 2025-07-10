import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Divider,
    useTheme,
    Button,
    Typography,
} from '@mui/material';
import {
    FilterList as FilterIcon,
} from '@mui/icons-material';

import { ProductSalesReport } from './component/ProductSalesReport';
import { SalesTypeReport } from './component/SalesTypeReport';
import { TransactionsReport } from './component/transactionsReport/TransactionsReport';
import { TabPanel } from './component/ReportTabs';
import { useFilter } from '../../provider/FilterProvider';
import ExportMenu from '../../components/ExportMenu';
import type { typOrder } from '../../content/types';
import { getAllOrders } from '../../database/select';
import { filterOrders } from '../../helper/filterOrders';
import { useStaticData } from '../../hook/useStaticData';

const tabLabels = ['Transactions', 'Product Sales', 'Sales Type'];

export default function Reports() {
    const theme = useTheme();
    const { openFilterModal } = useFilter();
    const [tabIndex, setTabIndex] = useState(0);
    const [orders, setOrders] = useState<typOrder[]>([]);
    const { filters } = useFilter();
    const { products, categories } = useStaticData();
    const filteredOrders = useMemo(() => {
        return filterOrders(orders, filters, products, categories);
    }, [orders, filters, products, categories]);
    // Fetch orders from Firebase on mount
    useEffect(() => {
        const unsubscribe = getAllOrders((ordersRecord) => {
            const ordersArray = Object.values(ordersRecord);
            setOrders(ordersArray);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const renderTabPanel = (index: number) => {
        switch (index) {
            case 0:
                return <TransactionsReport filteredOrders={filteredOrders}/>;
            case 1:
                return <ProductSalesReport products={products} filteredOrders={filteredOrders}/>;
            case 2:
                return <SalesTypeReport filteredOrders={filteredOrders}/>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tabs */}
            <Tabs
                value={tabIndex}
                onChange={(_, val) => setTabIndex(val)}
                variant="fullWidth"
                indicatorColor="primary"
            >
                {tabLabels.map((label) => (
                    <Tab
                        key={label}
                        label={label}
                        sx={{
                            '&.Mui-selected': {
                                color: theme.palette.primary.contrastText,
                                fontWeight: 'bold',
                            },
                        }}
                    />
                ))}
            </Tabs>

            <Divider />

            {/* Title and Action Buttons */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
            >
                <Typography variant="h5">{tabLabels[tabIndex]} Report</Typography>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => openFilterModal(tabLabels[tabIndex])}
                        sx={{
                            borderColor: theme.palette.grey[400],
                            color: theme.palette.text.primary,
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.primary.main + '0A',
                            },
                        }}
                    >
                        Advance Filter
                    </Button>

                    {/* ✅ Replaced Export Button with Dropdown Export Menu */}
                    <ExportMenu data={filteredOrders} />
                </Box>
            </Box>

            {/* Tab Panels */}
            {tabLabels.map((_, index) => (
                <TabPanel key={index} value={tabIndex} index={index}>
                    {tabIndex === index && renderTabPanel(index)}
                </TabPanel>
            ))}

        </Box>
    );
}
