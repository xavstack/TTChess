#!/usr/bin/env bash
set -Eeuo pipefail

# ── Project root = this script's folder
SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

# ── (Optional) NVM
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# ── Ensure a git repo (for clean commits)
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || git init -q

# ── Codex global config
CODEX_DIR="$HOME/.codex"
CODEX_CFG="$CODEX_DIR/config.toml"
mkdir -p "$CODEX_DIR"
[ -f "$CODEX_CFG" ] && cp -n "$CODEX_CFG" "$CODEX_CFG.bak.$(date +%F)" || true

# Choose set: light (default) or full (adds heavy MCPs). Or override with MCP_LIST.
MCP_SET="${MCP_SET:-light}"        # light | full
MCP_LIST="${MCP_LIST:-}"           # e.g. "eslint,playwright,lighthouse,snyk,serena"

# Versions (override by env if you want)
: "${MCP_ESLINT_VER:=@latest}"
: "${MCP_PLAYWRIGHT_VER:=@latest}"
: "${MCP_LIGHTHOUSE_VER:=@latest}"
: "${MCP_SNYK_VER:=@latest}"

# Build base config
cat >"$CODEX_CFG" <<'TOML'
default_profile = "yolo"
[profiles.yolo]
ask_for_approval = "never"
sandbox = "danger-full-access"
TOML

append_server () {
  local name="$1"; shift
  printf '\n[mcp_servers.%s]\n' "$name" >>"$CODEX_CFG"
  printf 'command = "%s"\n' "$1" >>"$CODEX_CFG"; shift
  printf 'args = [%s]\n' "$1" >>"$CODEX_CFG"; shift
}

want () {
  # returns 0 if $1 is requested via MCP_LIST or MCP_SET logic
  local svc="$1"
  if [ -n "$MCP_LIST" ]; then
    IFS=',' read -r -a arr <<<"$MCP_LIST"
    for x in "${arr[@]}"; do [ "$x" = "$svc" ] && return 0; done
    return 1
  else
    # default sets
    if [ "$MCP_SET" = "light" ]; then
      [ "$svc" = "eslint" ] && return 0 || return 1
    else
      case "$svc" in
        eslint|playwright|lighthouse|snyk|serena) return 0 ;;
        *) return 1 ;;
      esac
    fi
  fi
}

# Always include ESLint in light mode
want eslint && append_server "eslint" "npx" "\"-y\",\"@eslint/mcp${MCP_ESLINT_VER}\""

# Optional heavy MCPs (only if requested)
if want playwright; then
  append_server "playwright" "npx" "\"-y\",\"@executeautomation/playwright-mcp-server${MCP_PLAYWRIGHT_VER}\""
fi
if want lighthouse; then
  append_server "lighthouse" "npx" "\"-y\",\"@mseep/lighthouse-mcp${MCP_LIGHTHOUSE_VER}\""
fi
if want snyk && [ -n "${SNYK_TOKEN:-}" ]; then
  append_server "snyk" "npx" "\"-y\",\"snyk${MCP_SNYK_VER}\",\"mcp\",\"-t\",\"stdio\""
fi
if want serena && command -v uvx >/dev/null 2>&1; then
  append_server "serena" "uvx" "\"--from\",\"git+https://github.com/oraios/serena\",\"serena\",\"start-mcp-server\",\"--context\",\"codex\""
fi

# Project-local extras (optional): ./mcp.extra.toml will be appended verbatim
if [ -f ./mcp.extra.toml ]; then
  printf "\n# --- Project extras ---\n" >>"$CODEX_CFG"
  cat ./mcp.extra.toml >>"$CODEX_CFG"
fi

# Optional: prewarm npx packages to avoid Codex blocking on first tool use
if [ "${PREWARM:-0}" = "1" ]; then
  echo "⚙️  Prewarming MCP packages…"
  want eslint     && npx -y "@eslint/mcp${MCP_ESLINT_VER}" --help >/dev/null 2>&1 || true
  want playwright && npx -y "@executeautomation/playwright-mcp-server${MCP_PLAYWRIGHT_VER}" --help >/dev/null 2>&1 || true
  want lighthouse && npx -y "@mseep/lighthouse-mcp${MCP_LIGHTHOUSE_VER}" --help >/dev/null 2>&1 || true
  want snyk       && npx -y "snyk${MCP_SNYK_VER}" mcp -t stdio --help >/dev/null 2>&1 || true
fi

echo "🗂  Codex config: $CODEX_CFG"
echo "✅ Enabled MCPs:"; awk '/^\[mcp_servers\./{gsub(/[\[\]]/,"");print " - " $1}' "$CODEX_CFG" || true

# Launch Codex (YOLO)
exec codex --yolo --model gpt-5-codex
