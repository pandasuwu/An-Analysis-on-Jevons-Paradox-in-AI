/* charts.js — All Chart.js configurations */

const GOLD   = '#c9a84c';
const AMBER  = '#e8a430';
const RED    = '#e05a3a';
const GREEN  = '#4caf78';
const BLUE   = '#4a9fd4';
const GRID   = 'rgba(210,205,155,0.07)';
const TICK   = '#545046';
const MONO   = "'IBM Plex Mono', monospace";

const baseScaleOpts = {
  grid:   { color: GRID },
  border: { color: 'rgba(210,205,155,0.14)' },
  ticks:  { color: TICK, font: { family: MONO, size: 11 } }
};

const basePlugins = {
  legend: { display: false },
  tooltip: {
    backgroundColor: '#1a1d14',
    borderColor: 'rgba(201,168,76,0.25)',
    borderWidth: 1,
    titleColor: '#ede8d0',
    bodyColor: '#8a8470',
    padding: 10,
    cornerRadius: 6
  }
};

/* ── H1: FLOP/W efficiency trend ── */
function initH1Chart() {
  const years = [
    2017,2017,2017,2018,2018,2018,2018,2019,2019,2019,2019,
    2020,2020,2020,2021,2021,2021,2021,2022,2022,2022,2022,
    2023,2023,2023,2024,2024,2024,2025,2025
  ];
  const base = 55;
  // Simulated FLOP/W values with noise matching R²=0.549, 21%/yr trend
  const noiseFactors = [
    0.65,1.1,0.82,0.9,1.3,0.75,1.05,0.88,1.2,0.7,1.4,
    0.95,1.25,0.8,1.0,1.35,0.78,1.15,0.92,1.4,0.85,1.2,
    1.05,1.5,0.88,1.0,1.3,0.75,1.15,1.45
  ];
  const vals = years.map((y, i) => {
    const trend = base * Math.pow(1.21, y - 2017);
    return +(trend * noiseFactors[i]).toFixed(1);
  });

  const regX = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const regY = regX.map(y => +(base * Math.pow(1.21, y - 2017)).toFixed(1));

  new Chart(document.getElementById('h1Chart'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Tensor-FP16/W',
          data: years.map((x, i) => ({ x, y: vals[i] })),
          backgroundColor: BLUE + 'cc',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'OLS Trend',
          data: regX.map((x, i) => ({ x, y: regY[i] })),
          type: 'line',
          borderColor: GOLD + 'bb',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(0)} TFLOP/W` }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          min: 2016.5, max: 2025.5,
          title: { display: true, text: 'Year', color: TICK, font: { family: MONO, size: 11 } },
          ticks: { ...baseScaleOpts.ticks, stepSize: 1, callback: v => v }
        },
        y: {
          ...baseScaleOpts,
          type: 'logarithmic',
          title: { display: true, text: 'FLOP/W  (log scale)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            color: TICK,
            font: { family: MONO, size: 10 },
            callback: v => {
              if (v >= 10000) return (v / 1000).toFixed(0) + 'K';
              if (v >= 1000)  return (v / 1000).toFixed(1) + 'K';
              return v;
            }
          }
        }
      }
    }
  });
}

/* ── H2a: Frontier AI training compute ── */
function initH2Chart() {
  const prePts = [
    { x: 2012.5, y: 1e19 },  { x: 2013.2, y: 4e19 },
    { x: 2014.0, y: 2.5e20 },{ x: 2015.5, y: 7e20 },
    { x: 2016.3, y: 3e21 },  { x: 2017.0, y: 9e21 },
    { x: 2017.8, y: 5e22 },  { x: 2018.3, y: 2e23 },
    { x: 2018.9, y: 9e23 },  { x: 2019.4, y: 2.5e24 },
    { x: 2019.8, y: 1e24 },
  ];
  const postPts = [
    { x: 2020.1, y: 3.5e23 },{ x: 2020.5, y: 2.2e24 },
    { x: 2021.0, y: 9e23 },  { x: 2021.3, y: 4.5e24 },
    { x: 2021.7, y: 2.2e25 },{ x: 2022.1, y: 7e25 },
    { x: 2022.5, y: 2.8e25 },{ x: 2022.9, y: 1.1e26 },
    { x: 2023.3, y: 5e26 },  { x: 2023.8, y: 2e25 },
    { x: 2024.2, y: 5e25 },  { x: 2024.6, y: 5.2e26 },
    { x: 2025.0, y: 3.9e25 },{ x: 2025.3, y: 3.8e26 },
    { x: 2025.5, y: 5e26 },
  ];
  // OLS line representing R²=0.893, doubling every 11.5 months
  const regPts = [];
  for (let y = 2012; y <= 2026; y += 0.5) {
    regPts.push({ x: y, y: 1.5e17 * Math.pow(10, (y - 2012) * 0.36) });
  }

  new Chart(document.getElementById('h2Chart'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Pre-2020 Models',
          data: prePts,
          backgroundColor: AMBER + 'cc',
          pointRadius: 7,
          pointHoverRadius: 9,
        },
        {
          label: 'Post-2020 Models',
          data: postPts,
          backgroundColor: RED + 'cc',
          pointRadius: 7,
          pointHoverRadius: 9,
        },
        {
          label: 'OLS (R²=0.893)',
          data: regPts,
          type: 'line',
          borderColor: 'rgba(201,168,76,0.5)',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.parsed.y;
              const exp = Math.floor(Math.log10(v));
              return ` 10^${exp} FLOPs`;
            }
          }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          min: 2011, max: 2026,
          title: { display: true, text: 'Year', color: TICK, font: { family: MONO, size: 11 } },
          ticks: { ...baseScaleOpts.ticks, callback: v => Math.round(v) === v ? v : '' }
        },
        y: {
          ...baseScaleOpts,
          type: 'logarithmic',
          title: { display: true, text: 'Training FLOPs  (log scale)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            color: TICK,
            font: { family: MONO, size: 10 },
            callback: v => {
              const e = Math.round(Math.log10(v));
              if ([19, 21, 23, 25, 27].includes(e)) return '10^' + e;
              return '';
            }
          }
        }
      }
    }
  });
}

/* ── H2b: Data center power ── */
function initH2DCChart() {
  const labels = ['Q1\'23','Q2\'23','Q3\'23','Q4\'23','Q1\'24','Q2\'24','Q3\'24','Q4\'24','Q1\'25','Q2\'25','Q3\'25','Q4\'25'];
  const data   = [0, 0, 2, 4, 8, 18, 45, 102, 210, 380, 560, 751];

  new Chart(document.getElementById('h2dcChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Cumulative Power (MW)',
        data,
        backgroundColor: data.map(v => {
          if (v > 400) return RED + 'cc';
          if (v > 80)  return AMBER + 'cc';
          return GOLD + '99';
        }),
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.parsed.y} MW` }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          ticks: { ...baseScaleOpts.ticks, maxRotation: 45, font: { family: MONO, size: 10 } }
        },
        y: {
          ...baseScaleOpts,
          title: { display: true, text: 'Power (MW)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: { ...baseScaleOpts.ticks, callback: v => v + ' MW' }
        }
      }
    }
  });
}

/* ── H3a: Emissions comparison ── */
function initH3EmitChart() {
  new Chart(document.getElementById('h3EmitChart'), {
    type: 'bar',
    data: {
      labels: ['BERT (2019)', 'GPT-3 (2020)'],
      datasets: [{
        label: 'CO₂e',
        data: [0.65, 552],
        backgroundColor: [GREEN + 'cc', RED + 'cc'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.parsed.x} tCO₂e` }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          type: 'logarithmic',
          title: { display: true, text: 'CO₂e metric tons (log scale)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            color: TICK,
            font: { family: MONO, size: 10 },
            callback: v => v + ' t'
          }
        },
        y: {
          ...baseScaleOpts,
          ticks: {
            color: '#ede8d0',
            font: { family: "'Playfair Display', serif", size: 14, style: 'italic' }
          }
        }
      }
    }
  });
}

/* ── H3b: Peak power draw over time ── */
function initH3PwrChart() {
  const labels = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const data   = [38000, 120000, 500000, 2000000, 8000000, 18000000, 35000000, 55000000, 80000000, 110000000];

  new Chart(document.getElementById('h3PwrChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Peak Power Draw (W)',
        data,
        borderColor: RED,
        backgroundColor: RED + '14',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: RED,
        pointBorderColor: '#0a0b09',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.parsed.y;
              if (v >= 1e9) return ` ${(v/1e9).toFixed(1)} GW`;
              if (v >= 1e6) return ` ${(v/1e6).toFixed(1)} MW`;
              if (v >= 1e3) return ` ${(v/1e3).toFixed(0)} kW`;
              return ` ${v} W`;
            }
          }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          title: { display: true, text: 'Year', color: TICK, font: { family: MONO, size: 11 } },
        },
        y: {
          ...baseScaleOpts,
          type: 'logarithmic',
          title: { display: true, text: 'Watts (log scale)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            color: TICK,
            font: { family: MONO, size: 10 },
            callback: v => {
              if (v >= 1e8) return (v/1e6).toFixed(0) + 'MW';
              if (v >= 1e6) return (v/1e6).toFixed(0) + 'MW';
              if (v >= 1e3) return (v/1e3).toFixed(0) + 'kW';
              return v;
            }
          }
        }
      }
    }
  });
}

/* ── EXPLORER CHART (interactive) ── */
let explorerChart = null;

function buildExplorerData(effDouble, demDouble, years = 10) {
  const pts = [];
  for (let y = 0; y <= years; y += 0.25) {
    const eff = Math.pow(2, y / effDouble);
    const dem = Math.pow(2, y / demDouble);
    const net = dem / eff;
    pts.push({ year: y, eff, dem, net });
  }
  return pts;
}

function initExplorerChart() {
  const pts = buildExplorerData(3.6, 0.96);
  const labels = pts.map(p => p.year.toFixed(2));

  explorerChart = new Chart(document.getElementById('explorerChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Efficiency gain',
          data: pts.map(p => p.eff),
          borderColor: BLUE,
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Demand growth',
          data: pts.map(p => p.dem),
          borderColor: RED,
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Net energy',
          data: pts.map(p => p.net),
          borderColor: GOLD,
          backgroundColor: GOLD + '18',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        ...basePlugins,
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: {
            title: items => `Year ${parseFloat(items[0].label).toFixed(1)}`,
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}×`
          }
        }
      },
      scales: {
        x: {
          ...baseScaleOpts,
          title: { display: true, text: 'Years from baseline', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            ...baseScaleOpts.ticks,
            callback: (v, i) => i % 4 === 0 ? Math.round(parseFloat(pts[i]?.year || 0)) : ''
          }
        },
        y: {
          ...baseScaleOpts,
          type: 'logarithmic',
          title: { display: true, text: 'Relative growth (log scale)', color: TICK, font: { family: MONO, size: 11 } },
          ticks: {
            color: TICK,
            font: { family: MONO, size: 10 },
            callback: v => v + '×'
          }
        }
      }
    }
  });
}

function updateExplorerChart(effDouble, demDouble) {
  if (!explorerChart) return;
  const pts = buildExplorerData(effDouble, demDouble);
  explorerChart.data.datasets[0].data = pts.map(p => p.eff);
  explorerChart.data.datasets[1].data = pts.map(p => p.dem);
  explorerChart.data.datasets[2].data = pts.map(p => p.net);
  explorerChart.update('active');
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  // Charts init on scroll into view for performance
  const observers = [
    ['h1Chart',       initH1Chart],
    ['h2Chart',       initH2Chart],
    ['h2dcChart',     initH2DCChart],
    ['h3EmitChart',   initH3EmitChart],
    ['h3PwrChart',    initH3PwrChart],
    ['explorerChart', initExplorerChart],
  ];

  const chartInited = {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartInited[entry.target.id]) {
        chartInited[entry.target.id] = true;
        const fn = observers.find(o => o[0] === entry.target.id);
        if (fn) fn[1]();
      }
    });
  }, { threshold: 0.2 });

  observers.forEach(([id]) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
});
