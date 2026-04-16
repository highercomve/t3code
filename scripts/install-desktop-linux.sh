#!/usr/bin/env bash
set -euo pipefail

# Install T3 Code desktop app locally on Linux
# Installs AppImage to ~/.local/bin, .desktop entry and icon to ~/.local/share

APP_NAME="t3code"
DISPLAY_NAME="T3 Code"
APP_ID="com.t3tools.t3code"
CATEGORY="Development"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RELEASE_DIR="${REPO_ROOT}/release"
ICON_SOURCE="${REPO_ROOT}/assets/prod/black-universal-1024.png"

BIN_DIR="${HOME}/.local/bin"
APPS_DIR="${HOME}/.local/share/applications"
ICONS_DIR="${HOME}/.local/share/icons/hicolor"

# Find the AppImage in release/
find_appimage() {
  local found
  found=$(find "$RELEASE_DIR" -maxdepth 1 -name "T3-Code-*.AppImage" -type f 2>/dev/null | sort -V | tail -1)
  echo "$found"
}

APPIMAGE="$(find_appimage)"

if [[ -z "$APPIMAGE" ]]; then
  echo "No AppImage found in ${RELEASE_DIR}."
  echo "Build one first with: bun run dist:desktop:linux"
  exit 1
fi

APPIMAGE_NAME="$(basename "$APPIMAGE")"
echo "Installing ${APPIMAGE_NAME}..."

# Create directories
mkdir -p "$BIN_DIR"
mkdir -p "$APPS_DIR"

# Copy AppImage
cp "$APPIMAGE" "${BIN_DIR}/${APP_NAME}.AppImage"
chmod +x "${BIN_DIR}/${APP_NAME}.AppImage"
echo "  -> ${BIN_DIR}/${APP_NAME}.AppImage"

# Install icon at multiple sizes
if [[ -f "$ICON_SOURCE" ]]; then
  for size in 16 32 48 64 128 256 512; do
    ICON_DIR="${ICONS_DIR}/${size}x${size}/apps"
    mkdir -p "$ICON_DIR"
    if command -v magick &>/dev/null; then
      magick "$ICON_SOURCE" -resize "${size}x${size}" "${ICON_DIR}/${APP_NAME}.png"
    elif command -v convert &>/dev/null; then
      convert "$ICON_SOURCE" -resize "${size}x${size}" "${ICON_DIR}/${APP_NAME}.png"
    else
      # Fallback: copy the full-size icon for all sizes
      cp "$ICON_SOURCE" "${ICON_DIR}/${APP_NAME}.png"
    fi
  done
  # Also install the original as scalable fallback
  mkdir -p "${ICONS_DIR}/1024x1024/apps"
  cp "$ICON_SOURCE" "${ICONS_DIR}/1024x1024/apps/${APP_NAME}.png"
  echo "  -> icons installed to ${ICONS_DIR}"

  # Update icon cache if available
  if command -v gtk-update-icon-cache &>/dev/null; then
    gtk-update-icon-cache -f -t "${HOME}/.local/share/icons/hicolor" 2>/dev/null || true
  fi
else
  echo "  Warning: icon source not found at ${ICON_SOURCE}, skipping icon install"
fi

# Create .desktop file
DESKTOP_FILE="${APPS_DIR}/${APP_NAME}.desktop"
cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Name=${DISPLAY_NAME}
Comment=Minimal web-based GUI for AI coding agents
Exec=${BIN_DIR}/${APP_NAME}.AppImage %U
Icon=${APP_NAME}
Type=Application
Categories=${CATEGORY};
StartupWMClass=${APP_NAME}
Terminal=false
MimeType=x-scheme-handler/t3code;
EOF
echo "  -> ${DESKTOP_FILE}"

# Update desktop database if available
if command -v update-desktop-database &>/dev/null; then
  update-desktop-database "$APPS_DIR" 2>/dev/null || true
fi

echo ""
echo "Done! ${DISPLAY_NAME} has been installed locally."
echo ""
echo "Make sure ~/.local/bin is in your PATH:"
echo '  export PATH="$HOME/.local/bin:$PATH"'
echo ""
echo "You can launch it from your application menu or run:"
echo "  ${APP_NAME}.AppImage"
