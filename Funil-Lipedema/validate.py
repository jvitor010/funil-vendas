from html.parser import HTMLParser
import sys

class StackParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in self.void_elements:
            return
        if not self.stack:
            self.errors.append(f"Line {self.getpos()[0]}: Unexpected closing tag </{tag}> without an open tag.")
            return
        
        expected_tag, pos = self.stack.pop()
        if expected_tag != tag:
            self.errors.append(f"Line {self.getpos()[0]}: Mismatched closing tag. Expected </{expected_tag}> (opened at line {pos[0]}), got </{tag}>.")
            # Assume the expected tag was just missing a close and keep matching the current tag
            while self.stack and self.stack[-1][0] != tag:
                self.stack.pop()
            if self.stack:
                self.stack.pop() # pop the matching tag

    def close(self):
        super().close()
        for tag, pos in self.stack:
            self.errors.append(f"Line {pos[0]}: Unclosed tag <{tag}>.")

def validate_html(filepath):
    parser = StackParser()
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    parser.feed(content)
    parser.close()
    if parser.errors:
        print(f"Errors in {filepath}:")
        for err in parser.errors:
            print("  - " + err)
    else:
        print(f"{filepath} is structurally balanced.")

validate_html(r"c:\Users\Clara\Desktop\Marketing JV\Lipedema\Funil-Lipedema\index.html")
validate_html(r"c:\Users\Clara\Desktop\Marketing JV\Lipedema\Funil-Lipedema\landing.html")
