# Security Policy

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, use one of these private channels:

- **GitHub Private Vulnerability Reporting**: Go to the [Security Advisories](https://github.com/aikdna/kdna/security/advisories/new) page
- **Email**: security@aikdna.com

We aim to respond within 72 hours and provide a timeline for resolution within 1 week.
Please do not disclose the vulnerability publicly until we have had a chance to address it.

## Supported Versions

We actively support the latest release for security updates.

| Component | Supported Versions |
|-----------|-------------------|
| KDNA Protocol | Latest tagged release |
| kdna-cli | Latest minor release |
| kdna-studio-cli | Latest minor release |
| Public examples | Packaged `.kdna` release cards when published |

Older versions may receive critical security patches on a case-by-case basis.

## Security Model

The KDNA Protocol is content-neutral: assets distributed here
are `.kdna` runtime containers whose content is a judgment
framework. A `.kdna` asset has no network capability, no
filesystem capability, and no code-execution capability beyond
what its declared `load_contract` permits. The risk surface
of consuming a `.kdna` asset is bounded by the kdna-cli's
load contract; vulnerabilities in kdna-cli's load logic are
the primary concern, not the content of any individual asset.

For questions about the security model that are not answered
here, open a GitHub issue (not for vulnerabilities) or email
security@aikdna.com (for vulnerabilities).
