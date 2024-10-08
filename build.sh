#!/bin/bash

# Executed by https://github.com/MOROway/moroway-app-dev/blob/main/build/build.sh
# -b beta number (0=off, 1,2,3,etc=beta number)
# -d debug (0=off, 1=on)
# -l server link
# -o path to build tools output directory (e.g. /path/to/moroway-app-dev/out/oc/latest/)
# -s share link
# -v version
# -w path to build tools working directory (e.g. /path/to/moroway-app-dev/build)

while getopts :b:d:l:o:s:v:w: opts; do
	case $opts in
	l) link=$OPTARG ;;
	o) output_dir_build=$OPTARG ;;
	v) version=$OPTARG ;;
	w) working_dir_build=$OPTARG ;;
	esac
done

[[ ! -d "$working_dir_build/changelogs" ]] && exit 1
[[ ! -d "$output_dir_build" ]] && exit 2
cd $(dirname "$0") || exit 3

# Copy MOROway App Files
rm -r moroway-app-oc
cp -r "$output_dir_build" moroway-app-oc

# Set Metadata
for lang in "$working_dir_build/metadata"/*; do
	lang=$(basename "$lang")
	if [[ -d fastlane/metadata/android/"$lang"/ ]]; then
		file="$working_dir_build/metadata/$lang/application-name.txt"
		file_out=fastlane/metadata/android/"$lang"/title.txt
		if [[ -f "$file" ]]; then
			cat "$file" >"$file_out"
		elif [[ -f "$file_out" ]]; then
			rm "$file_out"
		fi
		file="$working_dir_build/metadata/$lang/translations.yml"
		file_out=fastlane/metadata/android/"$lang"/full_description.txt
		if [[ -f "$file" ]]; then
			"$working_dir_build"/build-libs/yq_linux_amd64 e ".Description | .Standard" "$file" >"$file_out"
			echo -ne "\n" >>"$file_out"
			"$working_dir_build"/build-libs/yq_linux_amd64 e ".Description | .Extra | .[]" "$file" >>"$file_out"
		elif [[ -f "$file_out" ]]; then
			rm "$file_out"
		fi
		file_out=fastlane/metadata/android/"$lang"/short_description.txt
		if [[ -f "$file" ]]; then
			"$working_dir_build"/build-libs/yq_linux_amd64 e ".Description | .Short" "$file" >"$file_out"
		elif [[ -f "$file_out" ]]; then
			rm "$file_out"
		fi
	fi
done

# Set Changelog
version_long=$(echo "$version" | sed 's/\.\([0-9]\)/.0\1/g' | sed 's/\.0\([0-9]\{2\}\)/\1/g' | sed 's/\.//g')
rm fastlane/metadata/android/*/changelogs/"$version_long".txt 2>/dev/null
for lang in "$working_dir_build/changelogs"/*; do
	lang=$(basename "$lang")
	if [[ "$lang" != meta ]]; then
		changelog=""
		changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".versions .\"$version\" .general | select(.)" "$working_dir_build/changelogs/$lang/changelog.yml" | sed 's/{{[0-9]\+}}\s\?//g')
		if [[ -z "$changelogAdd" ]]; then
			changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".versions .\"$version\" .general | select(.)" "$working_dir_build/changelogs/default/changelog.yml" | sed 's/{{[0-9]\+}}\s\?//g')
		fi
		if [[ ! -z "$changelogAdd" ]]; then
			changelog="$changelog$changelogAdd"$'\n'
		fi
		changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".versions .\"$version\" .oc | select(.)" "$working_dir_build/changelogs/$lang/changelog.yml" | sed 's/{{[0-9]\+}}\s\?//g')
		if [[ -z "$changelogAdd" ]]; then
			changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".versions .\"$version\" .oc | select(.)" "$working_dir_build/changelogs/default/changelog.yml" | sed 's/{{[0-9]\+}}\s\?//g')
		fi
		if [[ ! -z "$changelogAdd" ]]; then
			changelog="$changelog$changelogAdd"$'\n'
		fi
		if [[ $(cat "$working_dir_build/changelogs/meta/fixes/$version") == 1 ]]; then
			changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".fixes | select(.)" "$working_dir_build/changelogs/$lang/changelog.yml")
			if [[ -z "$changelogAdd" ]]; then
				changelogAdd=$("$working_dir_build"/build-libs/yq_linux_amd64 e ".fixes | select(.)" "$working_dir_build/changelogs/default/changelog.yml")
			fi
			if [[ ! -z "$changelogAdd" ]]; then
				changelog="$changelog$changelogAdd."$'\n'
			fi
		fi
		if [[ ! -z "$changelog" ]] && [[ -d fastlane/metadata/android/"$lang"/changelogs/ ]]; then
			printf '%s' "$changelog" >fastlane/metadata/android/"$lang"/changelogs/"$version_long".txt
		fi
	fi
done

# Set F-Droid Version
echo "$version,$version_long" >fdroid_version.txt

# Set App Domain
echo $(echo "$link" | sed 's!^\(.*//\)*\([^/]*\).*$!\2!') >app_domain.txt

# Set App Version
sed -i "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"$version\"/" config.xml

# Set package.json
license="$(cat "$working_dir_build/metadata/default/license.txt")"
sed -i 's/\("license":\s*\)".*"/\1"'"$license"'"/' package.json
