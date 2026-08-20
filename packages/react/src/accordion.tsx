import * as React from "react";
import { classes, mergeHandlers } from "./utils.js";

type AccordionValue = string | string[];

interface AccordionContextValue {
  type: "single" | "multiple";
  value: AccordionValue;
  toggleItem: (itemValue: string) => void;
  baseId: string;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
  value: string;
  disabled?: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used within Accordion.`);
  }
  return context;
}

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const item = React.useContext(AccordionItemContext);
  if (item === null) {
    throw new Error(`${component} must be used within AccordionItem.`);
  }
  return item;
}

function normalizeMultiple(value: AccordionValue): string[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
  collapsible?: boolean;
}

export function Accordion({
  type = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  collapsible = true,
  className,
  children,
  ...props
}: AccordionProps) {
  const resolvedDefault =
    defaultValue ?? (type === "multiple" ? [] : "");
  const [uncontrolledValue, setUncontrolledValue] = React.useState<AccordionValue>(resolvedDefault);
  const baseId = React.useId();
  const value = valueProp ?? uncontrolledValue;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let next: AccordionValue;
      if (type === "multiple") {
        const current = normalizeMultiple(value);
        next = current.includes(itemValue)
          ? current.filter((entry) => entry !== itemValue)
          : [...current, itemValue];
      } else {
        const current = typeof value === "string" ? value : "";
        if (current === itemValue && collapsible) {
          next = "";
        } else {
          next = itemValue;
        }
      }

      if (valueProp === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [collapsible, onValueChange, type, value, valueProp]
  );

  return (
    <AccordionContext.Provider value={{ type, value, toggleItem, baseId }}>
      <div className={classes("ss-accordion", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  disabled,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value, disabled }}>
      <div
        className={classes("ss-accordion__item", disabled && "ss-accordion__item--disabled", className)}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, disabled, onClick, children, ...props }, ref) {
    const { value: itemValue, disabled: itemDisabled } = useAccordionItemContext("AccordionTrigger");
    const { value, toggleItem, baseId } = useAccordionContext("AccordionTrigger");
    const isDisabled = disabled || itemDisabled;
    const expanded =
      Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
    const triggerId = `${baseId}-trigger-${itemValue}`;
    const contentId = `${baseId}-content-${itemValue}`;

    return (
      <h3 className="ss-accordion__heading">
        <button
          ref={ref}
          id={triggerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          disabled={isDisabled}
          className={classes("ss-accordion__trigger", className)}
          onClick={mergeHandlers(onClick, () => {
            if (!isDisabled) toggleItem(itemValue);
          })}
          {...props}
        >
          <span className="ss-accordion__trigger-label">{children}</span>
          <span className="ss-accordion__icon" aria-hidden="true" />
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { value: itemValue } = useAccordionItemContext("AccordionContent");
  const { value, baseId } = useAccordionContext("AccordionContent");
  const expanded =
    Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
  const triggerId = `${baseId}-trigger-${itemValue}`;
  const contentId = `${baseId}-content-${itemValue}`;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!expanded}
      className={classes("ss-accordion__content", className)}
      {...props}
    >
      <div className="ss-accordion__content-inner">{children}</div>
    </div>
  );
}
