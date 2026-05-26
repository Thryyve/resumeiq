import os
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

# Folders or files you want to ignore (like node_modules)
IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', '__pycache__', '.env'}
IGNORE_FILES = {'package-lock.json', 'yarn.lock', 'xml_packer.py', 'project_code.xml'}

def build_xml():
    root = ET.Element("project")
    
    for dirpath, dirnames, filenames in os.walk('.'):
        # Filter out ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        
        for filename in filenames:
            if filename in IGNORE_FILES:
                continue
                
            file_path = os.path.relpath(os.path.join(dirpath, filename), '.')
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Create XML elements for the file
                file_element = ET.SubElement(root, "file")
                path_element = ET.SubElement(file_element, "path")
                path_element.text = file_path
                
                content_element = ET.SubElement(file_element, "content")
                # Using a safe format that acts like a CDATA block when read
                content_element.text = f"<![CDATA[\n{content}\n]]>"
                
            except Exception as e:
                # Skip binary files like images or PDFs that can't be read as text
                print(f"Skipping binary or unreadable file: {file_path}")

    # Write to the final XML file
    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ", level=0) # Pretty print the XML
    tree.write("project_code.xml", encoding="utf-8", xml_declaration=True)
    print("Successfully created project_code.xml!")

if __name__ == "__main__":
    build_xml()