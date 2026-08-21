import * as React from "react";
import { classes, mergeHandlers } from "./utils.js";

interface RegisteredTrigger {
  value: string;
  disabled: boolean;
}

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  orientation: "horizontal" | "vertical";
  listRef: React.RefObject<HTMLDivElement | null>;
  autoSelectedRef: React.MutableRefObject<boolean>;
  isControlled: boolean;
  registerValue: (value: string, disabled?: boolean) => void;
  unregisterValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be used within Tabs.`);
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const baseId = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const autoSelectedRef = React.useRef(false);
  const [registeredTriggers, setRegisteredTriggers] = React.useState<RegisteredTrigger[]>([]);
  const uncontrolledValueResolved = valueProp ?? uncontrolledValue;
  const isControlled = valueProp !== undefined;

  const registerValue = React.useCallback((next: string, disabled = false) => {
    setRegisteredTriggers((current) => {
      const existing = current.find((entry) => entry.value === next);
      if (existing) {
        if (existing.disabled === disabled) return current;
        return current.map((entry) =>
          entry.value === next ? { ...entry, disabled } : entry
        );
      }
      return [...current, { value: next, disabled }];
    });
  }, []);

  const unregisterValue = React.useCallback((next: string) => {
    setRegisteredTriggers((current) => current.filter((entry) => entry.value !== next));
  }, []);

  const resolvedValue = React.useMemo(() => {
    if (
      !isControlled ||
      uncontrolledValueResolved === "" ||
      registeredTriggers.some((entry) => entry.value === uncontrolledValueResolved)
    ) {
      return uncontrolledValueResolved;
    }

    const firstEnabled = registeredTriggers.find((entry) => !entry.disabled);
    return firstEnabled?.value ?? uncontrolledValueResolved;
  }, [isControlled, registeredTriggers, uncontrolledValueResolved]);

  React.useEffect(() => {
    if (!isControlled || !valueProp || process.env.NODE_ENV === "production") return;
    if (
      registeredTriggers.length > 0 &&
      !registeredTriggers.some((entry) => entry.value === valueProp)
    ) {
      console.warn(
        `[Super System Tabs] Controlled value "${valueProp}" does not match any TabsTrigger.`
      );
    }
  }, [isControlled, registeredTriggers, valueProp]);

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, valueProp]
  );

  return (
    <TabsContext.Provider
      value={{
        value: resolvedValue,
        setValue,
        baseId,
        orientation,
        listRef,
        autoSelectedRef,
        isControlled,
        registerValue,
        unregisterValue
      }}
    >
      <div className={classes("ss-tabs", className)} data-orientation={orientation} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, onKeyDown, ...props }: TabsListProps) {
  const { orientation, listRef } = useTabsContext("TabsList");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []
    );
    const currentIndex = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    const isHorizontal = orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const homeKey = "Home";
    const endKey = "End";

    let nextIndex = currentIndex;
    if (event.key === prevKey) {
      nextIndex = currentIndex <= 0 ? triggers.length - 1 : currentIndex - 1;
    } else if (event.key === nextKey) {
      nextIndex = currentIndex >= triggers.length - 1 ? 0 : currentIndex + 1;
    } else if (event.key === homeKey) {
      nextIndex = 0;
    } else if (event.key === endKey) {
      nextIndex = triggers.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    triggers[nextIndex]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={classes("ss-tabs__list", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, disabled, onClick, ...props },
  ref
) {
  const { value: activeValue, setValue, baseId, autoSelectedRef, isControlled, listRef, registerValue, unregisterValue } =
    useTabsContext("TabsTrigger");
  const selected = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  React.useEffect(() => {
    registerValue(value, Boolean(disabled));
    return () => unregisterValue(value);
  }, [disabled, registerValue, unregisterValue, value]);

  React.useEffect(() => {
    if (isControlled || autoSelectedRef.current || activeValue !== "" || disabled) return;

    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    );
    const firstEnabled = triggers.find((trigger) => !trigger.disabled);
    if (!firstEnabled || firstEnabled.id !== triggerId) return;

    autoSelectedRef.current = true;
    setValue(value);
  }, [activeValue, autoSelectedRef, disabled, isControlled, listRef, setValue, triggerId, value]);

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={classes("ss-tabs__trigger", selected && "ss-tabs__trigger--active", className)}
      onClick={mergeHandlers(onClick, () => {
        if (!disabled) setValue(value);
      })}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export function TabsContent({ value, forceMount, className, children, ...props }: TabsContentProps) {
  const { value: activeValue, baseId } = useTabsContext("TabsContent");
  const selected = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const mounted = forceMount || selected;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      hidden={!selected}
      tabIndex={0}
      className={classes("ss-tabs__content", className)}
      {...props}
    >
      {mounted ? children : null}
    </div>
  );
}
