import { memo } from "react";

type IconName =
  | "home"
  | "cart"
  | "user"
  | "chevronRight"
  | "chevronLeft"
  | "close"
  | "arrowLeft"
  | "menu"
  | "search"
  | "trash"
  | "edit"
  | "plus"
  | "minus"
  | "check"
  | "wallet"
  | "location"
  | "truck"
  | "store"
  | "clock"
  | "dollar"
  | "grid"
  | "package"
  | "star"
  | "filter"
  | "refresh";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const iconPaths: Record<IconName, string | string[]> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  cart: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'circle cx=12 cy=7 r=4'],
  chevronRight: 'polyline points=9 18 15 12 9 6',
  chevronLeft: 'polyline points=15 18 9 12 15 6',
  close: ['line x1=18 y1=6 x2=6 y2=18', 'line x1=6 y1=6 x2=18 y2=18'],
  arrowLeft: 'polyline points=15 18 9 12 15 6',
  menu: ['line x1=3 y1=12 x2=21 y2=12', 'line x1=3 y1=6 x2=21 y2=6', 'line x1=3 y1=18 x2=21 y2=18'],
  search: ['circle cx=11 cy=11 r=8', 'line x1=21 y1=21 x2=16.65 y2=16.65'],
  trash: ['polyline points=3 6 5 6 21 6', 'path d=M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  edit: 'path d=M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  plus: ['line x1=12 y1=5 x2=12 y2=19', 'line x1=5 y1=12 x2=19 y2=12'],
  minus: 'line x1=5 y1=12 x2=19 y2=12',
  check: 'polyline points=20 6 9 17 4 12',
  wallet: ['rect x=1 y=4 width=22 height=16 rx=2 ry=2', 'line x1=1 y1=10 x2=23 y2=10'],
  location: ['path d=M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'circle cx=12 cy=10 r=3'],
  truck: ['rect x=1 y=3 width=15 height=13', 'polygon points=16 8 20 8 23 11 23 16 16 16 16 8', 'circle cx=5.5 cy=18.5 r=2.5', 'circle cx=18.5 cy=18.5 r=2.5'],
  store: 'path d=M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  clock: ['circle cx=12 cy=12 r=10', 'polyline points=12 6 12 12 16 14'],
  dollar: ['line x1=12 y1=1 x2=12 y2=23', 'path d=M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  grid: ['rect x=3 y=3 width=7 height=7', 'rect x=14 y=3 width=7 height=7', 'rect x=14 y=14 width=7 height=7', 'rect x=3 y=14 width=7 height=7'],
  package: ['line x1=16.5 y1=9.4 x2=7.5 y2=4.21', 'path d=M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'polyline points=3.27 6.96 12 12.01 20.73 6.96', 'line x1=12 y1=22.08 x2=12 y2=12'],
  star: 'polygon points=12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
  filter: 'polygon points=22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3',
  refresh: ['polyline points=23 4 23 10 17 10', 'path d=M20.49 15a9 9 0 1 1-2.12-9.36L23 10'],
};

const Icon = memo(({ name, size = 20, className }: IconProps) => {
  const paths = iconPaths[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {Array.isArray(paths) ? (
        paths.map((d, i) => {
          if (d.startsWith("polyline")) {
            const points = d.replace("polyline points=", "");
            return <polyline key={i} points={points} />;
          }
          if (d.startsWith("line")) {
            const match = d.match(/x1=(\S+)\s+y1=(\S+)\s+x2=(\S+)\s+y2=(\S+)/);
            if (match) {
              return <line key={i} x1={match[1]} y1={match[2]} x2={match[3]} y2={match[4]} />;
            }
          }
          if (d.startsWith("circle")) {
            const match = d.match(/cx=(\S+)\s+cy=(\S+)\s+r=(\S+)/);
            if (match) {
              return <circle key={i} cx={match[1]} cy={match[2]} r={match[3]} />;
            }
          }
          return <path key={i} d={d} />;
        })
      ) : (
        <path d={paths} />
      )}
    </svg>
  );
});

Icon.displayName = "Icon";

export default Icon;
export type { IconName };
