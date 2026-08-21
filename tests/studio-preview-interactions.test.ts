/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { initPreviewInteractions } from "../packages/studio-ui/src/preview-interactions.js";

function mountPreviewFixture(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <div class="ss-tabs preview-tabs-demo">
      <div role="tablist" class="ss-tabs__list">
        <button type="button" role="tab" data-tab-value="profile" aria-selected="true" class="ss-tabs__trigger ss-tabs__trigger--active">Profile</button>
        <button type="button" role="tab" data-tab-value="billing" aria-selected="false" tabindex="-1" class="ss-tabs__trigger">Billing</button>
      </div>
      <div role="tabpanel" data-tab-panel="profile" class="ss-tabs__content">Profile panel</div>
      <div role="tabpanel" data-tab-panel="billing" class="ss-tabs__content" hidden>Billing panel</div>
    </div>

    <div class="ss-accordion preview-accordion-demo">
      <div class="ss-accordion__item" data-accordion-item="account">
        <button type="button" class="ss-accordion__trigger" aria-expanded="true">Account</button>
        <div role="region" data-accordion-panel="account" class="ss-accordion__content">Account panel</div>
      </div>
      <div class="ss-accordion__item" data-accordion-item="notifications">
        <button type="button" class="ss-accordion__trigger" aria-expanded="false">Notifications</button>
        <div role="region" data-accordion-panel="notifications" class="ss-accordion__content" hidden>Notifications panel</div>
      </div>
    </div>

    <div class="ss-dropdown ss-dropdown--demo preview-dropdown-demo">
      <button type="button" aria-expanded="false">Actions</button>
      <div role="menu" hidden>
        <button type="button" role="menuitem">Edit</button>
      </div>
    </div>

    <span class="ss-tooltip ss-tooltip--demo preview-tooltip-demo">
      <button type="button">Help</button>
      <span role="tooltip" id="tip-fixture" hidden>Tooltip text</span>
    </span>

    <span class="ss-popover ss-popover--demo preview-popover-demo">
      <button type="button" aria-expanded="false">Details</button>
      <div role="dialog" hidden>Popover text</div>
    </span>

    <div class="preview-toast-stack">
      <div class="ss-toast"><button type="button" class="ss-toast__close">×</button></div>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

describe("preview interactions", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = mountPreviewFixture();
    initPreviewInteractions();
  });

  afterEach(() => {
    root.remove();
  });

  it("switches tabs when a trigger is clicked", () => {
    const billingTrigger = root.querySelector<HTMLButtonElement>('[data-tab-value="billing"]')!;
    billingTrigger.click();

    expect(billingTrigger.classList.contains("ss-tabs__trigger--active")).toBe(true);
    expect((root.querySelector('[data-tab-panel="billing"]') as HTMLElement).hidden).toBe(false);
    expect((root.querySelector('[data-tab-panel="profile"]') as HTMLElement).hidden).toBe(true);
  });

  it("toggles accordion sections", () => {
    const notificationsTrigger = root.querySelector<HTMLButtonElement>(
      '[data-accordion-item="notifications"] .ss-accordion__trigger'
    )!;
    notificationsTrigger.click();

    expect(notificationsTrigger.getAttribute("aria-expanded")).toBe("true");
    expect((root.querySelector('[data-accordion-panel="notifications"]') as HTMLElement).hidden).toBe(false);
    expect((root.querySelector('[data-accordion-panel="account"]') as HTMLElement).hidden).toBe(true);
  });

  it("opens and closes the dropdown menu", () => {
    const dropdown = root.querySelector<HTMLElement>(".preview-dropdown-demo")!;
    const trigger = dropdown.querySelector<HTMLButtonElement>("button")!;
    const menu = dropdown.querySelector<HTMLElement>('[role="menu"]')!;

    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(menu.hidden).toBe(false);

    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(menu.hidden).toBe(true);
  });

  it("shows tooltip content on focus", () => {
    const tooltip = root.querySelector<HTMLElement>(".preview-tooltip-demo")!;
    const trigger = tooltip.querySelector<HTMLButtonElement>("button")!;
    const content = tooltip.querySelector<HTMLElement>('[role="tooltip"]')!;

    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    expect(content.hidden).toBe(false);
    expect(trigger.getAttribute("aria-describedby")).toBe("tip-fixture");
  });

  it("dismisses preview toasts", () => {
    const toast = root.querySelector<HTMLElement>(".ss-toast")!;
    root.querySelector<HTMLButtonElement>(".ss-toast__close")!.click();
    expect(toast.hidden).toBe(true);
  });
});
