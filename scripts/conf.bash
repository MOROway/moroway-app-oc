#!/bin/bash
dir=$( dirname "$0" )"/.."
content=$(cat "$dir/www/src/jonathan_herrmann_engel/js/appdata.js")
major=$(echo "$content" | grep "major" | sed s/[^0-9]//g)
minor=$(echo "$content" | grep "minor" | sed s/[^0-9]//g)
patch=$(echo "$content" | grep "patch" | sed s/[^0-9]//g)
content=$(cat "$dir/config.xml" | sed "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"$major.$minor.$patch\"/")
echo "$content" > "$dir/config.xml"
