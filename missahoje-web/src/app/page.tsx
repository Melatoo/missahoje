import { MapComponent } from '../features/map/components/MapComponent';

export default function Home() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <MapComponent />
    </div>
  );
}
