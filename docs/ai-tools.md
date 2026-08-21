# AI coding tools

[← Documentation](./README.md) · [Getting started](./getting-started.md#get-started-with-ai-recommended)

## Using Super System with AI coding tools

Super System is designed to work well with coding agents. Start with the [AI prompts in Getting started](./getting-started.md#get-started-with-ai-recommended), then keep this rule in your project docs so future sessions stay consistent:

```text
Use components from @super-system/react for buttons, inputs, textareas, labels, checkboxes, radio groups, switches, sliders, selects, alerts, spinners, skeletons, tooltips, badges, cards, tabs, accordions, breadcrumbs, dropdown menus, pagination, dialogs, drawers, popovers, toasts, tables, icons, and theme switching.
Use semantic Super System CSS variables instead of hard-coded colors or spacing.
Treat super-system.json as the single source of truth.
Never edit .super-system/theme.css manually.
After UI work, run npx @super-system/cli audit and check-contrast.
```

The rule works in an `AGENTS.md`, `CLAUDE.md`, Cursor rule, Copilot instruction, or ordinary project documentation.
