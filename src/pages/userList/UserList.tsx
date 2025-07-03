import { getColumns } from "./components/columns";
import { getAllUsers } from "../../database/select";
import { updateUserInfo } from "../../database/update";
import { deleteUserByUid } from "../../database/delete";
import { imagePaths } from "../../assets/imagePaths";
import SmartDataGrid from "../../components/smartDataGrid/SmartDataGrid";
import type { enmRole } from "../../content/enums";
type typGridUser = {
  id: string; // Required for MUI DataGrid
  Uid: string;
  name: string;
  email: string;
  phone: string[];
  address: string[];
  role: enmRole;
};
export default function UserList() {
  return (
    <SmartDataGrid<typGridUser>
      getColumns={getColumns}
      getData={getAllUsers}
      updateData={updateUserInfo} // id === Uid
      deleteData={deleteUserByUid} // id === Uid
      mapRow={(uid, user, index) => ({
        id: uid,
        no: index + 1,
        Uid: uid,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phoneNumber || [],
        email: user.email || "",
        role: user.role,
        address: user.address || [],
      })}
      imageBackground={imagePaths.beans}
      slotProps={{
        toolbar: {
          title: "User List",
          showColumns: false,
          showExport: false,
        },
      }}
    />
  );
}
