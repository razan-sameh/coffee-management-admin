import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { enmSize } from '../../../content/enums';

type Props = {
    size: enmSize;
    onChange: (val: enmSize) => void;
};

export default function ProductSizeSelector({ size, onChange }: Props) {
    return (
        <>
            <Typography mt={2} fontWeight="bold">Size</Typography>
            <ToggleButtonGroup
                exclusive
                value={size}
                onChange={(_e, val) => val && onChange(val)}
                sx={{ mt: 1 }}
            >
                {Object.values(enmSize).map((sz) => (
                    <ToggleButton key={sz} value={sz} sx={{paddingX:2}}>{sz}</ToggleButton>
                ))}
            </ToggleButtonGroup>
        </>
    );
}
