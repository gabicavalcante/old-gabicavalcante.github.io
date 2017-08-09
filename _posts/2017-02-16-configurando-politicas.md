---
layout: post
title: Configurando Aplicação, Políticas e Papéis
comments: true
tags: [fiware]
permalink: "configurando-politicas-e-Papeis"
author: Gabriela Cavalcante
---

Vamos mostrar nesse tutorial como criar e configurar sua aplicaçao, juntamente com as politicas e papéis que ela deve ter.

#### GEs em ambiente Docker


```
idm:
    restart: always
    image: fiware/idm:v5.3.0
    ports:
        - 8000:8000
        - 5000:5000

pep-proxy:
    restart: always
    image: fiware/pep-proxy
    ports:
        - 80:80
    volumes:
        - ~/Documents/ufrn/projeto/Example-Application-Security/fiware/pep-proxy/config/config.js:/opt/fiware-pep-proxy/config.js

pdp-proxy:
    restart: always
    image: fiware/authzforce-ce-server:release-5.4.1
    container_name: azf
    ports:
      - "8080:8080"
```

#### Criando aplicação

<img src="public/create-app/01.png" />

<img src="public/create-app/02.png" />

<img src="public/create-app/03.png" />

<img src="public/create-app/04.png" />

<img src="public/create-app/05.png" />

<img src="public/create-app/06.png" />


#### Criando aplicação