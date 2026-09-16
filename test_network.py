import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

try:
    with urllib.request.urlopen("https://www.google.com") as response:
        print("Google Success:", response.status)
except Exception as e:
    print("Google Error:", e)
