import { useLocation } from "react-router-dom";
import { VTLink as Link } from "../../utils/VTLink";
import { SidebarLink } from "../../../types";
import NavIcon from "../ui/NavIcon";

interface DashboardSidebarProps {
  title: string;
  subtitle: string;
  links: SidebarLink[];
}

const DashboardSidebar = ({ title, subtitle, links }: DashboardSidebarProps) => {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 border-r-[3px] border-brand-deep/20 bg-bg-secondary hidden lg:flex lg:flex-col sticky top-16 self-start h-[calc(100vh-4rem)]">
      <div className="p-5 border-b-[3px] border-brand-deep/20">
        <h2 className="font-bold text-text-primary truncate">{title}</h2>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
      <nav className="p-3 space-y-1 flex-1">
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
    </aside>
  );
};

export default DashboardSidebar;
