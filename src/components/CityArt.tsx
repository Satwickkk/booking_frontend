import { useState, type ReactNode } from 'react';
import { useDestinations } from '../api/hooks';

// City photos belong to the data, so they come from the backend:
// GET /meta/destinations → cities[].image (e.g. "/static/cities/kyoto.jpg").
// Until the backend sends one, the banner shows a clean colour block.
function useCityImage(city: string): string | undefined {
  const { data } = useDestinations();
  return data?.cities.find((c) => c.name === city)?.image;
}

// A palette colour per city, so cards without a photo still differ.
const TONES = ['#34515B', '#1F3138', '#2B4A52', '#3E5F68'];
function tone(city: string) {
  let h = 0;
  for (const ch of city) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

export function CityBanner({ city, children, height = 180 }: { city: string; children?: ReactNode; height?: number }) {
  const image = useCityImage(city);
  const [failed, setFailed] = useState(false);
  const showPhoto = !!image && !failed;
  return (
    <div className="city-banner" style={{ height, background: tone(city) }}>
      {showPhoto && (
        <>
          <img className="photo" src={image} alt="" onError={() => setFailed(true)} />
          <span className="shade" />
        </>
      )}
      <span className="city-name">{city}</span>
      {children}
    </div>
  );
}
