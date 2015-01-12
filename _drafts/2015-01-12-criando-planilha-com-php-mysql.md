---
layout: post
title: Criando planilha com PHP + MySQL
comments: true
permalink: "criando-planilha-com-php-mysql"
autor: Gabriela Cavalcante
---

Existem alguns scripts básicos, mas extremamente úteis, que te tiram de certos sufocos. Necessitei de um deles nos últimos dias, e imagino que outras pessoas em algum momento também vão necessitar. Precisei criar um relatório com base em dados existentes em um banco mysql, e pra isso usei o php. Então, aqui vai como fiz...

É importante que inicialmente exista a conexão com o banco de dados e a seleção dos dados que serão colocados no relatório gerado. Em uma situação em que, por exemplo, seu banco guarda os dados de inscritos e seu relatório precisa conter essas informações, nós podemos ter:

```php
<?php    

// Dados do banco de dados
$host = "host";       
$banco = "evento";      // nome do banco     
$usuario = "admin";     // seu usuário      
$senha = "admin";       // senha do banco
$tabela = "inscritos";  // tabela 
$campos  = "nome, cpf, modo_pg, data_inscricao"; // campos da tabela              

// Abrindo conexão    
$conexao = mysql_connect($host, $usuario, $senha);  

mysql_select_db($banco, $conexao);     

// Seleção de dados para o relatório 
$sql = "SELECT $campos FROM $tabela";  
// Executando a query SQL no banco de dados            
$query = mysql_query($sql, $conexao);  
// Transformando os dados em um array
$inscritos = mysql_fetch_assoc($query);
// Calculando quantos dados retornaram   
$rows_users = mysql_num_rows($query);  

?>  
```
Agora você pode iniciar a criação da tabela, começando pelo cabeçalho:

```php
<?php  
$html = '';  
$html .= '<table border="1">';  
$html .= '<tr>';  
   
$html .= '<td align="center"><b>NOME</b></td>';  
$html .= '<td align="center"><b>CPF</b></td>';   
$html .= '<td align="center"><b>MODO DE PAGAMENTO</b></td>';  
$html .= '<td align="center"><b>DATA</b></td>';  
  
$html .= '</tr>';  
?>  
```

O restante do relatório consiste no conteúdo dos inscritos, então o laço responsável por capturar essas informações e representar na tabela fica da seguinte forma:

```php
<?php  
do {  
      
// dados dos inscritos  
$nome =  $inscritos["nome"];
$cpf =  $inscritos["cpf"]; 
$modo_pg =  $inscritos["modo_pg"];  
$data =  $inscritos["data_notificacao"];  
 
$html .= '<tr>';  

// representando os dados de cada inscrito
$html .= '<td align="center">'.$nome.'</td>';  
$html .= '<td align="center">'.$cpf.'</td>';   
$html .= '<td align="center">'.$modo_pg.'</td>'; 
$html .= '<td align="center">'.$data.'</td>';  
  
$html .= '</tr>';  
  
} while ($inscritos = mysql_fetch_array($query));
// retorna a linha de consulta até que a condição seja falsa. 
?>  
```

Por fim, definimos o nome do arquivo, fechamos nossa tag table, e configuramos o header.

```php
<?php  
// Definimos o nome do arquivo que será exportado  
$arquivo = 'inscritos.xls';  
   
$html .= '</table>';  
  
// Configurações header para forçar o download   
header ("Cache-Control: no-cache, must-revalidate");  
header ("Pragma: no-cache");  
header ("Content-type: application/x-msexcel");  
header ("Content-Disposition: attachment; filename=\"{$arquivo}\"" );
header ("Content-Description: PHP Generated Data" );  
  
// Envia o conteúdo do arquivo  
echo $html;  
exit;  

?>  
```

Pronto... sua tabela estará criada com os dados que tem no banco. Deu para ver que não é nada de outro mundo. Espero ter ajudado. Até mais!