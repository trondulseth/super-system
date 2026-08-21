function focusableMenuItems(menu: HTMLElement): HTMLButtonElement[] {
  return Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
}

export function initPreviewInteractions(): void {
  initPreviewTabs();
  initPreviewAccordion();
  initPreviewDropdowns();
  initPreviewTooltips();
  initPreviewPopovers();
  initPreviewToastDismiss();
}

function initPreviewTabs(): void {
  const root = document.querySelector(".preview-tabs-demo");
  if (!root) return;

  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const list = root.querySelector('[role="tablist"]');

  function activate(value: string): void {
    triggers.forEach((trigger) => {
      const selected = trigger.dataset.tabValue === value;
      trigger.setAttribute("aria-selected", String(selected));
      trigger.classList.toggle("ss-tabs__trigger--active", selected);
      trigger.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.dataset.tabPanel === value;
      panel.hidden = !selected;
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const value = trigger.dataset.tabValue;
      if (value) activate(value);
    });
  });

  list?.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) return;

    const enabled = triggers.filter((trigger) => !trigger.disabled);
    const currentIndex = enabled.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = currentIndex >= enabled.length - 1 ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1;
    } else {
      return;
    }

    event.preventDefault();
    enabled[nextIndex]?.focus();
  });
}

function initPreviewAccordion(): void {
  const root = document.querySelector(".preview-accordion-demo");
  if (!root) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-accordion-item]"));

  function setExpanded(itemId: string, expanded: boolean): void {
    const item = root?.querySelector<HTMLElement>(`[data-accordion-item="${itemId}"]`);
    if (!item) return;

    const trigger = item.querySelector<HTMLButtonElement>(".ss-accordion__trigger");
    const panel = item.querySelector<HTMLElement>("[data-accordion-panel]");
    if (!trigger || !panel) return;

    trigger.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  }

  items.forEach((item) => {
    const itemId = item.dataset.accordionItem;
    const trigger = item.querySelector<HTMLButtonElement>(".ss-accordion__trigger");
    if (!itemId || !trigger) return;

    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      items.forEach((entry) => {
        const entryId = entry.dataset.accordionItem;
        if (!entryId) return;
        setExpanded(entryId, entryId === itemId ? !expanded : false);
      });
    });
  });
}

function initPreviewDropdowns(): void {
  document.querySelectorAll<HTMLElement>(".preview-dropdown-demo").forEach((root) => {
    const trigger = root.querySelector<HTMLButtonElement>("button");
    const menu = root.querySelector<HTMLElement>('[role="menu"]');
    if (!trigger || !menu) return;

    function setOpen(open: boolean): void {
      root.classList.toggle("is-open", open);
      trigger!.setAttribute("aria-expanded", String(open));
      menu!.hidden = !open;
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(trigger.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) return;

      const items = focusableMenuItems(menu);
      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.focus();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
        items[next]?.focus();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items[next]?.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target as Node)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        trigger.focus();
      }
    });
  });
}

function initPreviewTooltips(): void {
  document.querySelectorAll<HTMLElement>(".preview-tooltip-demo").forEach((root) => {
    const trigger = root.querySelector<HTMLButtonElement>("button");
    const tooltip = root.querySelector<HTMLElement>('[role="tooltip"]');
    if (!trigger || !tooltip) return;

    function setOpen(open: boolean): void {
      root.classList.toggle("is-open", open);
      tooltip!.hidden = !open;
      if (open) {
        trigger!.setAttribute("aria-describedby", tooltip!.id);
      } else {
        trigger!.removeAttribute("aria-describedby");
      }
    }

    trigger.addEventListener("mouseenter", () => setOpen(true));
    trigger.addEventListener("mouseleave", () => setOpen(false));
    trigger.addEventListener("focus", () => setOpen(true));
    trigger.addEventListener("blur", () => setOpen(false));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  });
}

function initPreviewPopovers(): void {
  document.querySelectorAll<HTMLElement>(".preview-popover-demo").forEach((root) => {
    const trigger = root.querySelector<HTMLButtonElement>("button");
    const content = root.querySelector<HTMLElement>('[role="dialog"]');
    if (!trigger || !content) return;

    const popoverTrigger = trigger;
    const popoverContent = content;

    function setOpen(open: boolean): void {
      root.classList.toggle("is-open", open);
      popoverTrigger.setAttribute("aria-expanded", String(open));
      popoverContent.hidden = !open;
    }

    popoverTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(popoverTrigger.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target as Node)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && popoverTrigger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        popoverTrigger.focus();
      }
    });
  });
}

function initPreviewToastDismiss(): void {
  document.querySelectorAll<HTMLElement>(".preview-toast-stack .ss-toast").forEach((toast) => {
    const close = toast.querySelector<HTMLButtonElement>(".ss-toast__close");
    close?.addEventListener("click", () => {
      toast.hidden = true;
    });
  });
}
