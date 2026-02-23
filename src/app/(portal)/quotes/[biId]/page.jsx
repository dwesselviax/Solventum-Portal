import QuoteDetailPage from './client';

export async function generateStaticParams() {
  return [
    { biId: 'QT-2025-0001' },
    { biId: 'QT-2025-0002' },
    { biId: 'QT-2025-0003' },
    { biId: 'QT-2025-0004' },
    { biId: 'QT-2025-0005' },
    { biId: 'QT-2024-0006' },
    { biId: 'QT-2025-0007' },
    { biId: 'QT-2025-0008' },
  ];
}

export default async function Page({ params }) {
  const { biId } = await params;
  return <QuoteDetailPage biId={biId} />;
}
