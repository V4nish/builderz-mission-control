#!/bin/bash
# security-audit.sh - Run a comprehensive security check on mission control
set -euo pipefail

PROJECT_DIR="${1:-.}"
cd "$PROJECT_DIR"

echo "========================================="
echo "Security Audit: $(basename "$(pwd)")"
echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "========================================="
echo ""

ISSUES=0
warn() { echo "  [!] $1"; ((ISSUES++)); }
ok() { echo "  [OK] $1"; }
section() { echo ""; echo "--- $1 ---"; }

# 1. Secrets detection
section "Secret Detection"
for pattern in 'AKIA[0-9A-Z]\{16\}' 'BEGIN.*PRIVATE KEY' 'sk-[A-Za-z0-9]\{20,\}' \
               'ghp_[A-Za-z0-9]\{36\}' 'xox[bpoas]-'; do
    count=$(grep -rn "$pattern" --include='*.{js,ts,py,go,java,rb,env,yml,yaml,json,xml}' . 2>/dev/null | \
            grep -v 'node_modules\|\.git\|vendor\|__pycache__' | wc -l)
    if [ "$count" -gt 0 ]; then
        warn "Found $count matches for pattern: $pattern"
    fi
done
grep -rn -i 'password\s*[:=]\s*["'"'"'][^"'"'"']*["'"'"']' \
  --include='*.{js,ts,py,go,yml,yaml,json,env}' . 2>/dev/null | \
  grep -v 'node_modules\|\.git\|example\|test\|mock\|placeholder\|changeme\|xxxx' | \
  while read -r line; do warn "Hardcoded password: $line"; done

# 2. Dependency audit
section "Dependency Vulnerabilities"
if [ -f package-lock.json ] || [ -f package.json ]; then
    npm audit --audit-level=high 2>/dev/null && ok "npm: no high/critical vulns" || warn "npm audit found issues"
fi

# 3. Gitignore check
section ".gitignore Coverage"
if [ ! -f .gitignore ]; then
    warn "No .gitignore file"
else
    for entry in '.env' 'node_modules' '*.key' '*.pem' '.DS_Store'; do
        grep -q "$entry" .gitignore 2>/dev/null && ok ".gitignore has $entry" || warn ".gitignore missing: $entry"
    done
fi

# 4. SSL verification disabled
section "SSL Verification"
disabled=$(grep -rn "verify\s*=\s*False\|rejectUnauthorized.*false\|InsecureSkipVerify.*true" \
  --include='*.{py,js,ts,go,java,rb}' . 2>/dev/null | \
  grep -v 'node_modules\|\.git\|test\|spec\|mock' | wc -l)
[ "$disabled" -gt 0 ] && warn "SSL verification disabled in $disabled location(s)" || ok "No SSL bypasses found"

# 5. CORS wildcard
section "CORS Configuration"
cors=$(grep -rn "Access-Control-Allow-Origin.*\*\|cors({.*origin.*true" \
  --include='*.{py,js,ts,go,java,rb}' . 2>/dev/null | \
  grep -v 'node_modules\|\.git' | wc -l)
[ "$cors" -gt 0 ] && warn "CORS wildcard found in $cors location(s)" || ok "No CORS wildcard"

# 6. Debug mode
section "Debug/Development Settings"
debug=$(grep -rn "DEBUG\s*=\s*True\|debug:\s*true" \
  --include='*.{py,yml,yaml,json}' . 2>/dev/null | \
  grep -v 'node_modules\|\.git\|test\|jest\|vitest' | wc -l)
[ "$debug" -gt 0 ] && warn "Debug mode enabled in $debug location(s)" || ok "No debug flags found"

echo ""
echo "========================================="
echo "Audit complete. Issues found: $ISSUES"
echo "========================================="
[ "$ISSUES" -eq 0 ] && exit 0 || exit 1
