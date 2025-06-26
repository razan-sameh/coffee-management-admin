import { Button } from '@mui/material'
import { logoutUser } from '../../redux/slices/authSlice';
import { useAppDispatch } from '../../redux/store';

export default function Dashboard() {
  const dispatch = useAppDispatch();

function logout() {
  dispatch(logoutUser())
}


  return (
    <>
      <div>Dashboard</div>
      <Button onClick={() => logout()}>
        Logout
      </Button>
    </>
  )
}
