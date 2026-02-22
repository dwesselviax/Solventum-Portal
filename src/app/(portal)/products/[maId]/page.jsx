import ProductDetailPage from './client';
import { allProducts } from '@/lib/mock-data/products/index';

export async function generateStaticParams() {
  return allProducts.map((p) => ({ maId: p.maId }));
}

export default async function Page({ params }) {
  const { maId } = await params;
  return <ProductDetailPage maId={maId} />;
}
