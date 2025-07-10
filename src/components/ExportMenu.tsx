/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import {
    FileDownload as ExportIcon,
    TableChart as ExcelIcon,
    Description as CsvIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportMenuProps {
    data: any[];
    fileName?: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ data, fileName = 'data' }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `${fileName}.xlsx`);
        handleClose();
    };

    const exportCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
        handleClose();
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleClick}
                sx={{
                    borderColor: theme.palette.grey[400],
                    color: theme.palette.text.primary,
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main + '0A',
                    },
                }}
            >
                Export
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={exportExcel}>
                    <ListItemIcon>
                        <ExcelIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export as Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={exportCSV}>
                    <ListItemIcon>
                        <CsvIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ExportMenu;