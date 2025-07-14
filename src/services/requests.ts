/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { store } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import { enmToastSeverity } from "../content/enums";

export const deleteUserRequest = async (uid: string) => {
  try {
    await axios.delete("https://coffee-server-production.up.railway.app/api/delete-user", {
      data: { uid },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
      store.dispatch(setToast({ message: `Delete failed: ${err.message}`, severity: enmToastSeverity.error }));
  }
};
export const ChangeUserSatutsRequest = async (Uid: string | number,isActive:boolean) => {
  try {
    await axios.post("https://coffee-server-production.up.railway.app/api/set-user-disabled", {
      uid: Uid,
      disabled: isActive === false ,
    });
  } catch (err: any) {
      store.dispatch(setToast({ message: `Delete failed: ${err.message}`, severity: enmToastSeverity.error }));
  }
};
