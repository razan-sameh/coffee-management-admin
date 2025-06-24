import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login/Login'
import Signup from './pages/signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import { Provider } from 'react-redux'
import AuthProvider from './provider/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import { store } from './redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute redirectTo="/login" />}>
              <Route path="/" element={<Dashboard />} />
              {/* Add more protected routes here */}
            </Route>

            {/* Optionally handle 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
