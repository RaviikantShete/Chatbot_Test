// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const fs = require("fs");
const path = require("path");

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanTag(t) {
  const s = t.replace(/^@/, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const jsonPath = "reports/cucumber-report.json";
const outputPath = "reports/html/index.html";

if (!fs.existsSync(jsonPath)) { console.error("cucumber-report.json not found!"); process.exit(1); }

const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
let totalScenarios=0,passedScenarios=0,failedScenarios=0,totalSteps=0,passedSteps=0,failedSteps=0,totalDuration=0;

const features = raw.map((feature) => {
  let fPassed=0,fFailed=0,fDuration=0;
  const scenarios = (feature.elements||[]).map((scenario) => {
    const steps = (scenario.steps||[]).map((step) => {
      const status = step.result?.status||"skipped";
      const duration = step.result?.duration||0;
      totalDuration+=duration; fDuration+=duration; totalSteps++;
      if(status==="passed") passedSteps++;
      else if(status==="failed") failedSteps++;
      return {name:step.name,keyword:step.keyword,status,duration,error:step.result?.error_message||""};
    });
    const failed = steps.some(s=>s.status==="failed");
    totalScenarios++;
    if(failed){failedScenarios++;fFailed++;}else{passedScenarios++;fPassed++;}
    return {name:scenario.name,tags:(scenario.tags||[]).map(t=>t.name),steps,passed:!failed};
  });
  return {name:feature.name,scenarios,passed:fFailed===0,fPassed,fFailed,fDuration};
});

const duration=(totalDuration/1e9).toFixed(1);
const passRate=totalScenarios>0?Math.round((passedScenarios/totalScenarios)*100):0;
const date=new Date().toLocaleString();
const allTags=[...new Set(features.flatMap(f=>f.scenarios.flatMap(s=>s.tags)))].filter(Boolean);

const maxDuration = Math.max(...features.map(f=>f.fDuration));

const featureRows = features.map((f,i)=>`
<tr class="feature-row" data-feature="${i}" data-status="${f.passed?'passed':'failed'}" onclick="toggleScenarios(${i},event)">
  <td><span class="feature-toggle" id="ft-${i}">&#9654;</span> <span class="feature-name">${escapeHtml(f.name)}</span></td>
  <td><span class="badge ${f.passed?'badge-pass':'badge-fail'}">${f.passed?'PASSED':'FAILED'}</span></td>
  <td class="td-center">${f.fPassed+f.fFailed}</td>
  <td class="pass-count">${f.fPassed}</td>
  <td class="fail-count">${f.fFailed}</td>
  <td class="dur-col">${(f.fDuration/1e9).toFixed(1)}s</td>
  <td>
    <div class="mini-bar-wrap">
      <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${f.fPassed+f.fFailed>0?Math.round((f.fPassed/(f.fPassed+f.fFailed))*100):0}%"></div></div>
      <span class="mini-bar-pct ${f.passed?'pass-count':'fail-count'}">${f.fPassed+f.fFailed>0?Math.round((f.fPassed/(f.fPassed+f.fFailed))*100):0}%</span>
    </div>
  </td>
</tr>
<tr id="scenarios-${i}" class="scenarios-row hidden" data-feature="${i}">
  <td colspan="7">
    <div class="scenarios-container">
      ${f.scenarios.map((s,j)=>`
      <div class="scenario-card ${s.passed?'scenario-pass':'scenario-fail'}" data-tags="${s.tags.join(',')}" data-status="${s.passed?'passed':'failed'}">
        <div class="scenario-header" onclick="toggleSteps('steps-${i}-${j}',event)">
          <span class="scenario-icon">${s.passed?'&#10003;':'&#10007;'}</span>
          <span class="scenario-name">${escapeHtml(s.name)}</span>
          <div class="scenario-tags">${s.tags.map(t=>`<span class="tag">${cleanTag(t)}</span>`).join('')}</div>
          <span class="scenario-toggle">&#9660;</span>
        </div>
        <div id="steps-${i}-${j}" class="steps-list hidden">
          ${s.steps.map(st=>`
          <div class="step-item step-${st.status}">
            <span class="step-keyword">${escapeHtml(st.keyword.trim())}</span>
            <span class="step-name">${escapeHtml(st.name)}</span>
            <span class="step-dur">${(st.duration/1e9).toFixed(2)}s</span>
            <span class="step-status-icon">${st.status==='passed'?'&#10003;':st.status==='failed'?'&#10007;':'&#8722;'}</span>
            ${st.error?`<div class="step-error">${escapeHtml(st.error.substring(0,300))}</div>`:''}
          </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </td>
</tr>`).join('');

const tagPills = allTags.map(t=>`<span class="tag-pill" data-tag="${t}" onclick="filterByTag('${t}')">${cleanTag(t)}</span>`).join('');

const durationBars = features.map(f=>`
  <div class="bar-row">
    <span class="bar-label" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${maxDuration>0?Math.round((f.fDuration/maxDuration)*100):0}%"></div></div>
    <span class="bar-val">${(f.fDuration/1e9).toFixed(1)}s</span>
  </div>`).join('');

const donutPct = passRate;
const circumference = 2 * Math.PI * 38;
const dashArray = `${(donutPct/100*circumference).toFixed(2)} ${circumference.toFixed(2)}`;

const LOGO_B64 = "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";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Paywatch Chatbot — Test Report</title>
<style>
:root{
  --bg:#f0f4f8;--surface:#ffffff;--surface2:#f7fafc;
  --text:#2d3748;--text2:#718096;--text3:#a0aec0;
  --border:#e2e8f0;--shadow:0 2px 8px rgba(0,0,0,0.06);
  --row-hover:#ebf8ff;--thead:#1a202c;--thead-text:#ffffff;
  --pass-bg:#c6f6d5;--pass-text:#276749;
  --fail-bg:#fed7d7;--fail-text:#9b2c2c;
  --blue:#3182ce;--progress-bg:#e2e8f0;
  --tag-bg:#bee3f8;--tag-text:#2c5282;
  --bar-fill:#63b3ed;
}
[data-theme="dark"]{
  --bg:#0f1117;--surface:#1a1d27;--surface2:#22263a;
  --text:#e2e8f0;--text2:#a0aec0;--text3:#718096;
  --border:#2d3748;--shadow:0 2px 8px rgba(0,0,0,0.4);
  --row-hover:#1e2a3a;--thead:#0a0e1a;--thead-text:#a0aec0;
  --pass-bg:#1a3a2a;--pass-text:#68d391;
  --fail-bg:#3a1a1a;--fail-text:#fc8181;
  --blue:#63b3ed;--progress-bg:#2d3748;
  --tag-bg:#1a2a3a;--tag-text:#63b3ed;
  --bar-fill:#3182ce;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',sans-serif;background:var(--bg);color:var(--text);transition:background 0.3s,color 0.3s;}
.header{background:linear-gradient(135deg,#1a202c 0%,#2d3748 60%,#1a365d 100%);color:white;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;gap:20px;}
.header-left{display:flex;align-items:center;gap:14px;}
.header-logo img{height:42px;background:white;padding:5px 9px;border-radius:7px;}
.header-title h1{font-size:20px;font-weight:700;}
.header-right{display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
.header-right-top{display:flex;align-items:center;gap:10px;}
.author-info{text-align:right;font-size:12px;color:#a0aec0;}
.author-info strong{color:white;display:block;font-size:13px;}
.author-info a{color:#63b3ed;text-decoration:none;}
.dark-toggle{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;padding:6px 13px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.2s;}
.dark-toggle:hover{background:rgba(255,255,255,0.2);}

.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:22px 32px 0;}
.stat-card{background:var(--surface);border-radius:10px;padding:18px;box-shadow:var(--shadow);border-left:4px solid var(--border);}
.stat-card.green{border-left-color:#48bb78;}
.stat-card.red{border-left-color:#fc8181;}
.stat-card.blue{border-left-color:#63b3ed;}
.stat-card.purple{border-left-color:#9f7aea;}
.stat-label{font-size:10px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;}
.stat-value{font-size:34px;font-weight:800;margin:5px 0 3px;}
.stat-card.green .stat-value{color:#38a169;}
.stat-card.red .stat-value{color:#e53e3e;}
.stat-card.blue .stat-value{color:#3182ce;}
.stat-card.purple .stat-value{color:#805ad5;}
.stat-sub{font-size:11px;color:var(--text3);}

.progress-section{padding:16px 32px 8px;}
.progress-label{display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:600;color:var(--text2);}
.progress-bar-bg{background:var(--progress-bg);border-radius:999px;height:8px;overflow:hidden;}
.progress-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#48bb78,#38a169);}

.charts-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 32px 16px;}
.chart-card{background:var(--surface);border-radius:10px;padding:16px;box-shadow:var(--shadow);}
.chart-title{font-size:11px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
.bar-label{font-size:11px;color:var(--text2);width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;}
.bar-track{flex:1;height:7px;background:var(--progress-bg);border-radius:4px;overflow:hidden;}
.bar-fill{height:100%;border-radius:4px;background:var(--bar-fill);}
.bar-val{font-size:11px;color:var(--text3);width:34px;text-align:right;flex-shrink:0;}
.donut-wrap{display:flex;align-items:center;gap:20px;}
.donut-legend{display:flex;flex-direction:column;gap:7px;flex:1;}
.legend-item{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text);}
.legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.steps-breakdown{margin-top:14px;}
.steps-title{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;}
.steps-bar{display:flex;height:7px;border-radius:4px;overflow:hidden;gap:2px;}
.steps-bar-pass{background:#48bb78;}
.steps-bar-fail{background:#fc8181;}
.steps-bar-skip{background:#ecc94b;}
.steps-bar-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-top:3px;}

.filters-section{padding:0 32px 14px;}
.filters-bar{background:var(--surface);border-radius:10px;padding:12px 16px;box-shadow:var(--shadow);display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.filter-label{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-right:2px;}
.filter-divider{width:1px;height:18px;background:var(--border);margin:0 4px;flex-shrink:0;}
.status-select,.search-input{background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:7px;padding:5px 10px;font-size:12px;cursor:pointer;}
.status-select:focus,.search-input:focus{outline:none;border-color:var(--blue);}
.tag-pill{padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer;transition:all 0.15s;}
.tag-pill:hover{background:var(--tag-bg);color:var(--tag-text);border-color:#90cdf4;}
.tag-pill.active{background:var(--tag-bg);color:var(--tag-text);border-color:#90cdf4;}
.action-btn{padding:5px 12px;border-radius:7px;border:1px solid var(--border);font-size:11px;font-weight:600;cursor:pointer;background:var(--surface2);color:var(--text2);transition:all 0.15s;}
.action-btn:hover{background:var(--row-hover);}
.action-btn.primary{background:#3182ce;color:white;border-color:#3182ce;}
.action-btn.primary:hover{background:#2b6cb0;}
.ml-auto{margin-left:auto;}

.section{padding:0 32px 32px;}
.section-title{font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.section-title::before{content:'';display:block;width:4px;height:18px;background:#3182ce;border-radius:2px;}

table{width:100%;border-collapse:collapse;background:var(--surface);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);}
thead{background:var(--thead);color:var(--thead-text);}
thead th{padding:11px 16px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;}
thead th.td-center{text-align:center;}
.feature-row{cursor:pointer;transition:background 0.15s;}
.feature-row:hover{background:var(--row-hover);}
.feature-row td{padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;}
.td-center{text-align:center;}
.feature-name{font-weight:600;color:var(--blue);}
.feature-toggle{color:var(--text3);font-size:10px;transition:transform 0.2s;display:inline-block;margin-right:2px;}
.pass-count{color:#38a169;font-weight:700;}
.fail-count{color:#e53e3e;font-weight:700;}
.dur-col{color:var(--text3);font-size:12px;}
.badge{padding:3px 9px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:0.5px;}
.badge-pass{background:var(--pass-bg);color:var(--pass-text);}
.badge-fail{background:var(--fail-bg);color:var(--fail-text);}
.mini-bar-wrap{display:flex;flex-direction:column;gap:2px;}
.mini-bar-track{height:5px;background:var(--progress-bg);border-radius:3px;overflow:hidden;}
.mini-bar-fill{height:100%;background:#48bb78;border-radius:3px;}
.mini-bar-pct{font-size:10px;}

.scenarios-row{background:var(--surface2);}
.hidden{display:none;}
.scenarios-container{padding:12px;display:flex;flex-direction:column;gap:7px;}
.scenario-card{background:var(--surface);border-radius:8px;border:1px solid var(--border);overflow:hidden;}
.scenario-pass{border-left:3px solid #48bb78;}
.scenario-fail{border-left:3px solid #fc8181;}
.scenario-header{padding:10px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;}
.scenario-header:hover{background:var(--row-hover);}
.scenario-icon{font-size:12px;font-weight:700;width:16px;text-align:center;flex-shrink:0;}
.scenario-pass .scenario-icon{color:#38a169;}
.scenario-fail .scenario-icon{color:#e53e3e;}
.scenario-name{flex:1;font-size:12px;font-weight:600;color:var(--text);}
.scenario-tags{display:flex;gap:4px;flex-wrap:wrap;}
.tag{background:var(--tag-bg);color:var(--tag-text);padding:2px 7px;border-radius:999px;font-size:10px;font-weight:600;}
.scenario-toggle{color:var(--text3);font-size:10px;}
.steps-list{border-top:1px solid var(--border);}
.step-item{padding:8px 14px;display:flex;align-items:flex-start;gap:8px;border-bottom:1px solid var(--bg);font-size:12px;flex-wrap:wrap;}
.step-passed{background:rgba(72,187,120,0.05);}
.step-failed{background:rgba(252,129,129,0.08);}
.step-skipped{background:rgba(214,158,46,0.05);}
.step-keyword{font-weight:700;color:#805ad5;min-width:44px;flex-shrink:0;}
.step-name{flex:1;color:var(--text2);}
.step-dur{color:var(--text3);font-size:10px;min-width:34px;text-align:right;flex-shrink:0;}
.step-status-icon{font-weight:700;min-width:14px;text-align:center;flex-shrink:0;}
.step-passed .step-status-icon{color:#38a169;}
.step-failed .step-status-icon{color:#e53e3e;}
.step-skipped .step-status-icon{color:#d69e2e;}
.step-error{width:100%;margin-top:6px;padding:8px;background:var(--fail-bg);border-radius:4px;font-size:11px;color:var(--fail-text);font-family:monospace;white-space:pre-wrap;}
.no-results{text-align:center;padding:32px;color:var(--text3);font-size:13px;background:var(--surface);border-radius:10px;}
.footer{text-align:center;padding:18px;font-size:12px;color:var(--text3);border-top:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;gap:6px;}
.footer a{color:var(--blue);text-decoration:none;font-weight:600;line-height:1;}
.footer a:hover{text-decoration:underline;}
.footer .li-logo{display:inline-flex;align-items:center;line-height:1;}
.footer .li-logo img{height:16px;width:16px;border-radius:3px;display:block;}
</style>
</head>
<body>

<div class="header">
  <div class="header-left">
    <div class="header-logo"><img src="data:image/jpeg;base64,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" alt="Rezoomex"/></div>
    <div class="header-title"><h1>Paywatch Rex Chatbot &mdash; Test Report</h1></div>
  </div>
  <div class="header-right">
    <div class="header-right-top">
      <button class="dark-toggle" onclick="toggleTheme()" id="themeBtn">&#127769; Dark Mode</button>
      <div class="author-info">
        <strong>Ravikant Shete</strong>
        <a href="https://www.linkedin.com/in/ravikantshete/" target="_blank"><img src="data:image/png;base64,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" alt="LinkedIn" style="height:22px;width:22px;vertical-align:middle;border-radius:4px;"/></a>
      </div>
    </div>
    <div class="author-info"><span>${date} &nbsp;&middot;&nbsp; paywatchapp.nftqa1.rezoomex.in</span></div>
  </div>
</div>

<div class="stats-grid">
  <div class="stat-card blue">
    <div class="stat-label">Total Scenarios</div>
    <div class="stat-value">${totalScenarios}</div>
    <div class="stat-sub">Across ${features.length} feature files</div>
  </div>
  <div class="stat-card green">
    <div class="stat-label">Passed</div>
    <div class="stat-value">${passedScenarios}</div>
    <div class="stat-sub">${passRate}% pass rate</div>
  </div>
  <div class="stat-card red">
    <div class="stat-label">Failed</div>
    <div class="stat-value">${failedScenarios}</div>
    <div class="stat-sub">${failedScenarios===0?'All clear! &#127881;':'Needs attention'}</div>
  </div>
  <div class="stat-card purple">
    <div class="stat-label">Duration</div>
    <div class="stat-value">${duration}s</div>
    <div class="stat-sub">${totalSteps} steps executed</div>
  </div>
</div>

<div class="progress-section">
  <div class="progress-label"><span>Overall pass rate</span><span>${passRate}%</span></div>
  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${passRate}%"></div></div>
</div>

<div class="charts-row">
  <div class="chart-card">
    <div class="chart-title">Duration per feature</div>
    ${durationBars}
  </div>
  <div class="chart-card">
    <div class="chart-title">Pass rate summary</div>
    <div class="donut-wrap">
      <svg width="90" height="90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" stroke-width="13"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#48bb78" stroke-width="13"
          stroke-dasharray="${dashArray}" stroke-linecap="round" transform="rotate(-90 50 50)"/>
        <text x="50" y="46" text-anchor="middle" font-size="18" font-weight="800" fill="#38a169">${passRate}</text>
        <text x="50" y="60" text-anchor="middle" font-size="10" fill="#718096">%</text>
      </svg>
      <div class="donut-legend">
        <div class="legend-item"><div class="legend-dot" style="background:#48bb78;"></div><span>${passedScenarios} Passed</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:#fc8181;"></div><span>${failedScenarios} Failed</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:#63b3ed;"></div><span>${totalSteps} Steps</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:#9f7aea;"></div><span>${duration}s Duration</span></div>
      </div>
    </div>
    <div class="steps-breakdown">
      <div class="steps-title">Steps breakdown</div>
      <div class="steps-bar">
        <div class="steps-bar-pass" style="flex:${passedSteps};"></div>
        <div class="steps-bar-fail" style="flex:${Math.max(failedSteps,0.01)};"></div>
      </div>
      <div class="steps-bar-labels"><span>${passedSteps} passed</span><span>${failedSteps} failed</span></div>
    </div>
  </div>
</div>

<div class="filters-section">
  <div class="filters-bar">
    <span class="filter-label">Filters:</span>
    <select class="status-select" id="statusFilter" onchange="applyFilters()">
      <option value="all">All Status</option>
      <option value="passed">&#10003; Passed Only</option>
      <option value="failed">&#10007; Failed Only</option>
    </select>
    <div class="filter-divider"></div>
    <span class="filter-label">Tags:</span>
    <span class="tag-pill active" data-tag="all" onclick="filterByTag('all')">All</span>
    ${tagPills}
    <div class="filter-divider"></div>
    <input class="search-input" id="searchFilter" type="text" placeholder="&#128269; Search scenarios..." oninput="applyFilters()" style="min-width:180px;"/>
    <div class="ml-auto" style="display:flex;gap:6px;">
      <button class="action-btn primary" onclick="expandAll()">Expand All</button>
      <button class="action-btn" onclick="collapseAll()">Collapse All</button>
      <button class="action-btn" onclick="resetFilters()">Reset</button>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">Features Overview</div>
  <table id="featuresTable">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Status</th>
        <th class="td-center">Total</th>
        <th class="td-center">Passed</th>
        <th class="td-center">Failed</th>
        <th>Duration</th>
        <th>Pass Rate</th>
      </tr>
    </thead>
    <tbody id="tableBody">${featureRows}</tbody>
  </table>
  <div class="no-results hidden" id="noResults">No scenarios match your filters.</div>
</div>

<div class="footer">
  Maintained by Ravikant Shete &nbsp;&middot;&nbsp; <a href="https://www.linkedin.com/in/ravikantshete/" target="_blank"><img src="data:image/png;base64,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" alt="LinkedIn" style="height:22px;width:22px;vertical-align:middle;border-radius:4px;"/></a>
</div>

<script>
var activeTag='all';
function toggleTheme(){
  var html=document.documentElement;
  var isDark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',isDark?'light':'dark');
  document.getElementById('themeBtn').innerHTML=isDark?'&#127769; Dark Mode':'&#9728;&#65039; Light Mode';
}
function toggleScenarios(i,e){
  var row=document.getElementById('scenarios-'+i);
  var toggle=document.getElementById('ft-'+i);
  var hidden=row.classList.toggle('hidden');
  toggle.style.transform=hidden?'':'rotate(90deg)';
}
function toggleSteps(id,e){e.stopPropagation();document.getElementById(id).classList.toggle('hidden');}
function filterByTag(tag){
  activeTag=tag;
  document.querySelectorAll('.tag-pill').forEach(function(p){
    p.classList.toggle('active',p.dataset.tag===tag);
  });
  applyFilters();
}
function applyFilters(){
  var status=document.getElementById('statusFilter').value;
  var search=document.getElementById('searchFilter').value.toLowerCase();
  var anyVisible=false;
  document.querySelectorAll('.scenario-card').forEach(function(card){
    var cardStatus=card.dataset.status;
    var cardTags=card.dataset.tags||'';
    var cardName=card.querySelector('.scenario-name').textContent.toLowerCase();
    var statusOk=status==='all'||cardStatus===status;
    var tagOk=activeTag==='all'||cardTags.split(',').includes(activeTag);
    var searchOk=!search||cardName.includes(search);
    var show=statusOk&&tagOk&&searchOk;
    card.style.display=show?'':'none';
    if(show) anyVisible=true;
  });
  document.querySelectorAll('.feature-row').forEach(function(row){
    var fi=row.dataset.feature;
    var scenRow=document.getElementById('scenarios-'+fi);
    var isFiltering=status!=='all'||activeTag!=='all'||search;
    var visibleCards=scenRow?[...scenRow.querySelectorAll('.scenario-card')].filter(function(c){return c.style.display!=='none';}):[];
    var featureVisible=isFiltering?visibleCards.length>0:true;
    row.style.display=featureVisible?'':'none';
  });
  document.getElementById('noResults').classList.toggle('hidden',anyVisible);
}
function expandAll(){
  document.querySelectorAll('.scenarios-row').forEach(function(r){r.classList.remove('hidden');});
  document.querySelectorAll('.feature-toggle').forEach(function(t){t.style.transform='rotate(90deg)';});
}
function collapseAll(){
  document.querySelectorAll('.scenarios-row').forEach(function(r){r.classList.add('hidden');});
  document.querySelectorAll('.feature-toggle').forEach(function(t){t.style.transform='';});
}
function resetFilters(){
  document.getElementById('statusFilter').value='all';
  document.getElementById('searchFilter').value='';
  filterByTag('all');
}
</script>
</body>
</html>`;

fs.mkdirSync("reports/html",{recursive:true});
fs.writeFileSync(outputPath,html);
console.log("Custom report generated: reports/html/index.html");
