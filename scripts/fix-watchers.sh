#!/bin/bash
# Fix file watcher limits for hot reload on macOS
# Run with: sudo ./scripts/fix-watchers.sh

echo "=== Current file watcher limits ==="
launchctl limit maxfiles

echo ""
echo "=== Increasing file watcher limits... ==="

# For macOS 10.14+ (Catalina and newer)
if [[ $(sw_vers -productVersion | cut -d. -f1) -ge 10 ]]; then
    # Create plist file for persistent changes
    cat > /Library/LaunchDaemons/limit.maxfiles.plist << 'PLIST_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>65536</string>
      <string>524288</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
PLIST_EOF

    # Load the new limits
    launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist 2>/dev/null || true
    
    # Apply immediately
    launchctl limit maxfiles 65536 524288
    
    # Also increase kernel maxfiles
    sysctl -w kern.maxfiles=524288 2>/dev/null || true
    sysctl -w kern.maxfilesperproc=65536 2>/dev/null || true
fi

echo ""
echo "=== New file watcher limits ==="
launchctl limit maxfiles

echo ""
echo "✅ File watcher limits increased."
echo "You may need to restart your terminal and Next.js dev server for changes to take full effect."
