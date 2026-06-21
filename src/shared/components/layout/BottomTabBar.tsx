import { useLocation, Link } from "react-router-dom";
import { SidebarLink } from "../../../types";

const TabIcon = ({ path, isActive }: { path: string; isActive: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? "text-brand-deep" : "text-text-muted"}>
    <path d={path} />
  </svg>
);

interface BottomTabBarProps {
  links: SidebarLink[];
}

const BottomTabBar = ({ links }: BottomTabBarProps) => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t-[3px] border-brand-deep/20">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const segments = link.to.split("/").filter(Boolean);
          const isActive = segments.length <= 2
            ? link.to === location.pathname
            : (link.to === location.pathname || location.pathname.startsWith(link.to + "/"));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-brand-deep" : "text-text-muted hover:text-brand-deep"
              }`}
            >
              <TabIcon path={link.icon} isActive={isActive} />
              <span className={`text-[10px] font-medium ${isActive ? "text-brand-deep" : "text-text-muted"}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
