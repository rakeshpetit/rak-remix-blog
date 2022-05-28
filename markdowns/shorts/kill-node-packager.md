Sometimes a Node packager (Metro for RN, etc) is running and we have no clue
where it is running or how to close it. These commands will rescue you by
shutting down those processes.

Commands:

```shell
lsof -i :PORT_NUMBER (of the Node packager)
kill -9 PROCESS_ID (returned above)
```

Example:

```shell
-> lsof -i :8081


COMMAND     PID              USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node      33297 rakesharunachalam   26u  IPv6 0xc6e6916b616320d5      0t0  TCP *:sunproxyadmin (LISTEN)
node      33297 rakesharunachalam   60u  IPv6 0xc6e6916b63417e75      0t0  TCP localhost:sunproxyadmin->localhost:59796 (CLOSED)
node      33297 rakesharunachalam   64u  IPv6 0xc6e6916b63418555      0t0  TCP localhost:sunproxyadmin->localhost:59798 (CLOSED)
RNApp    80947 rakesharunachalam   28u  IPv6 0xc6e6916b6341a7b5      0t0  TCP localhost:59799->localhost:sunproxyadmin (ESTABLISHED)
RNApp    80947 rakesharunachalam   29u  IPv6 0xc6e6916b6341a7b5      0t0  TCP localhost:59799->localhost:sunproxyadmin (ESTABLISHED)
RNApp    80947 rakesharunachalam   32u  IPv6 0xc6e6916b63417795      0t0  TCP localhost:59800->localhost:sunproxyadmin (ESTABLISHED)
RNApp    80947 rakesharunachalam   33u  IPv6 0xc6e6916b63417795      0t0  TCP localhost:59800->localhost:sunproxyadmin (ESTABLISHED)

-> kill -9 33297
-> kill -9 80947
```
