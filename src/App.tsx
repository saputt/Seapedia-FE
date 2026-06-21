import AppRoutes from "./routes";
import ErrorBoundary from "./shared/components/ui/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;
