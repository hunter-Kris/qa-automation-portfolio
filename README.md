# QA Automation Portfolio

> **This repository was created specifically as a public QA portfolio and contains no proprietary or employer code, data, test cases, or confidential information.**

This project demonstrates a practical, risk-based automation approach for web UI, REST API, and mocked AI-response testing. It is designed as portfolio evidence for Senior QA and freelance work, not as a tutorial framework. All scenarios and test data were created for this public demo.

## Technology stack

- Playwright Test and TypeScript
- Zod for runtime contract validation
- ESLint and TypeScript strict mode for static quality checks
- GitHub Actions for push and pull-request validation
- SauceDemo for public UI scenarios
- JSONPlaceholder for public REST API scenarios
- Local JSON fixtures for deterministic AI-response validation; no external AI API is called

## Test strategy

The suite favors meaningful business flows and contract risks over exhaustive UI permutations.

| Layer | Coverage | Primary risks |
| --- | ---: | --- |
| UI | 11 tests | Authentication, validation, catalog state, sorting, cart state, checkout completion |
| API | 8 tests | HTTP methods/statuses, resource contracts, missing/invalid data, query boundaries |
| Mocked AI | 8 tests | Response/tool schemas, unsafe tool selection, malformed output, null/type/boundary handling |

`@smoke` covers fast, release-critical paths. `@regression` covers broader negative, state, and contract behavior. Tests are independent and can run in parallel. Page objects contain user interactions; assertions stay close to the scenarios so failures remain readable.

JSONPlaceholder is a fake API and deliberately accepts malformed or incomplete POST payloads. Those tests assert and name that observed permissive contract; a production API would normally be expected to reject such requests with a 4xx response and structured validation details.

## Repository structure

```text
.
├── .github/workflows/       # Push and pull-request quality gate
├── fixtures/                # Public demo test data
├── pages/                   # Focused SauceDemo page objects
├── tests/
│   ├── ai/                  # Mocked LLM/tool-response contract tests
│   ├── api/                 # JSONPlaceholder REST tests
│   └── ui/                  # SauceDemo browser tests
├── utils/                   # Zod contracts and response validation
├── playwright.config.ts
└── tsconfig.json
```

## Installation

Prerequisites: Node.js 20 or newer and npm.

```bash
npm ci
npx playwright install chromium
```

The checked-in defaults target only public demo services. To use alternate compatible environments, copy `.env.example` values into your shell environment; the project does not automatically load `.env` files.

## Running tests

```bash
npm test                 # all UI, API, and AI tests
npm run test:ui          # SauceDemo UI tests
npm run test:api         # JSONPlaceholder API tests
npm run test:ai          # local mocked AI validation tests
npm run test:smoke       # release-critical tagged tests
npm run test:regression  # broader tagged coverage
npm run test:headed      # UI tests with a visible browser
npm run check            # type-check, lint, and full test suite
```

Set `UI_BASE_URL` or `API_BASE_URL` in the command environment to override a public endpoint.

## Reports and failure evidence

Playwright writes an HTML report to `playwright-report/`. Open it after a run with:

```bash
npm run report
```

Screenshots are captured on failure. Traces and videos are retained on failure, keeping successful local runs lightweight while preserving actionable debugging evidence. Runtime output is excluded from version control.

## Continuous integration

GitHub Actions runs on every push and pull request. The workflow installs locked dependencies and Chromium, then type-checks, lints, and executes the entire suite. It always uploads the HTML report and uploads detailed test artifacts when a failure occurs. Workflow permissions are read-only and jobs have a fixed timeout.

## QA skills demonstrated

- Risk-based selection of smoke and regression coverage
- Stable locators, isolated tests, and maintainable page-object boundaries
- Positive, negative, validation, state-transition, and end-to-end UI testing
- REST method, status, payload, schema, boundary, and weak-validation testing
- Deterministic AI/LLM output and tool-call contract testing without paid services
- Clear distinction between expected production behavior and a demo service's observed contract
- CI quality gates, retry policy, failure evidence, and readable reports
- Strict typing, runtime schema validation, and concise test data management

## Public-safety scope

The usernames and password used by the UI suite are public SauceDemo sample values displayed by that demo site. They do not grant access to a real account or system. No employer domains, private endpoints, production data, API keys, personal information, or copied test material belong in this repository.

## Known constraints

- Public demo services can be unavailable or change without notice; failures should first be classified as product, test, data, or environment issues.
- JSONPlaceholder simulates mutations and does not persist POST, PUT, PATCH, or DELETE changes.
- The UI suite intentionally targets Chromium in CI to keep feedback fast; cross-browser expansion should be based on product usage and risk, not added mechanically.

## License

MIT
