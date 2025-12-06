/* eslint-disable react-hooks/rules-of-hooks */
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardLayout from './layouts/DashboardLayout';
import EmptyLayout from './layouts/EmptyLayout';
import { routes, type RouteItem } from './routes';
import NotFoundPage from './modules/notfound/NotFoundPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useAuthStore } from './stores/useAuthorStore';
import { Toaster } from "react-hot-toast";


// Create a client
const queryClient = new QueryClient()


// Đệ quy sinh route từ mảng routes
function renderRoutes(routes: RouteItem[], parentIsPrivate = false) {

  //  hàm để lấy trang thái đăng nhập
  const { loggedInUser } = useAuthStore();



  return routes.map((route) => {


    // ------------------- kiểm tra việc login  --------------------------------
    // Kiểm tra nếu route là riêng tư và người dùng chưa đăng nhập
    const isPrivate = route.isPrivate || parentIsPrivate;
    // nếu là route riêng tư và người dùng chưa đăng nhập thì chặn
    if (isPrivate && !loggedInUser) {
      return (
        <Route key={route.key} path={route.path || ''} element={<NotFoundPage />} />
      );
    }

    //  ------------------------ end check -----------------------------


    const Layout = route.isPrivate || parentIsPrivate ? DashboardLayout : EmptyLayout;
    if (route.children && route.children.length > 0) {
      // Route cha bọc Layout, các con chỉ render element
      return (
        <Route key={route.key} path={route.path || ''} element={<Layout />}>
          {/* Nếu có element ở cha, render ở index */}
          {route.element && <Route index element={route.element} />}
          {/* Các route con không bọc lại Layout */}
          {route.children.map(child =>
            child.children && child.children.length > 0
              ? renderRoutes([child], route.isPrivate || parentIsPrivate)
              : <Route key={child.key} path={child.path || ''} element={child.element || <div>{child.label} Page</div>} />
          )}
        </Route>
      );
    }
    // Route không có children, vẫn bọc Layout phù hợp
    return (
      <Route key={route.key} path={route.path || ''} element={<Layout />}>
        {route.element && <Route index element={route.element} />}
      </Route>
    );
  });
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Chuyển hướng từ / về /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {renderRoutes(routes)}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
<Toaster position="top-center" />

    </QueryClientProvider>
  );
}

export default App;
