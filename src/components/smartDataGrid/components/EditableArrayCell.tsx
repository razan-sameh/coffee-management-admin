import React, { useState } from "react";
import {
    Box,
    IconButton,
    TextField,
    Typography,
    MenuItem,
    Paper,
    ClickAwayListener,
    Popper,
} from "@mui/material";
import { Add, Delete, Edit, ArrowDropDown, Check } from "@mui/icons-material";

type Props = {
    items: string[];
    onChange: (newItems: string[]) => void;
};

export default function EditableArrayCell({ items: initialItems, onChange }: Props) {
    const [items, setItems] = useState<string[]>(initialItems || []);
    const [selected, setSelected] = useState<string>(initialItems[0] || "");
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newValue, setNewValue] = useState<string>("");
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const handleEditStart = (index: number) => {
        setEditingIndex(index);
        setNewValue(items[index]);
    };

    const handleDelete = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        onChange(updated);
        if (updated.length > 0) setSelected(updated[0]);
    };

    const handleAddNew = () => {
        setEditingIndex(-1);
        setNewValue("");
    };

    const handleEditFinish = () => {
        const trimmed = newValue.trim();
        if (!trimmed) return;

        const updated = [...items];
        if (editingIndex === -1) {
            updated.push(trimmed);
            setSelected(trimmed);
        } else if (editingIndex !== null) {
            updated[editingIndex] = trimmed;
            setSelected(trimmed);
        }

        setItems(updated);
        onChange(updated);
        setEditingIndex(null);
        setNewValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleEditFinish();
        if (e.key === "Escape") {
            setEditingIndex(null);
            setNewValue("");
        }
    };

    return (
        <>
            <Box
                ref={anchorRef}
                sx={{
                    borderRadius: 1,
                    mx: 1.5,
                    py: 0.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    flex: 1
                }}
                onClick={() => setOpen((prev) => !prev)}
            >
                <Typography
                    variant="body2"
                    noWrap
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "85%" }}
                >
                    {selected || "No data"}
                </Typography>
                <ArrowDropDown />
            </Box>

            <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 1300 }}>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper sx={{ width: 300, mt: 1, maxHeight: 300, overflowY: "auto", p: 1 }}>
                        {items.map((item, idx) => (
                            <MenuItem key={idx} selected={item === selected}>
                                {editingIndex === idx ? (
                                    <Box display="flex" width="100%" alignItems="center" gap={1}>
                                        <TextField
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            autoFocus
                                            variant="standard"
                                            size="small"
                                            fullWidth
                                        />
                                        <IconButton size="small" onClick={handleEditFinish} color="primary">
                                            <Check fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            gap: 1
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", flex: 1 }}
                                            onClick={() => {
                                                setSelected(item);
                                                setOpen(false);
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                        <IconButton size="small" onClick={() => handleEditStart(idx)}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(idx)} color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </MenuItem>
                        ))}

                        {/* Add new item input */}
                        {editingIndex === -1 && (
                            <MenuItem disableRipple divider>
                                <Box display="flex" width="100%" gap={1}>
                                    <TextField
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                        size="small"
                                        variant="standard"
                                        placeholder="New item..."
                                        fullWidth
                                    />
                                    <IconButton onClick={handleEditFinish} color="primary" size="small" disabled={!newValue.trim()}>
                                        <Check fontSize="small" />
                                    </IconButton>
                                </Box>
                            </MenuItem>
                        )}

                        {/* Add new button */}
                        {editingIndex !== -1 && (
                            <MenuItem onClick={handleAddNew}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Add fontSize="small" />
                                    <Typography variant="body2">Add New</Typography>
                                </Box>
                            </MenuItem>
                        )}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
}
