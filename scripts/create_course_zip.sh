#!/bin/bash

# Creates a zip file from a directory without an extra top-level directory.
# The zip will contain the contents of the directory directly at the root.
#
# Usage: ./create_course_zip.sh <directory>
#
# Output: ./generated_zips/<directory_name>.zip

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <directory>"
    echo "Creates a zip file from the directory contents"
    exit 1
fi

mkdir -p ./generated_zips

SOURCE_DIR="$1"

# Remove trailing slash if present
SOURCE_DIR="${SOURCE_DIR%/}"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: '$SOURCE_DIR' is not a directory"
    exit 1
fi

# Get the directory name for the zip filename
DIR_NAME=$(basename "$SOURCE_DIR")
OUTPUT_DIR="./generated_zips"
OUTPUT_FILE="$OUTPUT_DIR/$DIR_NAME.zip"

# Remove existing zip if present
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing zip: $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# Create the zip by cd-ing into the directory and zipping contents
# This avoids the extra top-level directory problem
echo "Creating zip from: $SOURCE_DIR"
echo "Output: $OUTPUT_FILE"

SCRIPT_DIR="$(pwd)"
(cd "$SOURCE_DIR" && zip -r "$SCRIPT_DIR/$OUTPUT_FILE" .)

echo "Done! Created: $OUTPUT_FILE"
