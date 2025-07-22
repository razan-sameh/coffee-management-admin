import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type MobileGridSearchProps = {
    searchText: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
};

export function MobileGridSearch({
    searchText,
    onSearchChange,
    placeholder = "Search...",
}: MobileGridSearchProps) {
    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            sx={{ mb: 2 }}
        />
    );
}