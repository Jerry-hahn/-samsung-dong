import xml.etree.ElementTree as ET

tree = ET.parse("seoul_simple.svg")
root = tree.getroot()

districts = []
for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
    districts.append(path.get('id'))

print("Found", len(districts), "districts:")
print(", ".join(sorted(districts)))
