import { Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/productpages/ProductsPage";
import ProductDetailsPage from "./pages/productpages/ProductDetailsPage";
import CartPage from "./pages/cartpages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import MerchantProductsPage from "./pages/merchantpages/MerchantProductsPage";
import CreateProductPage from "./pages/merchantpages/CreateProductPage";
import EditProductPage from "./pages/merchantpages/EditProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/authpages/LoginPage";
import RegisterPage from "./pages/authpages/RegisterPage";
import OrdersPage from "./pages/orderpages/OrdersPage";
import OrderDetailsPage from "./pages/orderpages/OrderDetailsPage";
import CheckoutPage from "./pages/orderpages/CheckoutPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole="CUSTOMER">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRole="CUSTOMER">
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute requiredRole="CUSTOMER">
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/merchant/products"
          element={
            <ProtectedRoute requiredRole="MERCHANT">
              <MerchantProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/merchant/products/new"
          element={
            <ProtectedRoute requiredRole="MERCHANT">
              <CreateProductPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/merchant/products/:id/edit"
          element={
            <ProtectedRoute requiredRole="MERCHANT">
              <EditProductPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
