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
				content=$(echo "$content" | sed 's/\(<base[^>]*>\)/\1\n<!-- Cordova Scripts 1 -->\n<script src="cordova.js"><\/script>\n/' )
			fi
			$( echo "$content" | grep '<!-- Cordova Scripts 2 -->' > /dev/null )
			if (( $? != 0 ))
			then
				script='<!-- Cordova Scripts 2 --><script>document.addEventListener("deviceready", function() {if(typeof localDR == "function"){localDR();}if(typeof globalDR == "function"){globalDR();}});</script>'
				if [[ ! -z $( echo "$content" | grep "</body>") ]]
				then
					content=$(echo "$content" | sed "s#\(</body>\)#\n$script\n\1#")
				elif [[ ! -z $( echo "$content" | grep "</html>") ]]
				then
					content=$(echo "$content" | sed "s#\(</html>\)#\n$script\n\1#")
				else
					content="$content"$(printf '\n%s' "$script")
				fi
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

odir=$( dirname "$0" )"/../moroway-app-oc"
dir=$( dirname "$0" )"/../www"
rm -r "$dir"/*
cp -pr "$odir"/* "$dir"
$( loop "$dir" )
