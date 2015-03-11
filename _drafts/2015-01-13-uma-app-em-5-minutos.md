---
layout: post
title: "Uma app em 5 minutos"
comments: true
permalink: "uma-app-em-5-minutos"
author: Gabriela Cavalcante
tags: [flask]
---

Pode colocar o cronômetro para começar a contar... 5 minutos. Primeiro, esse post não tem como propósito te contar detalhes de como tudo acontece. Existem ótimos materiais e vou referênciá-los a medida que fomos fazendo nossa app. Meu objetivo é mostrar como é simples, e lhe instigar a aprender mais.

Então vamos lá. Nossa app será um To Do list básico. Caso você não saiba o que é um To Do list, é basicamente uma lista de coisas para fazer, em que você adiciona uma atividade e remove quando estiver concluida. Então nossa app terá uma tela inicial com uma caixa de texto para você adicionar a task, e uma sessão que mostrará todas as atividades cadastradas, com uma opção para você removê-la.

É sempre importante entender a proposta que o Flask tem. Ele se propõem a oferecer um esqueleto, e te deixa responsável por todo o resto. Para alguns isso pode ser incrível, para outros, assustador. Isso por que o controle do que sua aplicação terá é todo seu. 

Maravilha né?! Vamos começar com o básico. Veja o código abaixo:

```python

from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
	return '<h1>Hello World!</h1>'

if __name__ == '__main__':
	app.run(debug=True)

```

Nomei seu arquivo de <code>app.py</code>, por exemplo. Abra seu terminal, entre no diretório que salvou o arquivo e digite <code>$ python app.py</code>. No seu navegador dite <a href="http://
127.0.0.1:5000/">http://127.0.0.1:5000/</a>. E Vualá. 

Rápida explicação do que foi feito neste arquivo. Toda aplicação Flask precisa criar uma instância da aplicação. É para esse objeto que o servidor web vai passar as requisições que recebem do cliente (usando um protocolo chamado WSGI). A instância da aplicação é um objeto da class Flask. É o que temos em:

```python

from flask import Flask
app = Flask(__name__)

```

Até aqui, tudo ok. Então seu web browser envia uma requisição para o web service, que por sua vez encaminha para a instância da aplicação Flask. Bem, sua aplicação precisa saber o que fazer para cada requisição URL. Por isso, teremos funções python para mapear URLs. Funcionará como uma associação entra uma URL e uma função que será responsável por realização uma ação, quando aquela URL for usada. É o que fazemos a seguir:

```python 

@app.route('/')
def index():
	return '<h1>Hello World!</h1>'

```

A instância da aplicação possui um método que carrega um web service de desenvolvimento integrado ao Flask. O que acontece nas seguintes linhas: 

```python 

if __name__ == '__main__':
	app.run(debug=True)

```

Quando fazemos <code> __name__ == '__main__' </code> estamos verificando se esse script está sendo executado diretamente. Se ele estiver sendo importado por outro arquivo, o resultado será ```False```. 

Vamos lá... Agora vamos passar para os Templates. É claro que na sua aplicação você não vai construir as página como no exemplo citado inicialmente. O que vamos fazer é criar templates e usar view function para renderizá-los. Por padrão, os templates no Flask devem ser armazenados em um diretório dentro da sua aplicação chamado <i>templates</i>. No nosso arquivo ```app.py``` faremos a seguinte modificação:

```python

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(debug=True)

```


