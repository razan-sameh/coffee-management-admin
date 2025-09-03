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
import type { typLocation, typAddress } from "../../../content/types";

type Props = {
  items: typLocation[];
  onChange: (newItems: typLocation[]) => void;
};

export default function EditableAddressArrayCell({
  items: initialItems,
  onChange,
}: Props) {
  const [items, setItems] = useState<typLocation[]>(initialItems || []);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<typAddress | null>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]?.address || {});
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(updated);
    if (updated.length > 0) setSelectedIndex(0);
  };

  const handleAddNew = () => {
    setEditingIndex(-1);
    setEditValue({});
  };

  const handleEditFinish = () => {
    if (!editValue) return;

    const newLocation: typLocation = {
      latitude: 0,
      longitude: 0,
      address: {
        house_number: editValue.house_number?.trim() || "",
        road: editValue.road?.trim() || "",
        city: editValue.city?.trim() || "",
        country: editValue.country?.trim() || "",
      },
    };

    const updated: typLocation[] = [...items];
    if (editingIndex === -1) {
      updated.push(newLocation);
      setSelectedIndex(updated.length - 1);
    } else if (editingIndex !== null) {
      updated[editingIndex] = newLocation;
      setSelectedIndex(editingIndex);
    }

    setItems(updated);
    onChange(updated);
    setEditingIndex(null);
    setEditValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditFinish();
    if (e.key === "Escape") {
      setEditingIndex(null);
      setEditValue(null);
    }
  };

const formatAddress = (addr?: typAddress | null) => {
  if (!addr) return "N/A";
  return [addr.house_number, addr.road, addr.city, addr.country]
    .filter(Boolean)
    .join(", ");
};


  return (
    <>
      {/* Selected display */}
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
          flex: 1,
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Typography
          variant="body2"
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "85%" }}
        >
          {items[selectedIndex]?.address
            ? formatAddress(items[selectedIndex].address)
            : "No address"}
        </Typography>
        <ArrowDropDown />
      </Box>

      {/* Dropdown with list */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            sx={{ width: 350, mt: 1, maxHeight: 350, overflowY: "auto", p: 1 }}
          >
            {items.map((item, idx) => (
              <MenuItem key={idx} selected={idx === selectedIndex}>
                {editingIndex === idx ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    width="100%"
                  >
                    <TextField
                      label="House #"
                      value={editValue?.house_number || ""}
                      onChange={(e) =>
                        setEditValue((prev) => ({
                          ...prev,
                          house_number: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      size="small"
                      variant="standard"
                    />
                    <TextField
                      label="Road"
                      value={editValue?.road || ""}
                      onChange={(e) =>
                        setEditValue((prev) => ({
                          ...prev,
                          road: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      size="small"
                      variant="standard"
                    />
                    <TextField
                      label="City"
                      value={editValue?.city || ""}
                      onChange={(e) =>
                        setEditValue((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      size="small"
                      variant="standard"
                    />
                    <TextField
                      label="Country"
                      value={editValue?.country || ""}
                      onChange={(e) =>
                        setEditValue((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      size="small"
                      variant="standard"
                    />
                    <IconButton
                      size="small"
                      onClick={handleEditFinish}
                      color="primary"
                    >
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
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                        flex: 1,
                      }}
                      onClick={() => {
                        setSelectedIndex(idx);
                        setOpen(false);
                      }}
                    >
                      {formatAddress(item?.address)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEditStart(idx)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(idx)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
            ))}

            {/* Add new */}
            {editingIndex === -1 && (
              <MenuItem disableRipple divider>
                <Box display="flex" flexDirection="column" gap={1} width="100%">
                  <TextField
                    label="House #"
                    value={editValue?.house_number || ""}
                    onChange={(e) =>
                      setEditValue((prev) => ({
                        ...prev,
                        house_number: e.target.value,
                      }))
                    }
                    size="small"
                    variant="standard"
                  />
                  <TextField
                    label="Road"
                    value={editValue?.road || ""}
                    onChange={(e) =>
                      setEditValue((prev) => ({
                        ...prev,
                        road: e.target.value,
                      }))
                    }
                    size="small"
                    variant="standard"
                  />
                  <TextField
                    label="City"
                    value={editValue?.city || ""}
                    onChange={(e) =>
                      setEditValue((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    size="small"
                    variant="standard"
                  />
                  <TextField
                    label="Country"
                    value={editValue?.country || ""}
                    onChange={(e) =>
                      setEditValue((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    size="small"
                    variant="standard"
                  />
                  <IconButton
                    onClick={handleEditFinish}
                    color="primary"
                    size="small"
                    disabled={
                      !editValue?.road &&
                      !editValue?.city &&
                      !editValue?.country
                    }
                  >
                    <Check fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            )}

            {editingIndex !== -1 && (
              <MenuItem onClick={handleAddNew}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Add fontSize="small" />
                  <Typography variant="body2">Add New Address</Typography>
                </Box>
              </MenuItem>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
