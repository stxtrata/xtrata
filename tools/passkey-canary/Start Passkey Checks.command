#!/bin/zsh
cd "${0:A:h}"
if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="$HOME/.nvm"
  [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
fi
if ! command -v node >/dev/null 2>&1; then
  print 'Node.js 22 or newer is required.'
  read '?Press Return to close.'
  exit 1
fi
if /usr/bin/curl --silent --fail http://127.0.0.1:4180/ >/dev/null; then
  /usr/bin/open http://127.0.0.1:4180
  exit 0
fi
(sleep 1; /usr/bin/open http://127.0.0.1:4180) &
print 'Keep this window open while using the test page. No transaction broadcasting is available.'
node serve.mjs
read '?Press Return to close.'
