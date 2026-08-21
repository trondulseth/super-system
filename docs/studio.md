# Super System Studio

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Theme](./theme.md) · [CLI](./cli.md)

## Make it yours with Super System Studio

Run:

```bash
npx @super-system/cli studio
```

Or try the browser demo without installing anything: [Super System Studio on GitHub Pages](https://trondulseth.github.io/super-system/).

The public demo uses the same Studio UI as the CLI. It keeps edits in your browser and downloads `super-system.json` when you export a theme. For project integration and saving directly to your repository, use the local command above.

Studio opens locally in your browser. It does not upload your project or theme anywhere.

Use it to preview and adjust:

- light and dark colors, including semantic colors (muted, border, destructive, focus);
- font family and base size (slider);
- component density;
- border radius (sliders for sm, md, and lg);
- line height, spacing unit, and minimum interactive target size (sliders);
- AA or AAA contrast requirements;
- icon-library preference (saved as metadata for a future icon adapter).

Click **Save theme**. Studio updates `super-system.json` and regenerates `.super-system/theme.css` automatically.

> [!NOTE]
> The icon-library setting in Studio selects your preferred package. Run `npx @super-system/cli icons setup` for install commands and usage examples. Default recommendation: `lucide-react`.
