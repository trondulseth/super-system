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
    if (focusables[0]) {
      focusables[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const items = getFocusableElements(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
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

let scrollLockCount = 0;
let savedBodyOverflow: string | null = null;

let backgroundInertCount = 0;
const backgroundInertState = new Map<Element, string | null>();

function reconcileBackgroundInertCount() {
  for (const element of backgroundInertState.keys()) {
    if (!element.isConnected) {
      backgroundInertState.delete(element);
    }
  }

  if (backgroundInertState.size === 0 && backgroundInertCount > 0) {
    backgroundInertCount = 0;
  }
}

function setBackgroundInert(active: boolean) {
  if (active) {
    reconcileBackgroundInertCount();
    backgroundInertCount += 1;
    if (backgroundInertCount !== 1) return;

    const portalRoot = document.querySelector("[data-ss-portal-root]");
    for (const child of Array.from(document.body.children)) {
      if (child === portalRoot) continue;
      backgroundInertState.set(child, child.getAttribute("aria-hidden"));
      child.setAttribute("aria-hidden", "true");
    }
    return;
  }

  backgroundInertCount = Math.max(0, backgroundInertCount - 1);
  if (backgroundInertCount !== 0) return;

  for (const [element, previous] of backgroundInertState.entries()) {
    if (previous === null) {
      element.removeAttribute("aria-hidden");
    } else {
      element.setAttribute("aria-hidden", previous);
    }
  }
  backgroundInertState.clear();
}

export function useBackgroundInert(active: boolean) {
  React.useEffect(() => {
    if (!active) return;

    setBackgroundInert(true);
    return () => setBackgroundInert(false);
  }, [active]);
}

export function useBodyScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) return;

    scrollLockCount += 1;
    if (scrollLockCount === 1) {
      savedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      scrollLockCount -= 1;
      if (scrollLockCount <= 0) {
        scrollLockCount = 0;
        if (savedBodyOverflow) {
          document.body.style.overflow = savedBodyOverflow;
        } else {
          document.body.style.removeProperty("overflow");
        }
        savedBodyOverflow = null;
      }
    };
  }, [active]);
}

export interface FloatingPositionOptions {
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  gap?: number;
}

export function useFloatingPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  options: FloatingPositionOptions = {}
): { top: number; left: number; transform?: string } | null {
  const { side = "bottom", align = "start", gap = 8 } = options;
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    transform?: string;
  } | null>(null);

  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPosition(null);
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const top = side === "bottom" ? triggerRect.bottom + gap : triggerRect.top - gap;
    let left = triggerRect.left;
    let transform: string | undefined;

    if (align === "center") {
      left = triggerRect.left + triggerRect.width / 2;
      transform = side === "top" ? "translate(-50%, -100%)" : "translateX(-50%)";
    } else if (align === "end") {
      left = triggerRect.right;
      transform = side === "top" ? "translate(-100%, -100%)" : "translateX(-100%)";
    } else if (side === "top") {
      transform = "translateY(-100%)";
    }

    setPosition({ top, left, transform });
  }, [align, gap, open, side, triggerRef]);

  return position;
}

export function useDismissOnOutsideClick(
  active: boolean,
  refs: Array<React.RefObject<Node | null>>,
  onDismiss: () => void
) {
  React.useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [active, onDismiss, refs]);
}

export function useEscapeToClose(
  active: boolean,
  onClose: () => void,
  restoreFocusRef?: React.RefObject<HTMLElement | null>
) {
  React.useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
      restoreFocusRef?.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose, restoreFocusRef]);
}
