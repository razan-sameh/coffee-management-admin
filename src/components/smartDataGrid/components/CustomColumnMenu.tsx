import { GridColumnMenuSortItem, type GridColumnMenuProps } from "@mui/x-data-grid";

const CustomColumnMenu = (props: GridColumnMenuProps) => (
    <>
        <GridColumnMenuSortItem onClick={props.hideMenu} colDef={props.colDef} />
    </>
);

export default CustomColumnMenu;