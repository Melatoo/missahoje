import { LayoutShell } from '../components/layouts/LayoutShell';
import { MapComponent } from '../features/map/components/MapComponent';

export default function Home() {
  return (
    <LayoutShell>
      <div className="absolute inset-0 w-full h-full">
        <MapComponent />
      </div>
    </LayoutShell>
  );
}
