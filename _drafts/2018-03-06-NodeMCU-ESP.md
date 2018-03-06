Tutorial basico com os passos para usar o NodeMCU com a Arduino IDE (escrever firmwares e carrega-los no chip). Lembrando que esse processo de carregar um novo firmware irá substituir qualquer coisa previamente armazenada na memória flash do chip, incluindo o firmware original carregado em fábrica. 

1. Com o Arduino IDE aberto, vá na janela de Preferências e digite a URL `http://arduino.esp8266.com/stable/package_esp8266com_index.json` no campo URLs Adicionais para Gerenciadores de Placas (Additional Boards Manager URLs) e selecione OK.

<img src="public/nodemcu/01.png" />

2. No menu Ferramentas (Tools) → Placa (Board) → Gerenciador de Placas (Boards Manager), pesquisa a opção: esp8266 by ESP8266 Community, e clique INSTALL

3. Pra reconhecer a portar, vai ser necessario instalar o USB Drivers. O USB to Serial UART module incluído no dispositivo, é o  Silicon Labs’ CP2102, para o qual deveremos instalar o driver Virtual COM Port (VCP). No caso de meu MAC, o arquivo criado para comunicar com o CP2102 foi:  /dev/cu.SLAB_USBtoUART. Você pode encontrar o driver apropriado ao seu computador no seguinte link: (CP210x USB to UART Bridge VCP Drivers)[https://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx]

4. Depois de restartar o Arduino IDE , poderemos selecionar a placa no menu: Option Tools → Board → NodeMCU 1.0 (ESP-12E Module). Em seguida, especificar a correta frequência de operação da CPU: (Tools → CPU Frequency: “” → 80MHz) e velocidade de comunicação (Tools → Upload Speed: “” → 115,200). Finalmente, selecionar o port apropriado ao seu computador: (Tools → Port → /dev/cu.SLAB_USBtoUART).

5. teste o blink comum ok

6. Neste ponto estamos prontos para escrever nosso próprio firmware e enviá-lo ao dispositivo, mas vamos primeiramente tentar um dos exemplos incluídos com a biblioteca: File → Examples → ESP8266WiFi → WiFiScan. Após o upload, podemos abrir a janela do Serial Monitor e observar os resultados. Verifique que 115,200 baud é a velocidade selecionada no menu do canto inferior direito do Serial Monitor.

PS: Also verify that the baud rate shown in the lower right corner of the Serial Monitor matches the value in the Serial.begin() statement in the sketch.


--- blink
imagems...

```
/**********************************************
  Blink
  Connected to pin D7 (GPIO13) ESP8266 NODEMCU
 **********************************************/

#define ledPin 13
// #define ledPin D7

void setup() 
{
  pinMode(ledPin, OUTPUT);
}

void loop() 
{
  digitalWrite(ledPin, HIGH);   
  delay(1000);              
  digitalWrite(ledPin, LOW);    
  delay(1000);             
}
```


-----


ESP 12 – Ambientes de Desenvolvimento

- Ambiente MicroPython
  - Necessita da configuração da placa para receber o firmware do (MicroPython)[https://docs.micropython.org/en/latest/esp8266/esp8266/tutorial/intro.html#intro]
  - Após a configuração é possível usar o script esptool.py para enviar novos scripts para a placa

1. pip install esptool

2. Using esptool.py you can erase the flash with the command:
```
➜  ~ esptool.py --port /dev/tty.SLAB_USBtoUART erase_flash

esptool.py v2.3.1
Connecting........_
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
Uploading stub...
Running stub...
Stub running...
Erasing flash (this may take a while)...
Chip erase completed successfully in 10.3s
Hard resetting via RTS pin...
```

Para verificar a porta usada:

    ls -l /dev/tty.*

    ls -l /dev/cu.*


```
➜  embarcados esptool.py --port /dev/tty.SLAB_USBtoUART --baud 115200 write_flash --flash_size=detect 0 esp8266-20171101-v1.9.3.bin

esptool.py v2.3.1
Connecting........_
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
Uploading stub...
Running stub...
Stub running...
Configuring flash size...
Auto-detected Flash size: 4MB
Flash params set to 0x0040
Compressed 600888 bytes to 392073...
Wrote 600888 bytes (392073 compressed) at 0x00000000 in 34.6 seconds (effective 138.8 kbit/s)...
Hash of data verified.

Leaving...
Hard resetting via RTS pin...
```

https://learn.adafruit.com/micropython-basics-how-to-load-micropython-on-a-board/serial-terminal

You might need to change the “port” setting to something else relevant for your PC. You may also need to reduce the baudrate if you get errors when flashing (eg down to 115200). The filename of the firmware should also match the file that you have.

acessa o terminal:
screen /dev/tty.SLAB_USBtoUART 115200

referencia

- https://mjrobot.org/2016/10/15/do-blink-ao-blynk/
- http://forum.arduino.cc/index.php?topic=48961.0
- ...
