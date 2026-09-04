# portfolio

Portfólio de Vitor Soares. HTML, CSS e JavaScript puros, sem framework e sem etapa de build.
Publicado no GitHub Pages.

A cada visita a página busca dados públicos do GitHub e se remonta com eles: lista de
repositórios, estrelas, forks, linguagens, distribuição de linguagens, números da faixa
e o último commit público no rodapé. Se a busca falhar, o site cai de volta na lista
estática de `repos.js` e continua funcionando.

## Rodando localmente

Os arquivos usam módulos ES, então precisam de um servidor HTTP (abrir o `index.html`
pelo `file://` não funciona):

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Arquivos

| arquivo | o que faz |
| --- | --- |
| `index.html` | marcação da página inteira |
| `style.css` | estilos, temas claro/escuro e responsividade |
| `main.js` | monta destaques, grade de repositórios, filtros, números e barra de linguagens |
| `gh-api.js` | busca os dados do GitHub, com cache local e fallback |
| `gh-normalize.js` | formato dos dados, compartilhado entre navegador e proxy |
| `github.js` | bloco de atividade pública no rodapé |
| `format.js` | número, data relativa e cor por linguagem |
| `repos.js` | descrições escritas à mão e categorias dos repositórios |
| `holo.js` | efeito de holograma do hero |
| `api/github.js` | proxy opcional (ver abaixo) |

As descrições de `repos.js` têm prioridade sobre as do GitHub. Repositórios que não estão
lá aparecem mesmo assim, usando a descrição do próprio GitHub e uma categoria inferida
pelos tópicos, homepage ou linguagem.

## Proxy opcional da API

Sem proxy, o navegador de cada visitante fala direto com `api.github.com`. Isso funciona,
mas a API sem autenticação permite **60 requisições por hora por IP**, e a página gasta 3
por visita. Um visitante comum nunca chega perto; vários acessos vindos do mesmo IP (rede
corporativa, um pico de tráfego, F5 repetido) podem estourar o limite. Quando isso
acontece, o site mostra o cache local ou a lista estática — não quebra, mas fica
desatualizado.

O proxy resolve isso: uma única função serverless busca tudo com um token e o CDN guarda a
resposta por 5 minutos, então a API do GitHub é chamada poucas vezes por hora
independentemente do tráfego. A página passa a fazer **1 requisição em vez de 3**.

### Deploy na Vercel

1. Importe este repositório em [vercel.com/new](https://vercel.com/new). Não há build:
   escolha o preset "Other" e deixe os comandos em branco.
2. Em *Settings → Environment Variables*, adicione:

   | variável | obrigatória | valor |
   | --- | --- | --- |
   | `GITHUB_TOKEN` | recomendada | um [fine-grained token](https://github.com/settings/personal-access-tokens/new) **sem nenhuma permissão** (só leitura pública). Eleva o limite para 5.000 req/h. |
   | `GITHUB_USER` | não | usuário a consultar. Padrão: `vitorsoftwaredeveloper`. |
   | `ALLOWED_ORIGINS` | não | origens liberadas no CORS, separadas por vírgula. Padrão: `*`. |

3. Depois do deploy, confirme que `https://SEU-PROJETO.vercel.app/api/github` devolve JSON.
4. Aponte a página para o proxy, no `<head>` do `index.html`:

   ```html
   <meta name="gh-proxy" content="https://SEU-PROJETO.vercel.app/api/github">
   ```

   Com a meta tag vazia, o proxy é ignorado e o navegador chama a API pública direto.
   Se o proxy responder erro ou estiver fora do ar, a página cai sozinha para a API
   pública — o proxy nunca é ponto único de falha.

O token só existe no servidor da Vercel; ele nunca chega ao navegador. A resposta do proxy
contém apenas dados públicos do GitHub.

## Adicionar fotos na página Inspiração

A página lista a pasta `media/familia` pela API pública do GitHub, então
basta subir o arquivo — nenhum código precisa ser editado.

Pelo navegador (no computador ou no celular): abra `media/familia`, use
**Add file → Upload files**, escolha a foto e confirme o commit. Limite de
25 MiB por arquivo e 100 arquivos por vez.

O aplicativo do GitHub não serve para isso: ele lê o repositório e edita
arquivos dentro de pull requests, mas não envia arquivos. No celular, use
o navegador em github.com — se o botão **Add file** não aparecer, peça a
versão para computador no menu do navegador.

O nome do arquivo vira a legenda:

| Arquivo | Legenda | Ano | Destaque |
| --- | --- | --- | --- |
| `2025-08_passeio-no-parque.jpg` | passeio no parque | 2025 | — |
| `2024_natal-em-familia--largo.jpg` | natal em familia | 2024 | ocupa 2 colunas |
| `primeiro-passo--alto.jpg` | primeiro passo | — | ocupa 2 linhas |

Regras: o prefixo de data (`AAAA` ou `AAAA-MM`) é opcional e define o ano;
hífens e sublinhados viram espaços; os sufixos `--largo` e `--alto`
destacam a foto no mosaico. As fotos aparecem da mais nova para a mais
antiga.

Redimensione antes de subir (1200px no maior lado, ~150 KB) para a página
continuar leve:

```
sips -Z 1200 -s formatOptions 55 foto.jpg
```

`familia.js` guarda legendas e textos alternativos escritos à mão para as
fotos antigas. O que estiver lá tem prioridade sobre o nome do arquivo, e
serve de reserva caso a API do GitHub esteja fora do ar ou no limite de
requisições.
