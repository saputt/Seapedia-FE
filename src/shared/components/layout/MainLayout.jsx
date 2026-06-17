import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children, navbarVariant }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant={navbarVariant} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
