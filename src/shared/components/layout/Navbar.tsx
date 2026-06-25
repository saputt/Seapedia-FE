import CheckoutNavbar from "./CheckoutNavbar";
import SellerNavbar from "./SellerNavbar";
import DefaultNavbar from "./DefaultNavbar";

interface NavbarProps {
  variant?: "default" | "checkout" | "seller";
  onMenuClick?: () => void;
}

const Navbar = ({ variant = "default", onMenuClick }: NavbarProps) => {
  if (variant === "checkout") {
    return <CheckoutNavbar />;
  }

  if (variant === "seller") {
    return <SellerNavbar onMenuClick={onMenuClick} />;
  }

  return <DefaultNavbar />;
};

export default Navbar;
