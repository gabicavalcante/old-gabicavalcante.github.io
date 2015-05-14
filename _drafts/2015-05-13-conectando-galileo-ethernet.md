---
layout: post
title: Conectando Galileo pelo ethernet
comments: true
permalink: "conectando-galileo-ethernet"
author: Gabriela Cavalcante
tags: [galileo]
---

Esse é um ponto muito importante quando você começa a mexer no Galileo. Existem alguns tutorias, em sua grande maioria para quem possui Windows. Aqui vai um tutorial feito com a ajuda do professor [Diomadson](https://sigaa.ufrn.br/sigaa/public/docente/portal.jsf?siape=2140683), do Instituto Metrópole Digital (UFRN).

Antes de tudo, ligue seu Galileo, conecte o cabo usb client do seu computador para a placa, conecte o cabe ethernet na placa e em seu pc. O código que vamos mostrar pode ser executador por meio da IDE do Arduino adaptada para o Galileo. Você vai perceber que quando rodar, o serial monitor vai aguardar que você digite algum parâmetro, isso acontece por que o código  tem um conjunto de opções:

> i - mostra as informações da CPU (do galileo)

> s - configura um ip fixo (192.168.0.253)

> a - lista todos os ips

> n - mostra todas as interfaces

> w - mostra o usuario atual no linux 

> d - configura um ip fixo (192.168.0.253) e inicia um servidor DHCP (isso deve resolver o problema de conectividade no Linux e fazer a conexao no Windows mais rapida, uma vez que ele não espera a resposta)

Aqui tem um exemplo do ip que ele deu pra minha maquina (ligada diretamente na ethernet):

```
$ user@pc:~/galileo$ sudo dhclient -v eth0 
Internet Systems Consortium DHCP Client 4.2.4
Copyright 2004-2012 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/90:b1:1c:f7:ec:4b
Sending on   LPF/eth0/90:b1:1c:f7:ec:4b
Sending on   Socket/fallback
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 3 (xid=0x52610d05)
DHCPREQUEST of 10.7.174.24 on eth0 to 255.255.255.255 port 67 (xid=0x52610d05)
DHCPOFFER of 10.7.174.24 from 10.7.174.1
DHCPACK of 10.7.174.24 from 10.7.174.1 <-- ip fornecido e quem forneceu 
bound to 10.7.174.24 -- renewal in 33455 seconds.
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
    inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6 <- Ip que ele recebeu da rede  
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

O código a seguir captura essas informações:

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
