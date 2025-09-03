/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { store } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import { enmToastSeverity } from "../content/enums";

export const deleteUserRequest = async (uid: string) => {
  try {
    await axios.delete(
      "https://coffee-server-ivory-omega.vercel.app/api/delete-user",
      {
        data: { uid },
      }
    );
  } catch (err: any) {
    store.dispatch(
      setToast({
        message: `Delete failed: ${err.message}`,
        severity: enmToastSeverity.error,
      })
    );
  }
};
export const ChangeUserSatutsRequest = async (
  Uid: string | number,
  isActive: boolean
) => {
  try {
    const response = await axios.post(
      "https://coffee-server-ivory-omega.vercel.app/api/set-user-disabled",
      {
        uid: Uid,
        disabled: isActive === false,
      }
    );
    console.log("Status change response:", response.data);
  } catch (err: any) {
    store.dispatch(
      setToast({
        message: `Delete failed: ${err.message}`,
        severity: enmToastSeverity.error,
      })
    );
  }
};
