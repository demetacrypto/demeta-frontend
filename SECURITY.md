# Security policy

Use GitHub's private security-advisory flow for vulnerabilities. Do not include secrets, exploit payloads against third parties, private customer data, or credentials in a public issue.

The showcase is static and does not collect or transmit form data. Generated-code preview workers, URL fetchers, admin orchestration, deployment automation, authentication, and user-submitted HTML are intentionally outside this skill. Those systems require a separate security design covering isolation, SSRF, XSS/CSP, CSRF, dependency allowlists, fixed output roots, quotas, and secret boundaries.
