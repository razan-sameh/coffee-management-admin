import React, { useState } from 'react';
import { Box, Tabs, Tab, Divider } from '@mui/material';
import { ProductSalesReport } from './ProductSalesReport';
import { SalesTypeReport } from './SalesTypeReport';
import { TransactionsReport } from './TransactionsReport';

function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
    const { children, value, index } = props;
    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ReportTabs() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} variant="fullWidth">
                <Tab label="Transactions" />
                <Tab label="Product Sales" />
                <Tab label="Sales Type" />
            </Tabs>
            <Divider />

            <TabPanel value={tabIndex} index={0}>
                <TransactionsReport orders={[]} users={undefined} />
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
                <ProductSalesReport products={[]} />
            </TabPanel>

            <TabPanel value={tabIndex} index={2}>
                <SalesTypeReport />
            </TabPanel>
        </Box>
    );
}
