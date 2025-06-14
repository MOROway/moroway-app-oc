#!/bin/bash

dir="$(dirname "$0")/../platforms/android/app/"
cd "$dir" || exit 1
printf "%s\n" "android {" "buildTypes {" "debug {" 'applicationIdSuffix ".test"' "}" "}" "}" >build-extras.gradle
