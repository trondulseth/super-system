# Troubleshooting

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [CLI](./cli.md) · [Studio](./studio.md)

## Troubleshooting

### The components have no styling

Make sure both files are imported once near your application root:

```tsx
import "../.super-system/theme.css";
import "@super-system/react/styles.css";
```

### `super-system.json already exists`

That is a safety feature. Use Studio to edit the current theme. Only use `init --force` when you deliberately want to replace it.

### My manual theme changes are not visible

Regenerate the CSS:

```bash
npx @super-system/cli build-theme
```

Then restart the application if its development server does not notice generated files.

### Contrast checks fail

Increase the difference between the relevant foreground and background colors. Studio displays the ratio while you edit.

### Studio does not open automatically

Open `http://127.0.0.1:4173` manually, or choose another port:

```bash
npx @super-system/cli studio --port 5000
```
