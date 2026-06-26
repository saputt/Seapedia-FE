export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f0f0f0" rx="8"/>
      <g transform="translate(200,200)" fill="none" stroke="#ccc" stroke-width="2">
        <rect x="-60" y="-50" width="120" height="90" rx="6" stroke-width="2.5"/>
        <polyline points="-30,15 -15,-5 0,10 15,-15 30,5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="-40" y1="-30" x2="-10" y2="-30" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-40" y1="-18" x2="-20" y2="-18" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>`
  );
