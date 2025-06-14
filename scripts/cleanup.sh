#!/bin/bash

dir="$(dirname "$0")/../www"
rm -r "$dir"/*
echo "www-dir content is auto-generated from moroway-app-oc subdir" >"$dir"/README.md
