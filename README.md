# Get Started

In VS Code, in the upper searchbar search for '>Tasks:Run Task' and select 'Start Theme Environment'

# Shopify Starter Theme (Vite + Tailwind + Modular JS)

Questo tema Shopify è progettato come **starter moderno OS 2.0**, con:

- integrazione GitHub semplice (no subtree)
- build system basato su Vite
- Tailwind CSS
- JavaScript modulare per file
- output diretto nella struttura Shopify (`assets/`)
- nessun manifest, nessun hashing (ci pensa già shopify), nessuna complessità inutile

---

## Struttura del progetto

```text
/
├── assets/  → final output (build + static assets)
├── blocks/
├── config/
├── layout/
├── locales/
├── sections/
├── snippets/
├── templates/
│
├── src/
│   ├── css/
│   │   └── main.css
│   │
│   └── js/
│       ├── global.d.ts (for vscode Salsa, js compiler)
│       ├── jsconfig.json (for vscode Salsa, js compiler)
│       ├── theme.js
│       ├── theme.js
│       ├── cart-drawer.js
│       ├── predictive-search.js
│       └── ...
│
├── vite.config.js
├── package.json
├── .gitignore
├── .gitattributes (to highlight comments on json files)
├── .theme-check.yml (sets shopify CLI theme check control rigidity)
└── .shopifyignore
```

## CSS

One entrypoint:

`src/css/main.css`

To import other files:

```
@import "tailwindcss" theme(static);

@import "./normalization.css";
@import "./components.css";
@import "./utilities.css";

```

and on build produces one file:

`assets/main.css`

## JavaScript (modulare per file)

Ogni file JS rappresenta un modulo indipendente.

Esempio struttura:

```

src/js/
├── theme.js
├── cart-drawer.js
├── predictive-search.js
└── ...
Output
assets/
├── theme.js
├── cart-drawer.js
├── predictive-search.js
└── ...

```

Ogni file è autonomo nessun bundle unico obbligatorio
ogni script viene incluso manualmente nel Liquid
uso consigliato di Web Components (customElements)
Esempio uso in Liquid
{{ 'cart-drawer.js' | asset_url | script_tag }}

### Naming convention consigliata

To avoid naming collisions:

| Prefx |
| ----- |

component- |  
section-name\*- , in the snippets es 'snippets/header-logo.liquid'  
utilities-

# Assets

La cartella assets contiene 1 file css e file js generati da Vite dalla cartella `/src`, _non toccare_.
Inoltre contiene i file multimediali.
