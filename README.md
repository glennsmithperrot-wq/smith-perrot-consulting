# Smith-Perrot Consulting Website

Static website for **Smith-Perrot Consulting**.

## Framework / stack

This site uses **plain HTML, CSS, and JavaScript**.

It does **not** use React, Next.js, Vite, Tailwind, or another front-end framework.

## Project files

```text
index.html        Homepage
blog.html         Insights / writing page
style.css         Site styles
script.js         Mobile navigation, animations, form behavior, and small interactions
assets/           Images and logo files
vercel.json       Minimal Vercel configuration
scripts/          Optional local validation script
```

This project does not include `src`, `app`, `pages`, `components`, `styles`, Vite config, Next config, Tailwind config, PostCSS config, TypeScript config, or JavaScript config files because the website does not use those frameworks or build tools.

## Environment variables

No environment variables are required.

The contact form submits directly to Formspree using the public form endpoint already included in `index.html`.

Because no secrets are required, this project does not include a `.env.example` file.

## Install dependencies

There are no required dependencies to install.

No `npm install` step is required because this is a plain static website.

## Run locally

From the project folder, run:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

You can also open `index.html` directly in a browser, but the local server preview is better because it behaves more like a deployed website.

## Build / validate for production

There is no compilation build step.

To validate local files before deployment, run:

```bash
python3 scripts/check_site.py
```

The script checks that required files exist and that local links, image paths, scripts, stylesheets, and internal anchors are valid.

## Deploy to Vercel

1. Create a new GitHub repository.
2. Upload the **contents of this project folder** to the repository root.
3. Go to [Vercel](https://vercel.com/).
4. Choose **Add New Project**.
5. Import the GitHub repository.
6. For framework, choose **Other** if Vercel asks.
7. Use these settings:
   - Install Command: leave blank / default
   - Build Command: leave blank
   - Output Directory: leave blank / project root
8. Click **Deploy**.

After deployment, test:

- Homepage loads
- Blog page loads
- Navigation links scroll correctly
- Calendar button opens the Google Calendar booking link
- CASE recognition link opens externally
- Contact form submits to Formspree
- Images and logo appear correctly
- Mobile navigation works

## Deploy to GitHub Pages instead

If deploying to GitHub Pages, upload these files to the root of your GitHub repository:

```text
index.html
blog.html
style.css
script.js
assets/
```

Then enable GitHub Pages from the repository settings.

## Privacy / secrets

This project does not include private API keys, passwords, tokens, or hidden secrets.
