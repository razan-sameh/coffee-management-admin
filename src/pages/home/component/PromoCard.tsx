import { Box, Typography, Card } from '@mui/material';

type PromoCardProps = {
    title: string;
    description: string;
    image: string;
};

export default function PromoCard({
    title,
    description,
    image,
}: PromoCardProps) {
    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                display: 'flex',
                alignItems: 'flex-end',
                height: 300,
            }}
        >
            {/* Overlay gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(to top, rgb(0 0 0 / 81%), rgba(0, 0, 0, 0.2))',
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    p: 2,
                    width: '100%',
                    margin: 'auto',
                    textAlign: 'center'

                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    {description}
                </Typography>
            </Box>
        </Card>
    );
}
