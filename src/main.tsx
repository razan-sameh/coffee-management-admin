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
import UserList from './pages/userList/UserList'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Home from './pages/home/Home'
import ThemeProvider from './provider/ThemeProvider'
import CategoryList from './pages/categoryList/CategoryList'
import ProductList from './pages/productList/ProductList'
import ProductDetails from './pages/productDetails/ProductDetails'
import EditProduct from './pages/productEditor/ProductEditor'
import AddProduct from './pages/productEditor/ProductEditor'
import { ConfirmDialogProvider } from './provider/ConfirmDialogProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <ConfirmDialogProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<ProtectedRoute redirectTo="/login" />}>
                  <Route path="/" element={<DashboardLayout />} >
                    <Route index element={<Home />} />
                    <Route path="user" element={<UserList />} />
                    <Route path="category" element={<CategoryList />} />
                    <Route path="product">
                      <Route index element={<ProductList />} />
                      <Route path=":id" element={<ProductDetails />} />
                      <Route path="edit/:id" element={<EditProduct isEditMode={true} />} />
                      <Route path="add" element={<AddProduct isEditMode={false} />} />
                    </Route>
                  </Route>
                </Route>
                {/* Optionally handle 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ConfirmDialogProvider>
            <ToastProvider />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
