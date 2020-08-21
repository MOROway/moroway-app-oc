#!/bin/bash

function loop () {
	files=( "$1"/* );
	for file in "${files[@]}"
	do
		if [[ -f "$file" ]] && [[ "$file" =~ .html ]]
		then
			content=$( cat "$file" )
			$( echo "$content" | grep '<!-- Cordova Scripts 1 -->' > /dev/null )
			if (( $? != 0 ))
			then
				content=$(echo "$content" | sed 's/\(<base[^>]*>\)/\1\n\n<!-- Cordova Scripts 1 -->\n<script src="cordova.js"><\/script>\n\n/' )
			fi
			$( echo "$content" | grep '<!-- Cordova Scripts 2 -->' > /dev/null )
			if (( $? != 0 ))
			then
				content=$(echo "$content" | sed 's/\(<\/body>\)/\n\n<!-- Cordova Scripts 2 -->\n<script>document.addEventListener("deviceready", function() {if(typeof localDR == "function"){localDR();}if(typeof globalDR == "function"){globalDR();}});<\/script>\n\n\1/')
			fi
			while [[ "$content" =~ '<iframe' ]]
			do
				content=$(echo "$content" | perl -pe 's/<iframe[^>]*>.*?<\/iframe>//')
			done
			echo "$content" > "$file"
		elif [[ -d "$file" ]]
		then
			$( loop "$file" )
		fi
	done
}

dir=$( dirname "$0" )"/../www"
$( loop "$dir" )
