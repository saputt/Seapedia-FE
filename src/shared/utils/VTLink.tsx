import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import type { LinkProps, NavLinkProps } from "react-router-dom";

export const VTLink = (props: LinkProps) => <RouterLink {...props} viewTransition />;
export const VTNavLink = (props: NavLinkProps) => <RouterNavLink {...props} viewTransition />;
