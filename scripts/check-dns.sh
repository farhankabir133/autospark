#!/usr/bin/env bash
set -euo pipefail

DOMAIN="autosparkbd.com"
REPORT_FILE="scripts/dns-report.txt"
EXPECTED=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")

mkdir -p scripts
: > "$REPORT_FILE"

echo "DNS Monitor Report for $DOMAIN" | tee -a "$REPORT_FILE"
echo "Generated: $(date -u)" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

NSLIST=$(dig +short NS "$DOMAIN" | sed 's/\.$//')
if [ -z "$NSLIST" ]; then
  echo "ERROR: No authoritative nameservers found for $DOMAIN" | tee -a "$REPORT_FILE"
  exit 2
fi

echo "Authoritative nameservers:" | tee -a "$REPORT_FILE"
echo "$NSLIST" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

mismatch=0
for ns in $NSLIST; do
  echo "Querying $ns for A records..." | tee -a "$REPORT_FILE"
  answers=$(dig +short A "$DOMAIN" @"$ns" | sort -u | tr '\n' ' ')
  if [ -z "$answers" ]; then
    echo "  -> No A records returned by $ns" | tee -a "$REPORT_FILE"
    mismatch=1
  else
    echo "  -> answers: $answers" | tee -a "$REPORT_FILE"
    for ip in $answers; do
      ok=0
      for e in "${EXPECTED[@]}"; do
        if [ "$ip" = "$e" ]; then ok=1; break; fi
      done
      if [ $ok -ne 1 ]; then
        echo "  -> Unexpected IP $ip from $ns" | tee -a "$REPORT_FILE"
        mismatch=1
      fi
    done
  fi
  echo "" | tee -a "$REPORT_FILE"
done

# Check public resolvers
echo "Public resolver checks:" | tee -a "$REPORT_FILE"
for resolver in 8.8.8.8 1.1.1.1 9.9.9.9; do
  echo "Resolver $resolver:" | tee -a "$REPORT_FILE"
  dig +short A "$DOMAIN" @"$resolver" | tee -a "$REPORT_FILE"
done

echo "" | tee -a "$REPORT_FILE"

# HTTP check (gets REMOTE_IP and HTTP code)
echo "HTTP check (may follow redirects):" | tee -a "$REPORT_FILE"
if command -v curl >/dev/null 2>&1; then
  curl -s -o /dev/null -w "HTTP_CODE:%{http_code} FINAL_URL:%{url_effective} REMOTE_IP:%{remote_ip}\n" "http://$DOMAIN" | tee -a "$REPORT_FILE"
else
  echo "curl not available, skipping HTTP check" | tee -a "$REPORT_FILE"
fi

echo "" | tee -a "$REPORT_FILE"
if [ $mismatch -eq 1 ]; then
  echo "RESULT: MISMATCH DETECTED" | tee -a "$REPORT_FILE"
  exit 2
else
  echo "RESULT: All authoritative NS returned expected GitHub Pages IPs." | tee -a "$REPORT_FILE"
  exit 0
fi
