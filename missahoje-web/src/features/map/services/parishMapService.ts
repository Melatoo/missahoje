
import { MapBounds, Parish } from '../types';

/**
 * MOCK SERVICE - to be replaced by actual API call later.
 * Fetches parishes within the given bounding box.
 */
export async function getParishesInBounds(bounds: MapBounds | null): Promise<Parish[]> {
  if (!bounds) return [];

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock data for some parishes inside the bounding box
  // We'll generate a few parishes near the center of the bounds
  const centerLat = (bounds.southWest.lat + bounds.northEast.lat) / 2;
  const centerLng = (bounds.southWest.lng + bounds.northEast.lng) / 2;

  // Generate 5 random parishes around the center
  const mockParishes: Parish[] = Array.from({ length: 5 }).map((_, i) => {
    // Add some random offset within a small radius (~0.05 degrees)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    return {
      id: `parish-mock-${i}`,
      name: `Paróquia Simulada ${i + 1}`,
      location: {
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset,
      },
      distance: Math.floor(Math.random() * 10) + 1,
      tags: ['Acessível', 'Estacionamento'].filter(() => Math.random() > 0.5),
      hasParking: Math.random() > 0.5,
      isAccessible: Math.random() > 0.5,
      nextMassTime: '18:00',
    };
  });

  return mockParishes;
}
