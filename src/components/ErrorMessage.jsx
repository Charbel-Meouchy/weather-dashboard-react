function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <span className="error__icon" aria-hidden="true">⚠️</span>
      <p className="error__text">{message}</p>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;