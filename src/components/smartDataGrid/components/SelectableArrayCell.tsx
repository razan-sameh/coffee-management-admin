import React from "react";
import { Select, MenuItem, Typography, Box } from "@mui/material";

type Props = {
  items: string[];
};

export default function SelectableArrayCell({ items }: Props) {
  const [selected, setSelected] = React.useState(items[0] || "");

  if (!items || items.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "gray", fontStyle: "italic" }}>
          No data
        </Typography>
      </Box>
    );
  }

  return (
    <Select
      size="small"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      sx={{ width: "100%" }}
    >
      {items.map((item, idx) => (
        <MenuItem key={idx} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
}
