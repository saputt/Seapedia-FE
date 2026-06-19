import Button from "./Button";

const ErrorState = ({ message = "Terjadi kesalahan.", onRetry }) => (
  <div className="card text-center py-10">
    <p className="text-danger font-semibold mb-4">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="primary" size="sm">
        Coba Lagi
      </Button>
    )}
  </div>
);

export default ErrorState;
