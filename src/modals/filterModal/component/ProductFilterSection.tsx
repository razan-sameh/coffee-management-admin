/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { typCategory, typFilters, typProduct } from '../../../content/types';

interface Props {
    tempFilters: any;
    categories: Record<string, typCategory>;
    products: Record<string, typProduct>;
    onChange: (field: keyof typFilters, value: string) => void;
}

export const ProductFilterSection: React.FC<Props> = ({
    tempFilters,
    categories,
    products,
    onChange
}) => (
    <Grid size={12} sx={{md:6}}>
        <Typography variant="subtitle1" fontWeight="bold" mt={2}>Products</Typography>
        <Typography variant="body2" color="text.secondary">You can choose several types from the options.</Typography>

        <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Category</InputLabel>
            <Select
                value={tempFilters.category}
                onChange={(e) => onChange('category', e.target.value)}
                label="Category"
            >
                <MenuItem value="All categories">All categories</MenuItem>
                {Object.values(categories).map((category) => (
                    <MenuItem key={category.ID} value={category.title}>{category.title}</MenuItem>
                ))}
            </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Product</InputLabel>
            <Select
                value={tempFilters.product}
                onChange={(e) => onChange('product', e.target.value)}
                label="Product"
            >
                <MenuItem value="All products">All products</MenuItem>
                {Object.values(products).map((product) => (
                    <MenuItem key={product.ID} value={product.title}>{product.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </Grid>
);
