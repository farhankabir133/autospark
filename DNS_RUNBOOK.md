# DNS Runbook — autosparkbd.com

Last updated: 2026-03-26 UTC

This runbook describes the authoritative DNS configuration, expected records, verification commands, monitoring, and emergency rollback steps for autosparkbd.com. Keep this file in the repository and also in your secure operations wiki. Store registrar and DNS provider credentials in your organization's secrets manager (1Password/LastPass/Vault) and require 2FA.

---

## 1) Summary / Purpose

This document helps operators and on-call engineers quickly validate DNS, detect split-brain / parking issues, and recover when a domain resolves to an unexpected landing/parking provider. It encodes expected values for the domain and step-by-step diagnostics and remediation.

## 2) Authoritative provider and owner

Preferred DNS provider: Cloudflare (recommended). If you use another provider (Route53, Google Cloud DNS, Purple IT DNS), treat that provider as the single authoritative source and ensure the registrar NS list contains only its nameservers.

Registrar: Purple IT Ltd
Registrar admin: (store in your secret manager)

## 3) Expected authoritative nameservers

When Cloudflare is used, expected NS (example) are the Cloudflare nameservers assigned to your zone — replace with the actual Cloudflare NS values from the Cloudflare dashboard when you create the zone.

Example (replace with your zone values):
- ns1.cloudflare.com
- ns2.cloudflare.com

If you keep using Purple IT / Orderbox as authoritative, the expected nameservers are those from that provider (e.g., TIPUITBD.MARS.ORDERBOX-DNS.COM etc.) — but do NOT mix those with parkpage/foundationapi nameservers.

## 4) Expected DNS records (zone apex + www)

Apex (root) — add these four A records for GitHub Pages:
- A @ 185.199.108.153
- A @ 185.199.109.153
- A @ 185.199.110.153
- A @ 185.199.111.153

www (recommended):
- CNAME www autosparkbd.com

Alternative: CNAME www -> farhankabir133.github.io (if your DNS provider supports CNAME flattening or you want direct redirect)

Other records (example):
- TXT @ "v=spf1 include:spf.protection.outlook.com ~all"  (add if you use email)
- MX records (as needed)

Set TTL: during migration set TTL=300 (5 minutes) for A/CNAME; after verification raise to 3600 or 36000 depending on your policy.

## 5) Quick verification commands (run in terminal)

# Show authoritative nameservers

dig +short NS autosparkbd.com

# Query each authoritative NS directly (replace NSNAME with each value)

dig +noall +answer autosparkbd.com A @NSNAME

# Query major public resolvers

dig +short autosparkbd.com A @8.8.8.8

dig +short autosparkbd.com A @1.1.1.1

dig +short autosparkbd.com A @9.9.9.9

# Check HTTP target and remote IP (captures final redirect and remote IP)

curl -s -o /dev/null -w "HTTP_CODE:%{http_code} FINAL_URL:%{url_effective} REMOTE_IP:%{remote_ip}\n" http://autosparkbd.com

# A pre-built script is included: ./scripts/check-dns.sh — it writes `scripts/dns-report.txt` with the results.

## 6) How to detect split DNS / parking

Symptoms:
- `dig +short NS autosparkbd.com` shows multiple providers (some `parkpage` / `foundationapi` NS mixed with orderbox/ns from your provider).
- Querying authoritative NS returns different A records (some show GitHub Pages IPs; some show lander/parking IP like `15.197.x.x` or another provider).
- Mobile users (carrier DNS) see the lander while desktop resolvers (local ISP / public resolvers) see the correct GH Pages IPs.

If you see mixed results from authoritative NS -> you have split-brain DNS. Fix by ensuring the registrar NS list contains ONLY the chosen provider's nameservers.

## 7) Emergency remediation (fastest path)

Goal: force all resolvers to return the expected GitHub Pages A records.

1) If you can access the registrar:
  - Log in to Purple IT control panel.
  - Go to Domain -> Nameservers and replace all nameservers with the authoritative nameservers from the chosen provider (Cloudflare NS or your chosen provider) — DO NOT mix providers.
  - Save changes. This is an atomic switch; once registrar updates, previously-returning parkpage NS will no longer be authoritative.
  - If using Cloudflare, Cloudflare will show the assigned NS values. Copy them exactly into the registrar NS fields.

2) If you cannot access registrar quickly but can change DNS at one of the authoritative providers (rare):
  - Log in to the authoritative DNS provider that currently serves the correct GH records and ensure apex A records are the four GitHub IPs.
  - Remove any URL redirect/forwarding rules in that provider that redirect to a lander.

3) If registrar account is compromised or you cannot modify NS: contact registrar support immediately (Purple IT abuse contact) and request emergency removal of any park/parking/forwarding configuration and restoration of the NS to your control. Provide evidence: WHOIS, proof of domain ownership, and request immediate action.

4) After fix: run `./scripts/check-dns.sh` and verify `scripts/dns-report.txt` shows expected IPs across all authoritative NS.

## 8) Post-remediation verification checklist

- [ ] `dig +short NS autosparkbd.com` returns only the chosen provider's NS.
- [ ] `dig @each-authoritative-ns autosparkbd.com A` returns only GitHub Pages IPs.
- [ ] Public resolvers return GitHub IPs (8.8.8.8 / 1.1.1.1 / 9.9.9.9).
- [ ] `curl` HTTP check returns REMOTE_IP in expected list.
- [ ] GitHub Pages settings: repository -> Settings -> Pages -> Custom domain set to `autosparkbd.com` and `Enforce HTTPS` enabled.
- [ ] Uptime monitor shows healthy and no redirects to a lander.

## 9) Automation and monitoring (recommended)

1) The repository contains `scripts/check-dns.sh` and `.github/workflows/dns-monitor.yml` that runs weekly and uploads `scripts/dns-report.txt` as an artifact and opens an issue on failure. Keep that workflow enabled.

2) Uptime monitoring: create a monitor in UptimeRobot or Pingdom for https://autosparkbd.com. Configure alerts to Slack/email for non-200 responses and optionally include the reported REMOTE_IP in slack messages.

3) Add scheduled checks to your incident runbook (pager/Slack channel) so the right person is notified on mismatch.

## 10) Security / hardening

- Enable Registrar Lock (prevent transfer) and enforce 2FA on registrar and DNS provider accounts.
- Enable Cloudflare (or provider) audit logs and team-based access control. Use the principle of least privilege.
- Enable DNSSEC if supported by registrar + DNS provider (step: enable DNSSEC in the DNS provider and paste DS record(s) into the registrar DS fields).

## 11) Rollback plan

If a change invalidates site availability and you need an immediate rollback:
- Re-point registrar nameservers back to the previous working NS (if known and trusted).
- If you have an authoritative provider account that still works, quickly add the four A records there for the apex.
- If nameserver changes were recent, use Cloudflare (or another provider) as the authoritative target: create the zone, import records, then change registrar NS to Cloudflare's NS.

## 12) Contact & escalation

Registrar support (Purple IT): abuse@purpleit.com — provide domain, proof of identity, and state urgency.
On-call engineer: (add your team contact / Slack channel here)

## 13) Change-control and policy

- Always lower TTL (to 300) on records before performing NS changes; raise TTL back to 3600+ after verification.
- Never mix nameservers from multiple providers in registrar NS list.
- Changes to NS should require two approvals in your change control system.

---

Keep this file updated when DNS provider or authoritative nameservers change.

