import { getColumns } from "./components/columns";
import { getAllUsers } from "../../database/select";
import { updateUserInfo } from "../../database/update";
import { deleteUserByUid } from "../../database/delete";
import { imagePaths } from "../../assets/imagePaths";
import SmartDataGrid from "../../components/smartDataGrid/SmartDataGrid";
import type { typUser } from "../../content/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUser } from "../../redux/slices/authSlice";
import { useRolePermissions } from "../../hook/useRolePermissions";

export default function UserList() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { permissions } = useRolePermissions();

  const handleUpdate = async (uid: string | number, data: Partial<typUser>) => {
    try {
      const updatedUser = await updateUserInfo(uid, data);
      // If the updated user is the current logged-in user
      if (currentUser?.Uid === updatedUser.Uid) {
        dispatch(setUser(updatedUser));
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <SmartDataGrid<typUser & { id: string | number; }>
      getColumns={(
        rowModesModel,
        actions
      ) => getColumns(rowModesModel, actions, permissions)} 
      getData={getAllUsers}
      updateData={handleUpdate} // id === Uid
      deleteData={deleteUserByUid} // id === Uid
      mapRow={(id, user, index) => ({
        ...user,
        isActive: user.isActive === true || user.isActive === "Active",
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
