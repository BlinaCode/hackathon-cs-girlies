# Golden Rules - Core Engineering Principles

These rules are NON-NEGOTIABLE.

They protect the integrity of the Aura Chocolaterie frontend architecture and enforce high standards for accessibility, design fidelity, and clean, modular vanilla web development.

If any rule is violated: STOP implementation and fix the issue before proceeding.

---

# 1) Vanilla Stack Rule (No Heavy Frameworks)

The application MUST use Vanilla HTML, CSS, and JavaScript.

Why this exists:
- Keeps the frontend lightweight and fast.
- Ensures deep understanding of native web APIs.
- Prevents dependency bloat and complex build steps for a project that doesn't require them.

Mandatory:
- Write raw HTML5, CSS3, and ES6+ JavaScript.
- Use native DOM methods (`querySelector`, `addEventListener`).

Forbidden:
- Introducing React, Vue, Angular, or Svelte.
- Introducing utility-first CSS frameworks like Tailwind (unless explicitly authorized to change architecture).
- Introducing jQuery.

Do this instead:
- Embrace CSS Variables (`:root`) and CSS Grid/Flexbox for styling.
- Use modular JS files to handle logic.

---

# 2) Separation of Concerns Rule

Structure, Presentation, and Logic MUST remain strictly separated.

Why this exists:
- Prevents spaghetti code where styles, structure, and behavior are tangled.
- Makes debugging UI issues straightforward.
- Ensures HTML remains readable and semantic.

Mandatory:
- HTML defines the content and semantic structure.
- CSS handles all visual styling and animations.
- JS handles interactivity and state management.

Forbidden:
- Inline styles (`<div style="color: red;">`).
- Inline event handlers (`<button onclick="doSomething()">`).
- Complex CSS logic written inside JavaScript (except for dynamic layout calculations).

Do this instead:
- Use JS to toggle CSS classes (e.g., `element.classList.add('is-active')`) rather than applying direct styles.

---

# 3) Mobile-First and Responsive Rule

All designs MUST be implemented mobile-first.

Why this exists:
- The majority of users browse e-commerce sites on mobile devices.
- Mobile-first CSS is easier to write and maintain; scaling up is simpler than scaling down.

Mandatory:
- Base CSS rules apply to the smallest screens.
- Use `min-width` media queries to add layout complexity for larger screens.
- Use fluid units (`clamp()`, `vw`, `vh`, `%`, `rem`) for typography and spacing.

Forbidden:
- Desktop-only designs that break on mobile.
- Fixed pixel widths that cause horizontal scrolling on small screens.

Do this instead:
- Use CSS Grid and Flexbox with `flex-wrap: wrap` to allow content to flow naturally based on screen size.

---

# 4) Accessibility (a11y) Rule

The application MUST be accessible to all users, including those using screen readers or keyboard navigation.

Why this exists:
- It is a fundamental web standard and ethical requirement.
- Good accessibility improves overall SEO and user experience.

Mandatory:
- Use semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<article>`, `<button>`).
- Interactive elements MUST have visible focus states (`:focus-visible`).
- Images MUST have descriptive `alt` attributes.
- Include `.sr-only` utility classes for screen-reader text.
- Provide a `skip-link` for keyboard users to bypass navigation.

Forbidden:
- Using `<div>` or `<span>` for buttons or links without `role` and `tabindex` attributes.
- Removing focus outlines without providing a visible alternative (e.g., `outline: none` without a fallback).

Do this instead:
- Use `<button>` for actions and `<a>` for navigation.
- Test the site using only the Tab key.

---

# 5) State Management and Persistence Rule

Client-side state (like the shopping cart) MUST be persisted and synchronized accurately.

Why this exists:
- Users expect their cart items to remain if they refresh the page or navigate away.
- Desynchronized UI and state lead to confusing user experiences and lost sales.

Mandatory:
- Use `localStorage` to save critical state across sessions.
- Isolate state mutation logic from DOM update logic.
- Ensure the UI immediately reflects the underlying state after any change.

Forbidden:
- Relying solely on the DOM to store state (e.g., reading data attributes to calculate totals, rather than having a JavaScript state object).
- Failing silently if `localStorage` quota is exceeded.

Do this instead:
- Create a central state object or array in JS, update it, save to `localStorage`, and then trigger a UI render function.

---

# 6) Performance and Asset Rule

Assets MUST be optimized to prevent slow load times.

Why this exists:
- E-commerce conversion rates drop significantly with every second of load delay.
- Heavy assets cause layout shifts and poor First Contentful Paint metrics.

Mandatory:
- Compress images and use modern formats (like WebP).
- Size images appropriately for their container.
- Use CSS transitions/animations (`transform`, `opacity`) over JavaScript-driven animations.

Forbidden:
- Loading massive 4K images for small product thumbnails.
- Triggering layout thrashing by constantly reading and writing to the DOM in JS loops.

Do this instead:
- Use CSS `aspect-ratio` to reserve space for images before they load, preventing Cumulative Layout Shift (CLS).

---

# 7) Design Consistency and Brand Identity Rule

The UI MUST maintain the established elegant, premium aesthetic of the Aura brand.

Why this exists:
- The brand sells high-end fine aroma chocolate; the digital experience must reflect that quality.
- Inconsistent colors or fonts break user trust and cheapen the brand.

Mandatory:
- Stick strictly to defined CSS Custom Properties for colors (`--color-bg`, `--color-text`, `--color-accent`, etc.).
- Use the defined typography stack (`Playfair Display` for headings, `Manrope`/`Inter` for body).
- Ensure hover states and transitions are smooth and subtle (e.g., `transition: all 0.3s ease`).

Forbidden:
- Introducing generic colors (plain `#F00`, `#00F`) outside the palette.
- Using default browser fonts or harsh, unstyled form inputs.

Do this instead:
- Reference the CSS `:root` variables for every color and font assignment.
- Pay attention to whitespace, padding, and alignment to create a breathable, elegant layout.

---

# Final Principle

Prefer simplicity and semantic correctness over clever hacks. Write code that you and others can easily read and maintain. Every change MUST improve the user experience, accessibility, or visual fidelity of the application. If it does not, it MUST be revised.
