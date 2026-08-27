export type StudioPanel = "theme" | "preview" | "checks";

const DESKTOP_QUERY = "(min-width: 900px)";
const STORAGE_KEY = "super-system-studio-panel";

function readStoredPanel(): StudioPanel {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored === "theme" || stored === "preview" || stored === "checks") return stored;
  return "theme";
}

function writeStoredPanel(panel: StudioPanel): void {
  sessionStorage.setItem(STORAGE_KEY, panel);
}

export function initStudioShell(): void {
  const main = document.querySelector<HTMLElement>(".studio-main");
  const nav = document.querySelector<HTMLElement>(".studio-mobile-nav");
  if (!main || !nav) return;

  const tabs = nav.querySelectorAll<HTMLButtonElement>("[data-studio-tab]");
  const panels = main.querySelectorAll<HTMLElement>("[data-studio-panel]");

  function setPanel(panel: StudioPanel, persist = true): void {
    if (!main) return;
    main.dataset.activePanel = panel;
    if (persist) writeStoredPanel(panel);

    tabs.forEach((tab) => {
      const active = tab.dataset.studioTab === panel;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    panels.forEach((section) => {
      const visible = section.dataset.studioPanel === panel;
      section.hidden = !visible;
      section.setAttribute("aria-hidden", String(!visible));
    });

    if (panel === "preview") {
      window.dispatchEvent(new CustomEvent("studio:preview-visible"));
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = tab.dataset.studioTab as StudioPanel | undefined;
      if (panel) setPanel(panel);
    });
  });

  const media = window.matchMedia(DESKTOP_QUERY);

  function applyLayout(isDesktop: boolean): void {
    if (!main || !nav) return;
    main.classList.toggle("studio-main--desktop", isDesktop);
    nav.hidden = isDesktop;

    if (isDesktop) {
      main.removeAttribute("data-active-panel");
      panels.forEach((section) => {
        section.hidden = false;
        section.removeAttribute("aria-hidden");
      });
      tabs.forEach((tab) => tab.setAttribute("aria-selected", "false"));
      return;
    }

    setPanel(readStoredPanel(), false);
  }

  applyLayout(media.matches);
  media.addEventListener("change", (event) => applyLayout(event.matches));
}
