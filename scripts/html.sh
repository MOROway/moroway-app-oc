#!/bin/bash

function loop() {
	files=("$1"/*)
	for file in "${files[@]}"; do
		if [[ -f "$file" ]] && [[ "$file" =~ .html ]]; then
			content="$(cat "$file")"
			$(echo "$content" | grep '<!-- Cordova Scripts 1 -->' >/dev/null)
			if (($? != 0)); then
				content="$(echo "$content" | sed 's/\(<base[^>]*>\)/\1\n<!-- Cordova Scripts 1 -->\n<script src="cordova.js"><\/script>\n<meta http-equiv="Content-Security-Policy" content="default-src '"'self'; img-src 'self' https:\/\/$domain; connect-src 'self' https:\/\/$domain wss:\/\/$domain"';">\n/')"
			fi
			while [[ "$content" =~ '<iframe' ]]; do
				content="$(echo "$content" | perl -pe 's/<iframe[^>]*>.*?<\/iframe>//')"
			done
			echo "$content" >"$file"
		elif [[ -d "$file" ]]; then
			$(loop "$file")
		fi
	done
}

domain="$(cat "$(dirname "$0")/../app_domain.txt")"
odir="$(dirname "$0")/../moroway-app-oc"
dir="$(dirname "$0")/../www"
rm -r "$dir"/*
cp -pr "$odir"/* "$dir"
$(loop "$dir")
