import socket

for host in ["m.land.naver.com", "new.land.naver.com", "land.naver.com", "www.naver.com"]:
    try:
        ip = socket.gethostbyname(host)
        print(f"{host} -> {ip}")
    except Exception as e:
        print(f"Failed to resolve {host}: {e}")
