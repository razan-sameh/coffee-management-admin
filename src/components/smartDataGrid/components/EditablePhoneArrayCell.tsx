import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  Paper,
  ClickAwayListener,
  Popper,
} from "@mui/material";
import { Add, Delete, Edit, ArrowDropDown, Check } from "@mui/icons-material";
import {
  MuiTelInput,
  matchIsValidTel,
  type MuiTelInputInfo,
} from "mui-tel-input";
import type { typPhone } from "../../../content/types";

type Props = {
  items: typPhone[];
  onChange: (newItems: typPhone[]) => void;
};

export default function EditablePhoneArrayCell({
  items: initialItems,
  onChange,
}: Props) {
  const [items, setItems] = useState<typPhone[]>(initialItems || []);
  const [selected, setSelected] = useState<typPhone | null>(
    initialItems[0] || null
  );
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const [newInfo, setNewInfo] = useState<MuiTelInputInfo | null>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const formatDisplay = (item: typPhone) =>
    `${item.countryCode} ${item.number}`;

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    const item = items[index];
    setNewValue(formatDisplay(item));
    setNewInfo(null); // let MuiTelInput fill this when user types
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(updated);
    setSelected(updated.length > 0 ? updated[0] : null);
  };

  const handleAddNew = () => {
    setEditingIndex(-1);
    setNewValue("");
    setNewInfo(null);
  };

  const handleEditFinish = () => {
    if (!newValue || !newInfo || !matchIsValidTel(newValue)) return;

    const newItem: typPhone = {
      countryCode: newInfo.countryCallingCode
        ? `+${newInfo.countryCallingCode}`
        : "",
      number: newInfo.nationalNumber || "",
      countryISO: (newInfo.countryCode as string) || "",
    };

    const updated = [...items];
    if (editingIndex === -1) {
      updated.push(newItem);
      setSelected(newItem);
    } else if (editingIndex !== null) {
      updated[editingIndex] = newItem;
      setSelected(newItem);
    }

    setItems(updated);
    onChange(updated);
    setEditingIndex(null);
    setNewValue("");
    setNewInfo(null);
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
          flex: 1,
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Typography
          variant="body2"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "85%",
          }}
        >
          {selected ? formatDisplay(selected) : "No phone"}
        </Typography>
        <ArrowDropDown />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            sx={{ width: 300, mt: 1, maxHeight: 300, overflowY: "auto", p: 1 }}
          >
            {items.map((item, idx) => (
              <MenuItem key={idx} selected={item === selected}>
                {editingIndex === idx ? (
                  <Box display="flex" width="100%" alignItems="center" gap={1}>
                    <MuiTelInput
                      value={newValue}
                      onChange={(value, info) => {
                        setNewValue(value);
                        setNewInfo(info);
                      }}
                      fullWidth
                      defaultCountry="EG"
                      forceCallingCode
                      autoFocus
                      size="small"
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
                        setSelected(item);
                        setOpen(false);
                      }}
                    >
                      {formatDisplay(item)}
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

            {/* Add new phone */}
            {editingIndex === -1 && (
              <MenuItem disableRipple divider>
                <Box display="flex" width="100%" gap={1}>
                  <MuiTelInput
                    value={newValue}
                    onChange={(value, info) => {
                      setNewValue(value);
                      setNewInfo(info);
                    }}
                    defaultCountry="EG"
                    forceCallingCode
                    autoFocus
                    size="small"
                    fullWidth
                  />
                  <IconButton
                    onClick={handleEditFinish}
                    color="primary"
                    size="small"
                    disabled={!matchIsValidTel(newValue)}
                  >
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
                  <Typography variant="body2">Add New Phone</Typography>
                </Box>
              </MenuItem>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
