#!/bin/bash

# Directory containing the Markdown files
input_dir="public/policies"

# Loop through all Markdown files in the input directory
for file in "$input_dir"/*.md; do
  # Get the base name of the file (without extension)
  base_name=$(basename "$file" .md)
  # Convert the Markdown file to HTML
  markdown2 "$file" > "$input_dir/$base_name.html"
done

python api/convert.py