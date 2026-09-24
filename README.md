# Ellis Fitness Center schedule

A static webpage using the real values inspected in A1:H14 on September 24, 2026. Colors: #00583d, #ffffff, #606060. School-block headings are large, bold and green; training labels are bold green, and larger supporting details are regular-weight gray with dash lists. No build tools, server application, API key, or changes to the coach's sheet are required.

## Preview and GitHub Pages

Open index.html for a preview, or serve this folder with a static web server. Upload the contents of this folder to a GitHub repository, then enable GitHub Pages for that branch and folder. Keep index.html, styles.css, config.js, snapshot.js and schedule.js together. The site uses relative asset paths so repository subpaths work. This deliverable has not been published to GitHub.

## Data and refresh

The page reads the specified tab and range through Google's public Visualization endpoint on every load and every five minutes. The source was accessible without sign-in during verification. The coach continues editing the same sheet. Its formulas, row order and school-day selection remain authoritative; the webpage does not calculate substitute dates. Blank column A and helper column D are omitted from the display. Team abbreviations and original times are preserved. Empty team cells display an em dash, without implying the room is closed.

The included saved snapshot appears immediately and is explicitly labeled until a live response arrives. If Google is unavailable, it stays labeled as a saved preview, or the page retains the last successful response and displays its check time. The “Schedule updated” time records the latest successful webpage refresh, not the coach’s last edit. A successful refresh means the values were fetched; it does not prove Google's formulas recalculated. If date rollover lags, check the spreadsheet's timezone and recalculation settings with the owner. No settings were changed.

## Carousel Cloud

Use the published, publicly reachable GitHub Pages URL as a Web / Website Snapshot bulletin. Start with a 1920 × 1080 landscape zone and a Snapshot Delay of 10 seconds; test the actual Carousel preview and increase the delay if necessary. The page has no required clicks, animations, external fonts or login prompts. It also adapts to narrower screens.

Carousel documents automatic snapshot refresh every 15 minutes. The page's five-minute polling does not make a captured image update faster. End-to-end behavior must be verified in your Carousel account after deployment; that account was not accessed.

Reference: https://support.carouselsignage.com/hc/en-us/articles/360050597592-Web-and-Interactive-Bulletins-in-Carousel-Cloud
Google data-source reference: https://developers.google.com/chart/interactive/docs/spreadsheets

## Add logos later

Place a supplied logo in assets/, then set logoUrl in config.js to its relative path, such as assets/westminster-logo.png. The header automatically shows it. No placeholder logo is presented as an official school mark. The timezone and refresh interval are also in config.js.

## Content growth

The current three-day schedule is designed for a widescreen screen. Substantially longer future entries may require smaller typography or layout adjustments; content is never silently truncated. Check the Carousel preview after major changes to schedule density.
