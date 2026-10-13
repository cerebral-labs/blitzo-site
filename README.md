# blitzo-site

The page served at [blitzo.xyz](https://blitzo.xyz), hosted on GitHub Pages
from the `main` branch of this repository. The files are served as they are
(`.nojekyll`); `index.html` is the home page. A push to `main` is live within
a minute or two.

## DNS

The domain is registered at Namecheap. These records point it here:

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
