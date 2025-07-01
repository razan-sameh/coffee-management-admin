import * as React from "react";
import {
    Toolbar,
    ToolbarButton,
    FilterPanelTrigger,
    ExportCsv,
    ExportPrint,
    QuickFilterControl,
    QuickFilterClear,
    QuickFilterTrigger,
    QuickFilter,
    ColumnsPanelTrigger,
} from "@mui/x-data-grid";

import {
    Tooltip,
    Menu,
    MenuItem,
    Badge,
    Divider,
    Typography,
    InputAdornment,
    TextField,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from '@mui/icons-material/Add';
import { styled } from "@mui/material/styles";

type CustomToolbarProps = {
    title?: string; // <-- make optional
    showColumns?: boolean;
    showExport?: boolean;
    showFilter?: boolean;
    showSearch?: boolean;
    showAdd?: boolean;
    extraActions?: React.ReactNode;
    onAddClick?: () => void;
};


type OwnerState = {
    expanded: boolean;
};

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => ({
        gridArea: "1 / 1",
        width: "min-content",
        height: "min-content",
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? "none" : "auto",
        transition: theme.transitions.create(["opacity"]),
    })
);

const StyledQuickFilter = styled(QuickFilter)({
    display: "grid",
    alignItems: "center",
});

const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => ({
        gridArea: "1 / 1",
        overflowX: "clip",
        width: ownerState.expanded ? 260 : "var(--trigger-width)",
        opacity: ownerState.expanded ? 1 : 0,
        transition: theme.transitions.create(["width", "opacity"]),
    })
);

export default function CustomToolbar({
    title = '',
    showColumns = false,
    showExport = false,
    showFilter = true,
    showSearch = true,
    showAdd = false,
    extraActions,
    onAddClick,

}: CustomToolbarProps) {

    const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
    const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Toolbar>
            <Typography variant="title" sx={{ flex: 1, mx: 0.5 }}>
                {title}
            </Typography>

            {extraActions}

            {/* Optional: Show Columns */}
            {showColumns && (
                <Tooltip title="Columns">
                    <ColumnsPanelTrigger render={<ToolbarButton />}>
                        <ViewColumnIcon fontSize="small" />
                    </ColumnsPanelTrigger>
                </Tooltip>
            )}

            {/* Optional: Show Filters */}
            {showFilter && (
                <Tooltip title="Filters">
                    <FilterPanelTrigger
                        render={(props, state) => (
                            <ToolbarButton {...props} color="default">
                                <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                    <FilterListIcon fontSize="small" />
                                </Badge>
                            </ToolbarButton>
                        )}
                    />
                </Tooltip>
            )}

            {(showExport || showFilter) && (
                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
            )}

            {/* Optional: Show Export */}
            {showExport && (
                <>
                    <Tooltip title="Export">
                        <ToolbarButton
                            ref={exportMenuTriggerRef}
                            id="export-menu-trigger"
                            aria-controls="export-menu"
                            aria-haspopup="true"
                            aria-expanded={exportMenuOpen ? "true" : undefined}
                            onClick={() => setExportMenuOpen(true)}
                        >
                            <FileDownloadIcon fontSize="small" />
                        </ToolbarButton>
                    </Tooltip>

                    <Menu
                        id="export-menu"
                        anchorEl={exportMenuTriggerRef.current}
                        open={exportMenuOpen}
                        onClose={() => setExportMenuOpen(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                            list: {
                                "aria-labelledby": "export-menu-trigger",
                            },
                        }}
                    >
                        <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                            Print
                        </ExportPrint>
                        <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                            Download as CSV
                        </ExportCsv>
                    </Menu>
                </>
            )}

            {/* Optional: Show Search */}
            {showSearch && (
                <StyledQuickFilter>
                    <QuickFilterTrigger
                        render={(triggerProps, state) => (
                            <Tooltip title="Search">
                                <StyledToolbarButton
                                    {...triggerProps}
                                    ownerState={{ expanded: state.expanded }}
                                    color="default"
                                    aria-disabled={state.expanded}
                                >
                                    <SearchIcon fontSize="small" />
                                </StyledToolbarButton>
                            </Tooltip>
                        )}
                    />
                    <QuickFilterControl
                        render={({ ref, ...controlProps }, state) => (
                            <StyledTextField
                                {...controlProps}
                                ownerState={{ expanded: state.expanded }}
                                inputRef={ref}
                                aria-label="Search"
                                placeholder="Search..."
                                size="small"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: state.value ? (
                                            <InputAdornment position="end">
                                                <QuickFilterClear edge="end" size="small" aria-label="Clear search">
                                                    <CancelIcon fontSize="small" />
                                                </QuickFilterClear>
                                            </InputAdornment>
                                        ) : null,
                                        ...controlProps.slotProps?.input,
                                    },
                                    ...controlProps.slotProps,
                                }}
                            />
                        )}
                    />
                </StyledQuickFilter>
            )}

            {showAdd && (
                <Tooltip title="Add record">
                    <ToolbarButton onClick={onAddClick}>
                        <AddIcon fontSize="small" />
                    </ToolbarButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}
