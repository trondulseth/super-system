import * as React from "react";
import { Button } from "./button.js";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "./drawer.js";
import { classes } from "./utils.js";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export function PageHeader({ title, description, className, children, ...props }: PageHeaderProps) {
  return (
    <header className={classes("ss-page-header", className)} {...props}>
      <div className="ss-page-header__content">
        <h1 className="ss-page-header__title">{title}</h1>
        {description ? <p className="ss-page-header__description">{description}</p> : null}
      </div>
      {children ? <div className="ss-page-header__actions">{children}</div> : null}
    </header>
  );
}

export interface PageFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function PageFooter({ className, children, ...props }: PageFooterProps) {
  return (
    <footer className={classes("ss-page-footer", className)} {...props}>
      {children}
    </footer>
  );
}

export interface MainProps extends React.HTMLAttributes<HTMLElement> {}

export function Main({ className, ...props }: MainProps) {
  return <main className={classes("ss-main", className)} {...props} />;
}

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Hides the desktop sidebar below 768px. Pair with `HamburgerMenu` for mobile navigation.
   */
  sidebarCollapsible?: boolean;
}

export function AppShell({
  sidebar,
  header,
  footer,
  sidebarCollapsible = false,
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      className={classes(
        "ss-app-shell",
        sidebarCollapsible && "ss-app-shell--sidebar-collapsible",
        className
      )}
      {...props}
    >
      {sidebar}
      <div className="ss-app-shell__body">
        {header}
        {children}
        {footer}
      </div>
    </div>
  );
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return <aside className={classes("ss-sidebar", className)} {...props} />;
}

export interface SidebarBrandProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarBrand({ className, ...props }: SidebarBrandProps) {
  return <div className={classes("ss-sidebar__brand", className)} {...props} />;
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  return <nav aria-label="Sidebar" className={classes("ss-sidebar__nav", className)} {...props} />;
}

export interface SidebarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  function SidebarNavItem({ active, className, ...props }, ref) {
    return (
      <a
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={classes("ss-sidebar__link", active && "ss-sidebar__link--active", className)}
        {...props}
      />
    );
  }
);
SidebarNavItem.displayName = "SidebarNavItem";

export interface HamburgerMenuProps {
  label?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function HamburgerMenu({ label = "Open menu", title = "Menu", children }: HamburgerMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} side="left">
      <DrawerTrigger>
        <Button variant="ghost" aria-label={label} className="ss-hamburger-menu__trigger">
          <span className="ss-hamburger-menu__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="ss-hamburger-menu__panel">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav
            aria-label="Mobile navigation"
            className="ss-hamburger-menu__nav"
            onClick={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest("a,button")) setOpen(false);
            }}
          >
            {children}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {}

export function TopBar({ className, ...props }: TopBarProps) {
  return <header className={classes("ss-top-bar", className)} {...props} />;
}

export interface TopBarBrandProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TopBarBrand({ className, ...props }: TopBarBrandProps) {
  return <div className={classes("ss-top-bar__brand", className)} {...props} />;
}

export interface TopBarActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TopBarActions({ className, ...props }: TopBarActionsProps) {
  return <div className={classes("ss-top-bar__actions", className)} {...props} />;
}
