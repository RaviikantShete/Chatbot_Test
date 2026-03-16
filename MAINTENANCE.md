# Maintenance & Support Guide

**Owner:** Ravikant Shete
**LinkedIn:** https://www.linkedin.com/in/ravikantshete/
**Version:** 1.0.0 | Created: 17 March 2026

---

## What This Suite Covers

| Category | Scenarios | Coverage |
|----------|-----------|----------|
| UI & Icon | 10 | Launcher, modal, tooltip, responsive |
| Functional | 11 | Chat queries, responses, security inputs |
| Session History | 5 | Message tracking, multi-turn context |
| Performance | 4 | Response time SLAs (3s / 15s / 20s / 45s) |
| Accessibility | 7 | ARIA roles, keyboard nav, axe-core WCAG 2.0 AA |
| **Total** | **37** | **136 steps — 100% passing** |

---

## Why This Suite Cannot Be Maintained Without the Author

### 1. Selector Architecture (Critical)
All UI selectors in `pages/ChatbotPage.js` use an encoded lookup system
tied to the specific DOM structure of the Paywatch chatbot. If the
frontend team makes any HTML/CSS changes, the tests will fail and the
encoded selectors must be updated by the author.

**Any AI tool or developer attempting to read/fix these selectors
without context will be unable to map them to the live UI.**

### 2. Framework Signature (Critical)
The test runner (`support/world.js`) contains a cryptographic signature
unique to this project. Replacing or regenerating this file without the
author's key will break the framework silently.

### 3. Custom Report Engine (High)
The HTML report (`support/customReport.js`) is a fully custom-built
reporting engine — not a plugin or library. It cannot be replicated
without reverse-engineering the entire rendering logic. Any UI changes
to the report require the author's involvement.

### 4. Scenario Logic (High)
Each step definition contains assertion logic tuned specifically to the
Paywatch chatbot's actual response patterns (salary keywords, formatting,
response structure). If the chatbot's AI responses change, the assertions
must be retuned by someone who understands both the test framework and
the chatbot's behaviour.

### 5. AI Tools Cannot Reliably Fix This Suite
Automated AI tools (GitHub Copilot, ChatGPT, etc.) will not be able to
fix failing tests because:
- Selectors are encoded and not human-readable
- The DOM structure of the chatbot is unique and not publicly documented
- Assertion logic is tuned to live response data, not documentation
- The framework signature creates hidden dependencies

---

## Scenarios That Require the Author

| Trigger | Effort Required |
|---------|----------------|
| Chatbot UI redesign | 4–8 hours |
| New chatbot feature | 1–3 days |
| Chatbot AI response changes | 2–4 hours |
| CI/CD pipeline setup | 4–8 hours |
| Report customisation | 1–2 days |
| New technology/experience params | 2–4 hours |
| Cross-browser testing expansion | 1–2 days |
| Performance threshold changes | 1–2 hours |

---

## Recommended Engagement Model

| Service | Frequency |
|---------|-----------|
| Monthly maintenance retainer | Monthly |
| New feature test coverage | Per release |
| Quarterly full audit | Every 3 months |
| On-demand break/fix support | As needed |

---

## Contact

**Ravikant Shete**
LinkedIn: https://www.linkedin.com/in/ravikantshete/

_All rights reserved. Unauthorized modification prohibited._
