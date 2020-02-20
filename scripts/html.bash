#!/bin/bash
dir=$( dirname "$0" )"/../www"
content=$(cat "$dir/index.html" | sed 's/<base\shref="[.][/]">/<base href="..\/"><script src="cordova.js"><\/script>/')
echo "$content" > "$dir/html_platform/index.html"
