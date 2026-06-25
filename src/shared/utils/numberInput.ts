/**
 * Handles number input with regex validation.
 * Only allows digits (0-9) to be entered.
 */
export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const value = e.target.value;
  if (value === "" || /^\d+$/.test(value)) {
    onChange(value);
  }
};

/**
 * Handles keydown event for number inputs.
 * Only allows number keys and navigation keys.
 */
export const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
  if (allowedKeys.includes(e.key)) return;
  if (e.key >= "0" && e.key <= "9") return;
  e.preventDefault();
};
