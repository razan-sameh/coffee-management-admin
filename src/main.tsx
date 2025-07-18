import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
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
import OrderList from './pages/orderList/OrderList'
import OrderDetails from './pages/orderDetails.tsx/OrderDetails'
import CartSyncProvider from './provider/CartSyncProvider'
import Reports from './pages/reports/Reports'
import { FilterProvider } from './provider/FilterProvider'
import ForgetPassword from './pages/forgetPassword/ForgetPassword'
import Coffee404 from './pages/coffee404/Coffee404'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartSyncProvider>
              <FilterProvider>
                <ConfirmDialogProvider>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgetPassword" element={<ForgetPassword />} />
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
                        <Route path="order">
                          <Route index element={<OrderList />} />
                          <Route path=":id" element={<OrderDetails />} />
                        </Route>
                        <Route path="reports" element={<Reports />} />
                      </Route>
                    </Route>
                    {/* Optionally handle 404 */}
                    <Route path="*" element={<Coffee404 />} />
                  </Routes>
                </ConfirmDialogProvider>
              </FilterProvider>
              <ToastProvider />
            </CartSyncProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
