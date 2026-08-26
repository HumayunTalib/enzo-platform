# Company profile — source

`assets/enzo-company-profile.pdf` is generated from these two fragments.

    npm install --no-save puppeteer
    node tools/build-profile.js            # assembles + renders to assets/

`profile.head.html` holds the design system, `profile.body.html` the content.
The ENZO logo is embedded as a data URI at build time from
`assets/logo/enzo-logo.png`, so the PDF has no external image dependency.
Typography is Cormorant Garamond + Inter, fetched from Google Fonts at render
time — the same faces the site uses.

Every fact in the profile is confirmed. Nothing is inferred. See the omissions
list in `docs/DATA-NEEDED.md` before adding a section.
