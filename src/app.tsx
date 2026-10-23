import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { VesuvianaAppProvider } from "@/core/store/vesuviana_app_provider";
import { PublicLayout } from "@/components/layout/public_layout";
import { AdminLayout, SuperAdminRoute } from "@/components/admin/admin_layout";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/public/home_page";
import { CatalogPage } from "@/pages/public/catalog_page";
import { ProductDetailPage } from "@/pages/public/product_detail_page";
import { WholesalePage } from "@/pages/public/wholesale_page";
import { DistributorsPage } from "@/pages/public/distributors_page";
import { NotFoundPage } from "@/pages/public/not_found_page";
import { AdminLoginPage } from "@/pages/admin/admin_login_page";
import { AdminForgotPasswordPage } from "@/pages/admin/admin_forgot_password_page";

const AdminDashboardPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_dashboard_page")).AdminDashboardPage
}));
const AdminSlidesPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_slides_page")).AdminSlidesPage
}));
const AdminBrandsPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_brands_page")).AdminBrandsPage
}));
const AdminProductsPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_products_page")).AdminProductsPage
}));
const AdminAdvisorsPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_advisors_page")).AdminAdvisorsPage
}));
const AdminDistributorsPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_distributors_page")).AdminDistributorsPage
}));
const AdminUsersPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_users_page")).AdminUsersPage
}));
const AdminAuditPage = lazy(async () => ({
  default: (await import("@/pages/admin/admin_audit_page")).AdminAuditPage
}));

function ScrollManager() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (location.hash) {
      const timeout_id = window.setTimeout(() => {
        const target_element = document.getElementById(location.hash.slice(1));
        if (!target_element) {
          return;
        }
        if (lenis) {
          lenis.scrollTo(target_element, { offset: -96 });
          return;
        }
        const target_top = target_element.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: target_top, behavior: "smooth" });
      }, 60);
      return () => window.clearTimeout(timeout_id);
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash, lenis]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="catalogo/producto/:product_slug" element={<ProductDetailPage />} />
        <Route path="mayoristas" element={<WholesalePage />} />
        <Route path="distribuidores" element={<DistributorsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin/recuperar" element={<AdminForgotPasswordPage />} />

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="carrusel" element={<AdminSlidesPage />} />
        <Route path="marcas" element={<AdminBrandsPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="asesores" element={<AdminAdvisorsPage />} />
        <Route path="distribuidores" element={<AdminDistributorsPage />} />
        <Route element={<SuperAdminRoute />}>
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="auditoria" element={<AdminAuditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

function AppShell() {
  const location = useLocation();
  const is_admin_route = location.pathname.startsWith("/admin");

  return (
    <>
      {is_admin_route ? (
        <>
          <ScrollManager />
          <AppRoutes />
        </>
      ) : (
        <ReactLenis
          root
          options={{
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.15,
            anchors: { offset: -96 }
          }}
        >
          <ScrollManager />
          <AppRoutes />
        </ReactLenis>
      )}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <VesuvianaAppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </VesuvianaAppProvider>
  );
}
