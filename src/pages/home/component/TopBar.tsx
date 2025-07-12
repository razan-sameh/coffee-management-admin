import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { typCategory } from '../../../content/types';

type Props = {
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    search: string;
    setSearch: (value: string) => void;
    categories: typCategory[];
};

export default function TopBar({
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    categories,
}: Props) {
    const selectedCategoryObj =
        categories.find((cat) => String(cat.ID) === selectedCategory) || null;

    return (
        <Box display="flex" gap={2} mb={3} justifyContent="space-between">
            <Typography variant="title">Menu</Typography>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                justifyContent={'flex-end'}
                width="100%"
            >
                <TextField
                    variant="outlined"
                    placeholder="Search for coffee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                    }}
                />
                <Autocomplete
                    options={categories}
                    value={selectedCategoryObj}
                    onChange={(_, val) => setSelectedCategory(val ? String(val.ID) : '')}
                    getOptionLabel={(option) => option.title}
                    isOptionEqualToValue={(option, value) => option.ID === value.ID}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                    sx={{ minWidth: 200 }}
                />
            </Box>
        </Box>
    );
}
