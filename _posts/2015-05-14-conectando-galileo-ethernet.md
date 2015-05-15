---
layout: post
title: Criando Imagem Linux e Conectando Galileo pelo ethernet
comments: true
permalink: "conectando-galileo-ethernet"
author: Gabriela Cavalcante
tags: [galileo]
---

Esse é um ponto muito importante quando você começa a mexer no Galileo. Existem alguns tutorias disponíveis, em sua grande maioria para quem possui Windows, mas todos parecem deixar de mostrar alguma informação que no fim, impede que tudo ocorra corretamente. 

Vamos começar pela imagem. Encontrei duas opções disponíveis, a [SD-Card Linux Image](http://www.intel.com/support/galileo/sb/CS-035101.htm) e a [Iot Devkit Image](https://communities.intel.com/message/238160#238160). Bem, testei a primeira imagem, e com um simples comando dado através da IDE do Arduito (adaptada para o Galileo), ```Serial.println(system("ifconfig eth0 > /dev/ttyGS0"));```, consegui pegar o IP que a placa recebeu pelo cabo ethernet. Porém, ao usar a imagem, não consegui usar libs como o [mraa](https://github.com/intel-iot-devkit/mraa). Mesmo seguindo o processo para instalação dado na página da biblioteca, quando a importei em um exemplo em python, aconteciam erros por não achar o arquivo.

Depois dos problemas que tive, cheguei a conclusão que essa primeira imagem parecia ser mais simples, com os recursos básicos, algo enxuto... para acender e apagar um led, tive que usar escrita de arquivo. Foi então que testei a segunda imagem. Quando você baixá-la, caso esteja no Windows, pode usar o [Win32DiskImager](http://sourceforge.net/projects/win32diskimager/), no Linux, pode usar esse comando ```$ dd if=/caminho/da/imagem of=/dev/mmc```. Ele irá criar a imagem no SD Card, e duas partições serão reconhecidas quando você inserir o cartão com a imagem no pc. <explicar o pq dessas partições>

No fim, sugiro a segunda imagem. Ela facilitará nos próximos passos. Agora você precisa pegar o IP que é dado para a placa quando você conecta o cabo ethernet e acessar, já que pelo comando que citei anteriormente, não é possível pegar essas informações. Aqui vai um tutorial feito com a ajuda do professor [Diomadson](https://sigaa.ufrn.br/sigaa/public/docente/portal.jsf?siape=2140683), do Instituto Metrópole Digital (UFRN) para facilitar o processo de conexão com a placa.

Antes de tudo, ligue seu Galileo, conecte o cabo usb client do seu computador para a placa, conecte um cabo ethernet na placa e em seu pc. O código que vamos mostrar pode ser executador por meio da IDE do Arduino. Você vai perceber que quando rodar o código, o Serial Monitor vai aguardar que você digite algum parâmetro. Isso acontece por que o código tem um conjunto de opções:

> i - mostra as informações da CPU (do galileo)

> s - configura um ip fixo (192.168.0.253)

> a - lista todos os ips

> n - mostra todas as interfaces

> w - mostra o usuario atual no linux 

> d - configura um ip fixo (192.168.0.253) e inicia um servidor DHCP (isso deve resolver o problema de conectividade no Linux e fazer a conexao no Windows mais rapida, uma vez que ele não espera a resposta)

Dependendo da opção que você digite, ele vai mostrar uma determinada informação. Aqui tem um exemplo do ip que ele deu pra minha maquina (ligada diretamente na ethernet):

```
$ user@pc:~/galileo$ sudo dhclient -v eth0 
Internet Systems Consortium DHCP Client 4.2.4
Copyright 2004-2012 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/a4:5d:36:2a:5f:98
Sending on   LPF/eth0/a4:5d:36:2a:5f:98
Sending on   Socket/fallback
DHCPREQUEST of 192.168.0.101 on eth0 to 255.255.255.255 port 67 (xid=0xcc9a9ac)
DHCPACK of 192.168.0.101 from 192.168.0.253     
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
    inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6  
    inet6 fe80::9a4f:eeff:fe01:e628/64 scope link 
       valid_lft forever preferred_lft forever
```
Na linha ```inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6``` você pode ver o IP que o Galileo recebeu da rede.

```bash
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s20f6: <BROADCAST,MULTICAST,UP,LOWER_UP8000> mtu 1500 qdisc pfifo_fast qlen 1000
    link/ether 98:4f:ee:01:e6:28 brd ff:ff:ff:ff:ff:ff
    inet 10.7.14.246/22 brd 10.7.15.255 scope global enp0s20f6
    inet 192.168.0.253/24 scope global enp0s20f6  
    inet6 fe80::9a4f:eeff:fe01:e628/64 scope link  
       valid_lft forever preferred_lft forever     
```
Nessa outra saida, na linha ```inet 192.168.0.253/24 scope global enp0s20f6``` você vê o IP que foi adionado com o comando 's'. Pode perceber o que o IP da rede em que você está conectado continua lá.


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

Caso o tutorial não tenha te ajudado, pode nós mandar um email com as dúvidas. Vamos tentar te ajudar. Se você tiver achado uma forma mais simples de conectar-se com a placa, nos envie um comentário.