#!/usr/bin/env python3
"""
Script to convert CSS Modules to Tailwind CSS in React components.
This is a helper script that generates the conversion mapping.
"""

import re
import os

def convert_css_to_tailwind(css_content):
    """Convert CSS to Tailwind classes - basic mapping."""
    # This is a simplified mapping - actual conversion requires manual work
    # for complex cases
    return {}

def main():
    components = [
        "VariablesViz",
        "SharedViz",  # Only CSS exists, no component
        "ModuleEvolutionViz",
        "WebEvolutionViz",
        "ArraysBasicsViz",
        "NodeEventLoopViz",
        "CompositionViz",
        "BuildToolsEvolutionViz",
    ]
    
    base_path = "/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts"
    
    for component in components:
        css_file = os.path.join(base_path, f"{component}.module.css")
        if os.path.exists(css_file):
            with open(css_file, 'r') as f:
                content = f.read()
            print(f"\n=== {component} ===")
            print(f"Classes found: {len(re.findall(r'\\.[a-zA-Z]', content))}")

if __name__ == "__main__":
    main()
