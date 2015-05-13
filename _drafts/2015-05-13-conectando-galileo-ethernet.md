---
layout: post
title: Conectando Galileo pelo ethernet
comments: true
permalink: "conectando-galileo-ethernet"
author: Gabriela Cavalcante
tags: [galileo]
---

Primeiro, voces tem que compilar e transferir o programa listado abaixo.

Ele tem um conjunto de opcoes:

> i - mostra as informações da CPU (do galileo)

> s - configura um ip fixo (192.168.0.253)

> a - lista todos os ips

> n - mostra todas as interfaces

> w - mostra o usuario atual no linux 

> d - configura um ip fixo (192.168.0.253) e inicia um servidor DHCP (isso deve resolver o problema de conectividade no Linux e fazer a conexao no Windows mais rapida, uma vez que ele nao espera a resposta)

Aqui tem um exemplo do ip que ele deu pra minha maquina (ligada diretamente na ethernet)

```
$ user@pc:~/Templates$ sudo dhclient -v eth0
Internet Systems Consortium DHCP Client 4.2.4
Copyright 2004-2012 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/a4:5d:36:2a:5f:98
Sending on   LPF/eth0/a4:5d:36:2a:5f:98
Sending on   Socket/fallback
DHCPREQUEST of 192.168.0.101 on eth0 to 255.255.255.255 port 67 (xid=0xcc9a9ac)
DHCPACK of 192.168.0.101 from 192.168.0.253     <----- aqui da de ver o ip fornecido e quem forceneu
RTNETLINK answers: File exists
bound to 192.168.0.101 -- renewal in 1510 seconds.
```

Outros exemplos de saida:

```bash
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s20f6: <BROADCAST,MULTICAST,UP,LOWER_UP8000> mtu 1500 qdisc pfifo_fast qlen 1000
    link/ether 98:4f:ee:01:e6:28 brd ff:ff:ff:ff:ff:ff
    inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6    <---- Ip que ele recebeu da rede do IMD
    inet6 fe80::9a4f:eeff:fe01:e628/64 scope link 
       valid_lft forever preferred_lft forever


1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s20f6: <BROADCAST,MULTICAST,UP,LOWER_UP8000> mtu 1500 qdisc pfifo_fast qlen 1000
    link/ether 98:4f:ee:01:e6:28 brd ff:ff:ff:ff:ff:ff
    inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6
    inet 192.168.0.253/24 scope global enp0s20f6             <---- Ip que foi adionado com o comando 's'. Podem perceber o que o IP da rede do IMD continua la
    inet6 fe80::9a4f:eeff:fe01:e628/64 scope link 
       valid_lft forever preferred_lft forever
```

Em geral acho que voces podem escrever um tutorial.

```c
char cmd;
void setup() {
  Serial.begin(9600);
}

void loop() {
  cmd = (char)Serial.read();
  switch (cmd) {
    case 'i':
      system("cat /proc/cpuinfo > /dev/ttyGS0");
      break;
    case 's':
      system("ip addr add 192.168.0.253/24 dev enp0s20f6");
      break;
    case 'a':
      system("ip addr > /dev/ttyGS0");
      break;
    case 'n':
      system("ip link > /dev/ttyGS0");
      break;
    case 'w':
      system("whoami > /dev/ttyGS0");
      break;
    case 'd':
      system("ip addr add 192.168.0.253/24 dev enp0s20f6");
      system("dhcp-server-test 2 & >/dev/null");
      break;

    default:
      break;
  }
  delay(1000);

}
```
