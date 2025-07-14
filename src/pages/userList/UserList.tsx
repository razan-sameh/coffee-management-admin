import { getColumns } from "./components/columns";
import { getAllUsers } from "../../database/select";
import { updateUserInfo } from "../../database/update";
import { deleteUserByUid } from "../../database/delete";
import { imagePaths } from "../../assets/imagePaths";
import SmartDataGrid from "../../components/smartDataGrid/SmartDataGrid";
import type { typUser } from "../../content/types";

export default function UserList() {
  return (
    <SmartDataGrid<typUser & { id: string | number;}>
      getColumns={getColumns}
      getData={getAllUsers}
      updateData={updateUserInfo} // id === Uid
      deleteData={deleteUserByUid} // id === Uid
      mapRow={(id, user, index) => ({ 
        ...user, 
        isActive: user.isActive === true || user.isActive === "Active" ,
        id,
        no: index + 1 
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
