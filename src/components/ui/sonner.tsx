import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#141312",
          color: "#FAF6F0",
          border: "1px solid rgba(212, 175, 55, 0.28)",
          borderRadius: "14px",
          fontFamily: "Plus Jakarta Sans, sans-serif"
        },
        className: "font-sans"
      }}
    />
  );
}
