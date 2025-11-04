import { Suspense } from "react";
import ProductsPage from "./ProductPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading products...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
