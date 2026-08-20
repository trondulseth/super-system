import * as React from "react";
import { createPortal } from "react-dom";

function getPortalContainer(): HTMLElement {
  const existing = document.querySelector<HTMLElement>("[data-ss-portal-root]");
  if (existing) return existing;

  const container = document.createElement("div");
  container.setAttribute("data-ss-portal-root", "");
  document.body.appendChild(container);
  return container;
}

export function OverlayPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const portalContainerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    portalContainerRef.current = getPortalContainer();
    setMounted(true);
  }, []);

  if (!mounted || !portalContainerRef.current) return null;
  return createPortal(children, portalContainerRef.current);
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.tabIndex !== -1 && !element.hasAttribute("disabled")
  );
}

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  restoreFocusRef?: React.RefObject<HTMLElement | null>
) {
  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = getFocusableElements(container);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const items = getFocusableElements(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      const restoreTarget = restoreFocusRef?.current ?? previouslyFocused;
      restoreTarget?.focus();
    };
  }, [active, containerRef, restoreFocusRef]);
}

export function useBodyScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (previousOverflow) {
        document.body.style.overflow = previousOverflow;
      } else {
        document.body.style.removeProperty("overflow");
      }
    };
  }, [active]);
}
