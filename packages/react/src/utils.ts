import * as React from "react";

export function classes(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

export function mergeHandlers<Event extends React.SyntheticEvent>(
  theirs: ((event: Event) => void) | undefined,
  ours: (event: Event) => void
): (event: Event) => void {
  return (event) => {
    theirs?.(event);
    ours(event);
  };
}

export function mergeDescribedBy(existing: string | undefined, id: string): string {
  const ids = new Set((existing ?? "").split(/\s+/).filter(Boolean));
  ids.add(id);
  return [...ids].join(" ");
}

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const FORM_CONTROL_NAMES = new Set(["Input", "Textarea", "Checkbox", "Switch", "Select", "Radio"]);

export function isFormControl(element: React.ReactElement): boolean {
  if (typeof element.type === "string") {
    return element.type === "input" || element.type === "textarea" || element.type === "select";
  }

  const typed = element.type as {
    displayName?: string;
    name?: string;
    render?: { displayName?: string; name?: string };
  };
  const componentName =
    typed.displayName ?? typed.name ?? typed.render?.displayName ?? typed.render?.name ?? "";
  return FORM_CONTROL_NAMES.has(componentName);
}
