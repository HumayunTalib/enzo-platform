# Shared page chrome

`header.html`, `mobile-nav.html` and `footer.html` are the single source for
the site chrome. `node build.js` writes them into every page between the
`<!--#name-->` / `<!--/#name-->` markers.

    node build.js        # or: npm run build

**Edit the partial, not the pages.** A build overwrites whatever sits between
the markers on all 63 content pages.

Two tokens are substituted per page:

- `{{BASE}}` — empty at the root, `../` for `journal/`, so relative links
  resolve from either depth. External, `mailto:` and `#` links are untouched.
- `{{HEADER_CLASS}}` — the page keeps the class it already had. `over-hero`
  on the three pages with a dark full-bleed hero (index, about, wholesale),
  `is-static` everywhere else. Nothing to configure.

The four `product-*.html` redirect stubs carry no chrome and are skipped.

Extraction was verified byte-for-byte: the first sync rewrote 0 pages, and
stripping the markers reproduces the pre-refactor files exactly.
