# mackenzie_tcc_treino_facil
Treino Fácil é o nome ficticio de um APP de *academias/aulas* que foi feito como parte do TCC para o meu bacharelado em Sistemas, pela Universidade Presbiteriana Mackenzie.

Esse foi o dia que apresentamos :) <br>
Eu (meio) fui o responsável pelas apis e meus colegas pelo APP iOS + parte escrita.
![Apresentação](/images/apresentacao.jpeg)

Aqui você vai encontrar as APIs escritas em node. Elas foram construidas para rodar dentro da AWS com <a href="https://docs.aws.amazon.com/pt_br/amazondynamodb/latest/developerguide/Introduction.html">DynamoDB</a> e <a href="https://aws.amazon.com/pt/lambda/">Lambda</a>.

Na pasta [api_eventos/mock/](/api_eventos/mock) estão os dados que foram usados como massa de testes para apresentação.

# Funcionalidades

### api_aquisicao
* Cadastro
* Login
* Esqueci a senha

### api_eventos
* Gerenciamento cartão de crédito
* Gerenciamento agendamento de aulas
* Gerenciamento Estabelecimentos
* Listagem estabelecimentos baseado na GeoLocalização atual
