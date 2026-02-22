import BandOrderWizardPage from '../client';
import { BAND_TYPES } from '@/lib/band-data';

export function generateStaticParams() {
  return BAND_TYPES.map((bt) => ({ bandTypeId: bt.id }));
}

export default async function Page({ params }) {
  const { bandTypeId } = await params;
  return <BandOrderWizardPage initialBandTypeId={bandTypeId} />;
}
