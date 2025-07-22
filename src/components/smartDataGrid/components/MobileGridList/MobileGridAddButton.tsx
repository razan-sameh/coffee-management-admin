import { Box, Button } from "@mui/material";

type MobileGridAddButtonProps = {
    onAdd: () => void;
    label?: string;
};

export function MobileGridAddButton({
    onAdd,
    label = "Add",
}: MobileGridAddButtonProps) {
    return (
        <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="small" onClick={onAdd}>
                {label}
            </Button>
        </Box>
    );
}