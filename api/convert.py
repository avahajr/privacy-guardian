import os
from bs4 import BeautifulSoup

# Directory containing the HTML files
input_dir = '/Users/ava/github/gen-ai/react-prototype/public/policies'
output_dir = '/Users/ava/github/gen-ai/react-prototype/public/policies'

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Function to wrap sentences in spans with unique ids
def wrap_sentences_in_spans(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    count = 1

    def wrap_text_in_spans(element):
        nonlocal count
        sentences = element.text.split('. ')
        new_content = ''
        for sentence in sentences:
            new_content += f'<span id="{count}">{sentence.strip()}.</span> '
            count += 1
        element.clear()
        element.append(BeautifulSoup(new_content.strip(), 'html.parser'))

    for p in soup.find_all(['p', 'li', 'td']):
        wrap_text_in_spans(p)

    return str(soup)

# Loop through all files in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith('.html'):
        # Read the HTML file
        with open(os.path.join(input_dir, filename), 'r') as f:
            html_content = f.read()

        # Process the HTML content
        new_html_content = wrap_sentences_in_spans(html_content)

        # Write the new HTML content to the same file
        with open(os.path.join(output_dir, filename), 'w') as f:
            f.write(new_html_content)