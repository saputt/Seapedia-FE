import { Component } from "react";

/**
 * Error Boundary untuk menangkap crash pada React component tree.
 * Mencegah seluruh app down jika satu component crash.
 * Menampilkan fallback UI dengan tombol retry.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
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
