import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  navbarVariant?: string;
}

const MainLayout = ({ children, navbarVariant }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant={navbarVariant as "default" | "checkout" | "seller" | undefined} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
