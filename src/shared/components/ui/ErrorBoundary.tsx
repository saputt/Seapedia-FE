import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="card max-w-md w-full text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              {this.state.error?.message || " sesuatu yang tidak terduga terjadi."}
            </p>
            <button
              onClick={this.handleRetry}
              className="btn-primary text-sm"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
