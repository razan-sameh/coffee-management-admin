import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import { Provider } from 'react-redux'
import AuthProvider from './provider/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import { store } from './redux/store'
import ToastProvider from './provider/ToastProvider'
import User from './pages/user/User'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Home from './pages/home/Home'
import ThemeProvider from './provider/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute redirectTo="/login" />}>
                <Route path="/" element={<DashboardLayout />} >
                  <Route index element={<Home />} />
                  <Route path="user" element={<User />} />
                </Route>
              </Route>

              {/* Optionally handle 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastProvider />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
