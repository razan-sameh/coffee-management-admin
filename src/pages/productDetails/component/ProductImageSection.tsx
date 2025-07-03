import { Box, ButtonBase } from '@mui/material';

type Props = {
    mainImage: string;
    thumbnails: string[];
    onImageClick: (img: string) => void;
};

export default function ProductImageSection({ mainImage, thumbnails, onImageClick }: Props) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Box
                component="img"
                src={mainImage}
                alt="Main"
                sx={{
                    borderRadius: 2,
                    objectFit: 'cover',
                    width: 300,
                    height: 300,
                }}
            />
            <Box display="flex" width={300} gap={1}>
                {thumbnails.map((img, idx) => (
                    <ButtonBase key={idx} onClick={() => onImageClick(img)} sx={{ flex: 1 }}>
                        <Box
                            component="img"
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 2,
                            }}
                        />
                    </ButtonBase>
                ))}
            </Box>
        </Box>
    );
}
