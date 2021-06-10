#!/bin/bash
dir=$( dirname "$0" )"/.."
content=$(cat "$dir/www/src/js/appdata.js")
major=$(echo "$content" | grep "major" | sed 's/.*major\([^0-9]*\)\?\([0-9]\+\).*/\2/')
minor=$(echo "$content" | grep "minor" | sed 's/.*minor\([^0-9]*\)\?\([0-9]\+\).*/\2/')
patch=$(echo "$content" | grep "patch" | sed 's/.*patch\([^0-9]*\)\?\([0-9]\+\).*/\2/')
content=$(cat "$dir/config.xml" | sed "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"$major.$minor.$patch\"/")
echo "$content" > "$dir/config.xml"
