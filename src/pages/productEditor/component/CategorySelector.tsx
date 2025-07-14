import { Autocomplete, TextField } from '@mui/material';
import type { typCategory } from '../../../content/types';

type Props = {
    categories: typCategory[];
    selectedCategory: typCategory | null;
    setSelectedCategory: (category: typCategory | null) => void;
};

export default function CategorySelector({
    categories,
    selectedCategory,
    setSelectedCategory,
}: Props) {
    return (
        <Autocomplete
            options={categories}
            getOptionLabel={(option) => option?.title ?? ''}
            value={selectedCategory}
            onChange={(_e, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="Category" fullWidth />}
        />
    );
}
