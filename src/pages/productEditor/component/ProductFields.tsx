import { TextField } from '@mui/material';
import CategorySelector from './CategorySelector';
import type { typCategory } from '../../../content/types';

type Props = {
    title: string;
    setTitle: (val: string) => void;
    price: number;
    setPrice: (val: number) => void;
    description: string;
    setDescription: (val: string) => void;
    categories: typCategory[];
    selectedCategory: typCategory | null;
    setSelectedCategory: (category: typCategory | null) => void;
};

export default function ProductFields({
    title,
    setTitle,
    price,
    setPrice,
    description,
    setDescription,
    categories,
    setSelectedCategory,
    selectedCategory
}: Props) {
    return (
        <>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                fullWidth
            />
            <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
            />
        </>
    );
}
