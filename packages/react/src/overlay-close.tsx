import * as React from "react";
import { mergeHandlers } from "./utils.js";

export interface OverlayCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
}

export const OverlayClose = React.forwardRef<HTMLButtonElement, OverlayCloseProps>(
  function OverlayClose(
    { className, onClick, onClose, "aria-label": ariaLabel = "Close", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={mergeHandlers(onClick, onClose)}
        {...props}
      />
    );
  }
);
OverlayClose.displayName = "OverlayClose";
