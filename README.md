# The Jevons Paradox in AI — Interactive Data Report

An empirical, data-driven investigation into whether AI hardware efficiency gains are offset by explosive demand growth. All three hypotheses confirmed.

**Live demo:** Deploy via GitHub Pages (see instructions below)

---

## What this is

An interactive, single-page web report that investigates the **Jevons Paradox** in artificial intelligence — the phenomenon where efficiency improvements in AI hardware (GPUs/TPUs) have paradoxically led to *greater* total energy consumption, not less.

The investigation is structured around three testable hypotheses:

| Hypothesis | Claim | Result |
|---|---|---|
| H1 · Hardware Efficiency | Energy cost per FLOP has fallen significantly | ✓ Confirmed · R²=0.549 · p<10⁻¹² |
| H2 · Demand Explosion | Post-2020 training compute has grown 50M× | ✓ Confirmed · Mann-Whitney p=4.35×10⁻¹⁹ |
| H3 · Absolute Emissions | CO₂ emissions from AI are rising, not falling | ✓ Confirmed · 847× CO₂e growth in one year |

**Key finding:** Demand doubles every 0.96 years. Efficiency doubles every 3.6 years. Demand outpaces efficiency by **3.75×** — making total energy growth mathematically inevitable.

---

## Features

- Scroll-driven reveal animations
- 5 interactive Chart.js visualizations (scatter, bar, line — all log-scale)
- Interactive "Paradox Explorer" — adjust efficiency/demand doubling times to see net energy outcome
- Animated count-up statistics
- Reading progress bar
- Fully responsive (mobile, tablet, desktop)
- Zero build step — pure HTML/CSS/JS

---

## File structure

```
jevons-paradox-ai/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── charts.js       # Chart.js chart configurations
│   └── main.js         # Scroll effects, counters, interactions
└── README.md
```

---

## Deploying to GitHub Pages

1. **Create a new GitHub repository** (e.g. `jevons-paradox-ai`)

2. **Upload all files** maintaining the directory structure:
   ```
   index.html
   css/style.css
   js/charts.js
   js/main.js
   README.md
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Under "Source", select `Deploy from a branch`
   - Branch: `main`, folder: `/ (root)`
   - Click Save

4. Your site will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
   (GitHub Pages usually takes 1–3 minutes to build)

---

## Data sources

- `ml_hardware` — Machine learning accelerator efficiency dataset (FLOP/W, 2017–2025)
- `frontier_ai_models` — Training compute records for frontier AI models
- `data_center_timelines` — Power draw for 23 frontier AI training clusters
- `all_ai_models` — 3,237 tracked model deployments with power draw estimates
- Strubell et al. (2019). *Energy and Policy Considerations for Deep Learning in NLP.* ACL 2019. arXiv:1906.02243
- Schwartz et al. (2020). *Carbon Emissions and Large Neural Network Training.* arXiv:2104.10350

---

## Technical notes

- External dependency: Chart.js 4.4.1 (loaded via Cloudflare CDN)
- Google Fonts: Playfair Display, IBM Plex Mono, Source Serif 4
- No build tools, no npm, no bundler required
- All chart data is embedded directly in `js/charts.js` based on the dataset analysis outputs
