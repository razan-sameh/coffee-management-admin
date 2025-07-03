import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    images: string[];
    setImages: (imgs: string[]) => void;
};

export default function ImageUploader({ images, setImages }: Props) {
    return (
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mt={2}>
            {images.map((img, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 1,
                        '&:hover .delete-button': { display: 'flex' },
                        '&:hover .image': { filter: 'blur(2px)' },
                    }}
                >
                    <Box
                        className="image"
                        component="img"
                        src={img}
                        alt={`Image ${i + 1}`}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: '0.3s ease',
                        }}
                    />
                    <Button
                        className="delete-button"
                        size="small"
                        onClick={() => {
                            const updated = [...images];
                            updated.splice(i, 1);
                            setImages(updated);
                        }}
                        sx={{
                            display: 'none',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            minWidth: 0,
                            padding: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '50%',
                            color: 'white',
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Box>
            ))}

            <Box
                component="label"
                sx={{
                    width: 120,
                    height: 120,
                    border: '2px dashed #d1bfa7',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#844511',
                    fontSize: 32,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}
            >
                +
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const newImages: string[] = [];

                        files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (reader.result) {
                                    newImages.push(reader.result.toString());
                                    if (newImages.length === files.length) {
                                        setImages([...images, ...newImages]); // ✅ Use the current value of `images` prop
                                    }
                                }
                            };
                            reader.readAsDataURL(file);
                        });
                    }}
                />
            </Box>
        </Box>
    );
}
