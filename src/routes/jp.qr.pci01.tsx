import { createFileRoute, redirect } from "@tanstack/react-router";

/** QR entry point for PCI01 (Japan). Lands directly on the PCI01 Support Home. */
export const Route = createFileRoute("/jp/qr/pci01")({
  beforeLoad: () => {
    throw redirect({ to: "/jp/product/pci01", search: { source: "qr" } });
  },
});
