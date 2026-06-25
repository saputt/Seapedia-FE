import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { SidebarLink } from "../../../types";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const NavIcon = ({ path }: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  links: SidebarLink[];
}

const MobileSidebar = ({ isOpen, onClose, title, subtitle, links }: MobileSidebarProps) => {
  const location = useLocation();

  useLockBodyScroll(isOpen);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 w-64 h-full bg-bg-secondary border-r-[3px] border-brand-deep/20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b-[3px] border-brand-deep/20 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-text-primary">{title}</h2>
            <p className="text-xs text-text-muted">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-brand-subtle rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {links.map((link) => {
            const segments = link.to.split("/").filter(Boolean);
            const isActive = segments.length <= 2
              ? link.to === location.pathname
              : (link.to === location.pathname || location.pathname.startsWith(link.to + "/"));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-brand-deep text-white border-2 border-brand-deep neoshadow-sm"
                    : "text-text-secondary border-2 border-transparent hover:text-brand-deep hover:bg-white hover:border-brand-deep hover:neoshadow-sm hover:-translate-y-0.5 active:neoshadow active:translate-y-0"
                }`}
              >
                <NavIcon path={link.icon} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
