import axios from "axios";
import { store } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import { enmToastSeverity } from "../content/enums";

export const deleteUserRequest = async (uid: string) => {
  try {
    await axios.delete("http://localhost:3001/api/delete-user", {
      data: { uid },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
      store.dispatch(setToast({ message: `Delete failed: ${err.message}`, severity: enmToastSeverity.error }));
  }
};
