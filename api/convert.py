import os
from bs4 import BeautifulSoup

# Directory containing the HTML files
input_dir = '/Users/ava/github/privacy-guardian/public/policies'
output_dir = '/Users/ava/github/privacy-guardian/public/policies'

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Function to wrap sentences in spans with unique ids
def process_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    count = 1

    def wrap_text_in_spans(element):
        nonlocal count
        sentences = element.text.split('. ')
        new_content = ''
        for sentence in sentences:
            new_content += f'<span id="{count}">{sentence.strip()}</span> '
            count += 1
        element.clear()
        element.append(BeautifulSoup(new_content.strip(), 'html.parser'))

    for p in soup.find_all(['p', 'li', 'td']):
        wrap_text_in_spans(p)
        p['class'] = p.get('class', []) + ['mb-2']


    for li in soup.find_all('li'):
        li['class'] = li.get('class', []) + ['list-disc']

    for h1 in soup.find_all('h1'):
        h1['class'] = h1.get('class', []) + ['text-2xl', 'font-medium', 'mb-4']
    for h2 in soup.find_all('h2'):
        h2['class'] = h2.get('class', []) + ['text-xl', 'font-medium', 'my-4']

    for h3 in soup.find_all('h3'):
        h3['class'] = h3.get('class', []) + ['text-lg', 'font-medium', 'my-4']

    for h4 in soup.find_all('h4'):
        h4['class'] = h4.get('class', []) + ['text-base', 'font-medium', 'my-4']

    return str(soup)


if __name__ == '__main__':
    print("Starting conversion...")
    # Loop through all files in the input directory
    for filename in os.listdir(input_dir):
        if filename.endswith('.html'):
            print(f"Processing {filename}")
            # Read the HTML file
            with open(os.path.join(input_dir, filename), 'r') as f:
                html_content = f.read()

            # Process the HTML content
            new_html_content = process_html(html_content)

            # Write the new HTML content to the same file
            with open(os.path.join(output_dir, filename), 'w') as f:
                f.write(new_html_content)