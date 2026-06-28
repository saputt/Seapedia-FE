import { useEffect } from "react";
import AppRoutes from "./routes";
import ErrorBoundary from "./shared/components/ui/ErrorBoundary";

const FORM_KEYS = ["form_product", "form_address", "form_discount", "form_store", "form_review"];

const App = () => {
  useEffect(() => {
    for (const key of FORM_KEYS) {
      localStorage.removeItem(key);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;
