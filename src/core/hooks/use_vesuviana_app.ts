import { useContext } from "react";
import { VesuvianaAppContext } from "@/core/store/vesuviana_app_context";

export function use_vesuviana_app() {
  const context_value = useContext(VesuvianaAppContext);
  if (!context_value) {
    throw new Error("use_vesuviana_app debe utilizarse dentro de VesuvianaAppProvider.");
  }
  return context_value;
}
