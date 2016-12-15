---
layout: post
title: "Como utilizar o Keyrock na autenticação da sua aplicação"
comments: true
permalink: "autenticacao-keyrock"
author: Gabriela Cavalcante
tags: [keyrock]
---

Não seria uma novidade dizer que é altamente desejado que informações, aplicativos, ou softwares sejam acessados somente por aqueles que são autorizados. Para isso, existem vários mecanismos que lidam com diferentes aspectos de segurança da informação, tais como autenticação, políticas de segurança, entre outros.

A plataforma Fiware foi projetada para considerar estes aspectos em uma abordagem security by design, onde mecanismos de segurança são fornecidos através de um componentes, também chamados de Generic Enablers (GEs), que podem ser utilizados por aplicações ou outros componentes da plataforma security-architecture.

Nesse post, vamos detalhar os passos necessários para implementar uma autenticação básica usando o Keyrock. Para os exemplos que vamos dar, usaremos a linguagem Python e o framework Flask.

A nossa aplicação terá dois componentes básicos, um componente front-end e um comente back-end. O que teremos no front-end é uma interface para interação do usuários, teremos um botão para autenticação, outra para consultar as informações do usuário, e outra para consultar um serviço do back-end. O back-end sera responsavel por retornar uma json com uma lista de nomes. Vocês podem trocar o componente back-end por uma GE, por exemplo.

#### Vamos falar sobre ambiente

Para que tudo funcione como o esperado, vamos precisar que você prepare seu ambiente. Uma sugestão que dou é utilizar uma **virtualenv**, nesse [link]() você pode ver mais detalhes sobre como instalar e utilizar.

Vamos utilizar o **Python 2.7** e **Flask 0.11.1**, caso seja necessário algum outro pacote, você pode facilmente instalar usando o **pip**, por exemplo. Além disso, vamos usar o **docker** para nos ajudar a criar e manter nosso ambiente para as GEs e para a aplicação.


###### Iniciando como o docker

Para o keyrock vamos precisar criar uma docker machine. Nesse ponto, vamos supor que o docker está funcionando corretamente na sua maquina.

Para testar, execute os comandos e verifique se as versões são exibidas corretamente.

```bash
$ docker-machine --version
$ docker-compose --version
```

Para criar uma Docker Machine:

```bash
$ docker-machine create -d virtualbox dev
```

Verifica as maquinas existentes:

```bash
docker-machine ls
```

O resultado do ultimo comando deve exibir uma lista de maquinas, e o estado da maquina que você acabou de criar é *Running*. Você precisará apontar o Docker client para a dev machine que você acabou de criar:

```bash
$ eval "$(docker-machine env dev)"
```

A partir dessa momento, o que você fizer nesse terminal, será refletido na maquina *dev*. Esta nao sera a unica maquina que utilizaremos, mas a partir de agora você ja sabe como criar novas maquina e ativa-las caso seja necessario.

#### Colocando o Keyrock no ar

Agora que temos nossa primeira maquina funcionando, vamos utilizar o docker compose para criar e executar nossos containers. Com o Compose, podemos criar um arquivo yml e definir como será o ambiente de sua aplicação e usando um único comando criaremos e iniciaremos todos os serviços definidos. [Leia mais](http://www.mundodocker.com.br/docker-compose/ target="_blank") sobre o docker compose.

No diretorio do projeto crie um arquivo *docker-compose.yml*. Sugiro que esse arquivo esteja em um diretorio especifico, separado dos outros arquivos de codigo do projeto.

O conteudo do *docker-compose.yml* é mostrado a seguir:

```yml
idm:
    restart: always
    image: fiware/idm:v5.3.0
    ports:
        - 8000:8000
        - 5000:5000 
```

Agora execute o comando no mesmo diretorio do *docker-compose.yml*:

```bash
$ docker-compose build
```

Depois que finalizar:

```bash
$ docker-compose up
```

Se você leu o conteudo que indicamos anteriormente sobre o docker compose, vai entender o que esses comandos acabaram de fazer. Resumidamente, criamos a imagem baseada na imagem fiware/idm:v5.3.0 e criamos os containers de serviços que definimos no docker-compose.yml

Se tudo estiver funcionando corretamente, você tem o keyrock rodando em sua maquina. Se o ip da maquina *dev* for por exemplo `192.168.99.100`, acesse [http://192.168.99.100:8000](http://192.168.99.100:8000 target="_blank"). Bem vindo ao portal web para administradores do Keyrock!

#### Cadastrando uma aplicação no Keyrock

O primeiro passo para implementar o processo de autenticação na aplicação, é realizar o registro da aplicação no Keyrock.

Ao acessar o endereço do Keyrock e realizar o login (*user*: idm e *password*: idm) é possível ver na tela inicial uma listagem de aplicações cadastradas e a opção para cadastro de uma nova aplicação. Para cadastrar uma nova aplicação, clique em "Register" no canto superior direito da janela de aplicações.

<img src="public/register.png" />

O cadastro é divido em três partes: o registro das informações da aplicação (nome, descrição, etc), a seleção de uma imagem de exibição, e o cadastro dos papéis e permissões associados a aplicação.

Após clicar em "Register", você vai ver uma nova página onde devem ser inseridas as informações básicas da aplicação a ser registrada.
Nessas informações estão o nome, descrição e URL da aplicação criada, assim como a Callback URL.

Após preencher essas informações, é possível selecionar uma imagem de exibição para a aplicação.

Por fim, podem ser modificados na proxima pagina, os papéis e permissões associados a aplicação sendo criada. Existirão inicialmente duas possibilidades de papéis: *provedor* e *comprador*. É possível editar as permissões de cada papel ou criar novos papéis, clicando em "New role" e escrevendo o nome do novo papel, e depois clicando em "Save".
Também é possível adicionar novas permissões clicando em "New Permission". Será necessário informar o nome da permissão, a descrição, o verbo HTTP (GET, PUT, POST, DELETE) e o recurso associado aquele permissao (se o serviço que você deseja proteger com a permissao seja um serviço localizado em http://servico.com/servico1/list, você deve cadastrar no campo resource */servico1/list*). Para nossa aplicaçao, nao sera necessario se preocupar em novas permissoes.

Depois desses passos, ao clicar em "Finish" a aplicação é criada e suas informações (definidas pelo usuário) podem ser acessadas, ao clicar na aplicação na tela inicial do IdM ou na sessão de aplicações. Nesse processo, também teremos um *Client Id* e um *Client Secret*, gerados para acesso ao IdM pela aplicação. Esse *Client Id* e um *Client Secret* serão passados no momento em que requisitamos o *access_code*.

#### Vamos ao codigo