https://ask.openstack.org/en/question/67846/difference-between-keystone-port-5000-and-35357/
https://www.safaribooksonline.com/library/view/identity-authentication-and/9781491941249/ch01.html
http://dolphm.com/openstack-keystone-service-catalog/
http://stackoverflow.com/questions/19004503/the-relationship-between-endpoints-regions-etc-in-keystone-openstack

Durante as atividades que tive que fazer com o Keystone, algo que sempre me gerou constantes duvidas ou um trabalho extra, foi a consulta dos conceitos que o Keystone tem. Esses conceitos sao frequêntes quando estudamos sobre Identidade, Authentication, Autorizaçao, Gerencia de Acesso... mas suas nomeclaturas podem mudar com o tempo ou de ferramenta para ferramenta, o que pode gerar uma confusao enquanto estamos desenvolvendo ou escrevendo sobre o assunto. Isso tem um peso especial para quem esta começando e se perde com frequência em paginas de documentaçoes.

Para dar uma ajudar, resolvi trazer algumas informaçoes sobre os conceitos do Keystone usando como referência um otimo artigo da [O'Reilly](https://www.safaribooksonline.com/library/view/identity-authentication-and/9781491941249/ch01.html).

Vamos ao trabalho...

- Project: Caso você nao esteja familiarizado com o conceito de Projeto, talvez fique mais claro se eu falar que inicialmente, Projetos no Keystone era conhecidos como Tenants, mas foi chamado de Project como uma forma mais intuitiva para o conceito. A ideia de Projeto no Keystone é uma abstraçao usada por OpenStack services para agrupar e isolar recursos. Esse vai ser um conceito extremamente importante no Keystone, ja que ele trabalha com a criaçao de Projetos e de controles de acesso para quem pode acessar esses Projetos. O projeto em si nao possui Users, mas Users e User Groups recebem acesso para um Project graças a uma Role atribuida a eles. A ideia da Role é dar ao User e User Groups um certo acesso a recursos do Project, ela vai especificar o tipo de acesso e capabiliries o User e User Groups tem. 

- Domain: Um problema que existia no inicio do OpenStack foi a inexistência de limites de visibilidade de Projetos para diferêntes organizaçoes de usuarios. Isso poderia gerar a colisao entre nomes de projetos de diferentes organizaçoes. Nomes de usuarios também possuiam visibilidade gloabal... e voltamos com o problema da colisao de nomes de usuarios de duas diferentes organizaçoes que usam o mesmo user name. Para resolver esse problema, e suportar multiplos 

In order for OpenStack clouds to more cleanly support multiple user organizations at the same time, Keystone added a new abstraction, called a Domain, that could provide the ability to isolate the visibility of a set of Projects and Users (and User Groups) to a specific organization. A Domain is formally defined as a collection of users, groups, and projects. Domains enable you to divide the resources in your cloud into silos that are for use by specific organizations. A domain can serve as a logical division between different portions of an enterprise, or each domain can represent completely separate enterprises.

For example, a cloud could have two domains, IBM and Acme Inc. IBM has their own collection of groups, users, and projects and so does Acme Inc.