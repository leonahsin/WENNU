import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * QR entry point for PCI01 (U.S.). Sets product + entry source and lands the
 * visitor directly on the PCI01 Support Home — never on product selection.
 */
export const Route = createFileRoute("/qr/pci01")({
  beforeLoad: () => {
    throw redirect({ to: "/product/pci01", search: { source: "qr" } });
  },
});
