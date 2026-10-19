# blitzo-site

The site served at [blitzo.xyz](https://blitzo.xyz): a UmiJS (React) app,
hosted on GitHub Pages. A push to `main` runs `.github/workflows/pages.yml`,
which builds it (`pnpm build` → `dist/`) and deploys it; it is live a couple
of minutes later. If the build fails, the previous version stays up.

`exportStatic` in `.umirc.ts` writes an `index.html` for every route
(`/`, `/privacy/`, `/terms/`, ...), since Pages has no single-page-app
fallback. Files in `public/` are copied as they are: they keep the old
`/terms-of-service/`, `/privacy.html` and `/terms.html` links working.

```
pnpm install
pnpm dev      # local dev server
pnpm build    # production build into dist/
```

[UMI](https://umijs.org/en-US/docs/guides/getting-started) ·
[Redux](https://redux.js.org/) ·
[Material UI](https://mui.com/material-ui/) ·
[Motion](https://motion.dev/docs/react-animate-presence) ·
[UnoCSS](https://unocss.dev/guide/getting-started) ·
[Icons](https://mui.com/material-ui/material-icons/) ·
[Figma](https://www.figma.com/design/LKGIAujThga4mR2Oe4kRdj/MADDER?node-id=0-1&p=f&t=Sz0FtOI5Cwyu6dib-0)

## Domain

The custom domain (blitzo.xyz) is set in the repository's Pages settings,
with "Enforce HTTPS" on. The domain is registered at Namecheap. These records
point it here:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `cerebral-labs.github.io.` |

Keep no wildcard (`*`) record pointing at GitHub: anyone could then claim a
subdomain of blitzo.xyz from their own repository. The domain's mail (Google)
and its Google verification records are separate and stay as they are.
