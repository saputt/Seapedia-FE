import { VTLink as Link } from "../../utils/VTLink";
import Button from "./Button";

export type EmptyStateProps = {
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

const EmptyState = ({ message = "Tidak ada data.", actionLabel, actionTo, onAction }: EmptyStateProps) => (
  <div className="card text-center py-10">
    <p className="text-sm text-text-secondary">{message}</p>
    {(actionLabel && (actionTo || onAction)) && (
      <div className="mt-4">
        {actionTo ? (
          <Link to={actionTo} className="btn-primary text-sm !py-2 !px-6 inline-block">
            {actionLabel}
          </Link>
        ) : (
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
