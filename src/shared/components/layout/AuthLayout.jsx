import { Link } from "react-router-dom";

const AuthLayout = ({ children, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-brand-deep font-extrabold text-3xl tracking-tight">
            SEAPEDIA
          </Link>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
