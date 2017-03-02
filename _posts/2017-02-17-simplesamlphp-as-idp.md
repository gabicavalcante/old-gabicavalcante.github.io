---
layout: post
title: SimpleSamlPHP as IdP
comments: true
tags: [php]
permalink: "simplesamlphp-as-idp"
author: Gabriela Cavalcante
---


Durante um estudo sobre Autenticaçao Federada, fiquei responsavel por realizar alguns testes usando o SimpleSamlPHP como um IdP. O objetivo seria testar o Keystone com Federação, usamos o [SimpleSamlPHP](https://simplesamlphp.org), uma ferramenta escrita em PHP que lida com questoes relacionadas a autenticação.

### Instalaçao e configuraçao

**OBS**: O SO do ambiente que fiz os testes é o *Ubuntu*.

Antes de começar com a instalaçao, tenha certeza que tudo esta atualizado executando os comandos:

	$ sudo apt-get update 

	$ sudo apt-get upgrade

Alguns prerequisitos precisam ser instalados:

	$ sudo apt-get install php5 apache2

Baixe o repositorio do simplesamlphp (diretorio do simplesamlphp nos meus testes foi ```~/simplesamlphp```):

	$ git clone git@github.com:simplesamlphp/simplesamlphp.git

Copie os templetes de configuração e matadata:

	$ cd simplesamlphp

	$ sudo cp -r config-templates/*.php config/

	$ sudo cp -r metadata-templates/*.php metadata/

Adicione um link do diretorio do simplesamlphp para o diretorio ```/var/www``` (para saber mais sobre o comando ```ln```, use o comando ```man ls``` no terminal):

	$ cd /var/www

	$ sudo ln -s ~/simplesamlphp .

O diretorio que precisa ser acessivel é o ```simplesamlphp/www```. Você pode expôr esse diretorio de varias formas, uma das maneiras é a que vamos usar nesse tutorial (criando um link entre o diretorio do simplesaml e o diretorio ```/var/www```), mas você também pode editar o arquivo de configuraçao do Apache e adicionar uma virtual host, como na documentaçao do [simplesamlphp](https://simplesamlphp.org/docs/stable/simplesamlphp-install#section_6).

Como criamos o link entre ```/var/www``` e ```simplesamlphp/```, vamos precisar editar o arquivo ```config/config.php```, mudando o valor de ```baseurlpath``` para '/simplesamlphp/www/'. 

Vamos precisar editar mais algumas informaçoes no arquivo ```config/config.php```, como o valor para ```auth.adminpassword```:

	'auth.adminpassword'        => 'setnewpasswordhere',

Mude também o valor de ```SecretSalt``` (uma string aleatoria usada em algumas partes do SimpleSamlPhp para gerar hash seguras). Caso você nao mude o valor default, o SimpleSaml dará um erro.

Restart o apache:

	$ sudo service apache2 restart

Você deve conseguir acessar o simplesamlphp acessando: **http://www.exemplo.com/simplesamlphp/www/**.

### Criando IdP

* Libera a funcionalidade IdP 

O primeiro passo é liberar a funcionalidade IdP, editando o arquivo ```config/config.php```. As opçoes ```enable.saml20-idp``` e ```enable.shib13-idp```, controlam tanto o SAML 2.0 quanto o Shibboleth 1.3. No nosso exemplo, basta liberar a opçao ```enable.saml20-idp```.

'enable.saml20-idp' => true

* Configure o modo de autenticaçao

O proximo passo é configurar a forma como o usuario se autentica no IdP. Existem varios modulos no diretorio ```modules/```, o que escolhemos foi o exampleauth:UserPass (autenticar o usuario usando uma lista de usernames e passwords).

	$ touch modules/exampleauth/enable

Agora devemos criar uma fonte de autenticaçao - *authentication source* -, um modulo de autenticaçao com um conjunto de configuraçoes. Cada fonte de autenticaçao tem um nome, que é usado para referenciar uma configuraçao especifica no IdP. Essa configuraçao para a fonte de autenticaçao pode ser encontrada no arquivo ```config/authsources.php```.

No nosso exemplo, o conteudo desse arquivo sera:

```php
<?php
$config = array(
    // This is a authentication source which handles admin authentication.
    'admin' => array(
        // The default is to use core:AdminPassword, but it can be replaced with
        // any authentication source.

        'core:AdminPassword',
    ),

    'example-userpass' => array(
        'exampleauth:UserPass',
        'admin:adminpass' => array(
            'uid' => array('admin'),
            'mail' => 'admin@email.com',
	        'first_name' => 'User',
	        'last_name' => 'Admin'
        ),
        'developer:developerpass' => array(
            'uid' => array('developer'),
            'mail' => 'developer@email.com',
	        'first_name' => 'User',
	        'last_name' => 'Developer'
        ),
    ),
);
```

Essa configuraçao cria dois usuarios: *admin* e *developer*, com passwords *adminpass* e *developerpass*. Os atributos para cada usuario é configurado no array referenciado por index. Por exemplo, os atributos do usuario admin:

```
array(
    'exampleauth:UserPass',
    'admin:adminpass' => array(
        'uid' => array('admin'),
        'mail' => 'admin@email.com',
        'first_name' => 'User',
        'last_name' => 'Admin'
    ),
```

...


* Configurando o IdP

O IdP é configurado por um arquivo metadada armazenado em ```metadata/saml20-idp-hosted.php```. O conteudo da configuraçao para o SAML 2.0 IdP seria:

```php
<?php
$metadata['__DYNAMIC:1__'] = array(
    /*
     * The hostname for this IdP. This makes it possible to run multiple
     * IdPs from the same configuration. '__DEFAULT__' means that this one
     * should be used by default.
     */
    'host' => '__DEFAULT__',

    /*
     * The private key and certificate to use when signing responses.
     * These are stored in the cert-directory.
     */
    'privatekey' => 'server.pem',
    'certificate' => 'server.crt',

    /*
     * The authentication source which should be used to authenticate the
     * user. This must match one of the entries in config/authsources.php.
     */
    'auth' => 'example-userpass',
);
```

* Criando self signed certificate

O SimpleSAML precisa de um certificado para as mensagens SAML. O diretorio onde essas informaçoes sao armazenadas pode ser encontrado no arquivo de configuraçao (```config/config.php```).

	'certdir' => 'cert/',

Para gerar uma private key e um certificado, execute o comando no diretorio indicado no arquivo de configuraçao:

	$ openssl req -new -x509 -days 3652 -nodes -out server.crt -keyout server.pem



* Adding SPs to the IdP

 

* Adding this IdP to other SPs



#### Fonte:

[1] http://developer.okta.com/code/php/simplesamlphp#notes-for-installing-simplesamlphp-on-mac-os-x

[2] https://simplesamlphp.org/docs/1.5/simplesamlphp-idp

[3] https://www.helloitsliam.com/2014/12/23/install-configure-and-test-simplesamlphp-for-authentication-testing/

[4] https://www.howtoforge.com/how-to-setup-single-sign-on-with-otp-using-simplesaml-php-and-privacyidea

[5] http://www.worldgoneweb.com/2013/installing-simplesamlphp-and-use-it-as-sp-and-idp-for-development-env-only/