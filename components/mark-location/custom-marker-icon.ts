import L from "leaflet";

export function createPickupMarkerIcon() {
  return L.divIcon({
    className: "pickup-marker-icon",
    html: `
      <div style="position:relative;width:40px;height:48px;transform:translate(-50%,-100%);">
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 0C11.163 0 4 7.163 4 16c0 11.25 16 32 16 32s16-20.75 16-32C36 7.163 28.837 0 20 0z" fill="#303030"/>
          <circle cx="20" cy="16" r="7" fill="white"/>
          <circle cx="20" cy="16" r="3.5" fill="#303030"/>
        </svg>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
}
