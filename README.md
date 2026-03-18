# The Jevons Paradox in AI

An empirical, data-driven investigation into whether AI hardware efficiency gains are offset by explosive demand growth. All three hypotheses confirmed.

---

## What this is

An interactive, single-page web report that investigates the **Jevons Paradox** in artificial intelligence — the phenomenon where efficiency improvements in AI hardware (GPUs/TPUs) have paradoxically led to *greater* total energy consumption, not less.

The investigation is structured around three testable hypotheses:

| Hypothesis | Claim | Result |
|---|---|---|
| H1 · Hardware Efficiency | Energy cost per FLOP has fallen significantly | R²=0.549 · p<10⁻¹² |
| H2 · Demand Explosion | Post-2020 training compute has grown 50M× | Mann-Whitney p=4.35×10⁻¹⁹ |
| H3 · Absolute Emissions | CO₂ emissions from AI are rising, not falling | 847× CO₂e growth in one year |

**Key finding:** Demand doubles every 0.96 years. Efficiency doubles every 3.6 years. Demand outpaces efficiency by **3.75×** — making total energy growth mathematically inevitable.

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

## Data sources

- `ml_hardware` — Machine learning accelerator efficiency dataset (FLOP/W, 2017–2025)
- `frontier_ai_models` — Training compute records for frontier AI models
- `data_center_timelines` — Power draw for 23 frontier AI training clusters
- `all_ai_models` — 3,237 tracked model deployments with power draw estimates
- Strubell et al. (2019). *Energy and Policy Considerations for Deep Learning in NLP.* ACL 2019. arXiv:1906.02243
- Schwartz et al. (2020). *Carbon Emissions and Large Neural Network Training.* arXiv:2104.10350
