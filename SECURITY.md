# Security Policy

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, use one of these private channels:

- **GitHub Private Vulnerability Reporting**: Go to the [Security Advisories](https://github.com/aikdna/kdna/security/advisories/new) page. Reports are directed to the parent kdna repo for the shared Core, Read and CLI security boundary.
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

The KDNA Protocol is content-neutral. This repository observes exact `.kdna`
asset bytes through its bound public Core, Read and CLI graph, recorded in
`public-contract-binding.json`. Core owns container admission and component
interpretation; Read owns disclosure. The adapter checks asset paths, digests
and dependency bytes before using those public entry points. It does not parse
payloads or execute asset content.

Asset content must be treated as untrusted input. Technical readability and
index membership do not establish content quality, human confirmation or
permission to act. Local read permission applies only to the checked bytes and
current request; it is not a transferable credential or action authorization.
The embedding application remains responsible for its own trusted policy and
any downstream network, filesystem or execution capabilities.

For questions about the security model that are not answered
here, open a GitHub issue (not for vulnerabilities) or email
security@aikdna.com (for vulnerabilities).
