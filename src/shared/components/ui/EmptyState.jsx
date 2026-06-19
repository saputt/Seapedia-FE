import Button from "./Button";

const EmptyState = ({ message = "Tidak ada data.", actionLabel, actionTo, onAction }) => (
  <div className="card text-center py-10">
    <p className="text-sm text-text-secondary">{message}</p>
    {(actionLabel && (actionTo || onAction)) && (
      <div className="mt-4">
        {actionTo ? (
          <a href={actionTo} className="btn-primary text-sm !py-2 !px-6 inline-block">
            {actionLabel}
          </a>
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
