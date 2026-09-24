import { MapComponent } from '../features/mapa/components/MapComponent';

export default function Home() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <MapComponent />
    </div>
  );
}
