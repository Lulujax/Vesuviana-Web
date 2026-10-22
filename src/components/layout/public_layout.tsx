import { Outlet, useLocation } from "react-router-dom";
import { SiteNavbar } from "@/components/layout/site_navbar";
import { SiteFooter } from "@/components/layout/site_footer";
import { FloatingActions } from "@/components/layout/floating_actions";
import { PageTransition } from "@/components/shared/page_transition";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  const location = useLocation();
  const is_home = location.pathname === "/";

  return (
    <div className="min-h-screen bg-cream">
      <SiteNavbar />
      <main className={cn(is_home ? "pb-0" : "pt-20")}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
