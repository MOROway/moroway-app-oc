#!/bin/bash

# Executed by https://github.com/MOROway/moroway-app-dev/blob/main/build/build.sh
# -b beta number (0=off, 1,2,3,etc=beta number)
# -d debug (0=off, 1=on)
# -o path to build tools output directory (e.g. /path/to/moroway-app-dev/out/oc/latest/)
# -v version
# -w path to build tools working directory (e.g. /path/to/moroway-app-dev/build)

while getopts :b:d:o:v:w: opts; do
   case $opts in
      o) output_dir_build=$OPTARG;;
      v) version=$OPTARG;;
      w) working_dir_build=$OPTARG;;
   esac
done

[[ ! -d "$working_dir_build/changelogs" ]] && exit 1
[[ ! -d "$output_dir_build" ]] && exit 2
cd $(dirname "$0") || exit 3

# Copy MOROway App Files
rm -r moroway-app-oc
cp -r "$output_dir_build" moroway-app-oc

# Set Changelog
version_long=$(echo "$version" | sed 's/\.\([0-9]\)/.0\1/g' | sed 's/\.0\([0-9]\{2\}\)/\1/g' | sed 's/\.//g')
for lang in "$working_dir_build/changelogs"/* ; do
	lang=$(basename "$lang")
	changelog=""
	if [[ -f "$working_dir_build/changelogs/$lang/$version" ]]; then
		changelog="$changelog"$(cat "$working_dir_build/changelogs/$lang/$version" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ -f "$working_dir_build/changelogs/$lang/$version-oc" ]]; then
		changelog="$changelog"$(cat "$working_dir_build/changelogs/$lang/$version-oc" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ ! -z "$changelog" ]] && [[ -d fastlane/metadata/android/"$lang"/changelogs/ ]]; then
		printf '%s' "$changelog" > fastlane/metadata/android/"$lang"/changelogs/"$version_long".txt
	fi
done

# Set F-Droid Version
echo "$version,$version_long" > fdroid_version.txt

# Set App Version
content=$(cat config.xml | sed "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"$version\"/")
echo "$content" > config.xml
