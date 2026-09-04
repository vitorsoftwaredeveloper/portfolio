export const CATEGORIES = [
  { id: 'todos', label: 'todos' },
  { id: 'produtos', label: 'produtos' },
  { id: 'backend', label: 'back-end & cloud' },
  { id: 'qa', label: 'qa & testes' },
  { id: 'android', label: 'android' },
  { id: 'estudos', label: 'estudos' }
];

export const FEATURED = [
  {
    name: 'resgatar_community',
    kind: 'Backend serverless',
    description:
      'Back-end da comunidade Resgatar: membros, contribuições mensais, cobranças por PIX e cartão, despesas com comprovantes, balanço financeiro e notificações.',
    tags: ['TypeScript', 'AWS Lambda', 'MercadoPago', 'S3'],
    url: 'https://github.com/vitorsoftwaredeveloper/resgatar_community'
  },
  {
    name: 'resgatar_app',
    kind: 'Mobile',
    description:
      'App da comunidade em React Native e Expo: leituras litúrgicas diárias, contribuições via PIX, feed de vídeos e push notifications.',
    tags: ['React Native', 'Expo', 'TypeScript'],
    url: 'https://github.com/vitorsoftwaredeveloper/resgatar_app'
  },
  {
    name: 'resgatar-browser',
    kind: 'Web',
    description:
      'Versão web do Resgatar em Next.js 16, mobile-first, consumindo a mesma API do app com autenticação via Cognito.',
    tags: ['Next.js', 'TypeScript', 'Cognito'],
    url: 'https://github.com/vitorsoftwaredeveloper/resgatar-browser',
    homepage: 'https://resgatar-browser.vercel.app'
  },
  {
    name: 'API_community_center',
    kind: 'API REST',
    description:
      'API de centros comunitários para abrigar pessoas em calamidade: cadastro, intercâmbio de recursos entre abrigos e alerta de lotação.',
    tags: ['Node.js', 'Express', 'REST'],
    url: 'https://github.com/vitorsoftwaredeveloper/API_community_center'
  },
  {
    name: 'automation-test-hgtx',
    kind: 'QA',
    description:
      'Suíte de testes ponta a ponta em Cypress para a plataforma HGTX, com credenciais isoladas por variáveis de ambiente.',
    tags: ['Cypress', 'E2E', 'JavaScript'],
    url: 'https://github.com/vitorsoftwaredeveloper/automation-test-hgtx'
  }
];

export const REPOS = [
  {
    name: 'aquarela_app',
    category: 'produtos',
    language: 'TypeScript',
    description:
      'Interface do Aquarela Kids em três perfis: responsável acompanha agenda, mural e financeiro; professor lança o dia da turma; escola cuida de matrículas, mensalidades e relatórios.',
    url: 'https://github.com/vitorsoftwaredeveloper/aquarela_app',
    homepage: 'https://aquarela-app.vercel.app'
  },
  {
    name: 'aquarela_serverless',
    category: 'backend',
    language: 'TypeScript',
    description:
      'API serverless do Aquarela Kids: agendas, avisos, turmas e professores, com mensalidades, despesas e pagamentos por MercadoPago sobre MongoDB.',
    url: 'https://github.com/vitorsoftwaredeveloper/aquarela_serverless'
  },
  {
    name: 'funchat',
    category: 'produtos',
    language: 'JavaScript',
    description:
      'Chat em tempo real com Express e Socket.io, envio de imagens e gravação de áudio direto no navegador.',
    url: 'https://github.com/vitorsoftwaredeveloper/funchat',
    homepage: 'https://funchat-jwip.onrender.com/'
  },
  {
    name: 'portfolio',
    category: 'produtos',
    language: 'JavaScript',
    description: 'Este site. Portfólio estático em HTML, CSS e JavaScript, sem framework e sem etapa de build.',
    url: 'https://github.com/vitorsoftwaredeveloper/portfolio'
  },
  {
    name: 'resgatar-privacy-policy',
    category: 'produtos',
    language: 'HTML',
    description: 'Página de política de privacidade do Resgatar, publicada como exigência das lojas de aplicativos.',
    url: 'https://github.com/vitorsoftwaredeveloper/resgatar-privacy-policy'
  },
  {
    name: 'SAM_poc',
    category: 'backend',
    language: 'TypeScript',
    description:
      'Prova de conceito do AWS SAM: empacotamento com esbuild nativo e controle explícito dos recursos provisionados.',
    url: 'https://github.com/vitorsoftwaredeveloper/SAM_poc'
  },
  {
    name: 'serverless_trainning',
    category: 'backend',
    language: 'JavaScript',
    description:
      'Laboratório serverless em cinco aulas: credenciais AWS, Lambda sem framework, Serverless Framework, análise de imagens e LocalStack.',
    url: 'https://github.com/vitorsoftwaredeveloper/serverless_trainning'
  },
  {
    name: 'webhook-express-payments',
    category: 'backend',
    language: 'JavaScript',
    description: 'Servidor Express que recebe e dispara webhooks de pagamento, persistindo os eventos no MongoDB.',
    url: 'https://github.com/vitorsoftwaredeveloper/webhook-express-payments'
  },
  {
    name: 'library-nodejs-test',
    category: 'backend',
    language: 'JavaScript',
    description:
      'API de livraria com Express, Knex e SQLite: livros, autores, editoras, usuários e aluguel, com envio de e-mail.',
    url: 'https://github.com/vitorsoftwaredeveloper/library-nodejs-test'
  },
  {
    name: '2969-workflow-dev-inicial',
    category: 'qa',
    language: 'JavaScript',
    fork: true,
    description:
      'API de livraria usada para praticar workflow de dev: GitHub Actions em pre-push e pull request, Docker Compose e feature flags com Unleash.',
    url: 'https://github.com/vitorsoftwaredeveloper/2969-workflow-dev-inicial'
  },
  {
    name: 'LearningNodeJs',
    category: 'estudos',
    language: 'JavaScript',
    description: 'Anotações e exercícios de Node.js organizados por capítulo, do básico até os módulos internos.',
    url: 'https://github.com/vitorsoftwaredeveloper/LearningNodeJs'
  },
  {
    name: 'nodejs-perfomance-cpu',
    category: 'estudos',
    language: 'JavaScript',
    fork: true,
    description: 'Laboratório de profiling de CPU em Node.js, medindo carga com autocannon e lendo o perfil no cpupro.',
    url: 'https://github.com/vitorsoftwaredeveloper/nodejs-perfomance-cpu'
  },
  {
    name: 'GoLang',
    category: 'estudos',
    language: 'Go',
    description:
      'Fundamentos de Go em pastas por tema: variáveis e tipos, structs, ponteiros, funções, erros, goroutines e channels.',
    url: 'https://github.com/vitorsoftwaredeveloper/GoLang'
  },
  {
    name: 'go',
    category: 'estudos',
    language: 'Go',
    description: 'Primeiros exercícios em Go, com o código de estudo concentrado em src.',
    url: 'https://github.com/vitorsoftwaredeveloper/go'
  },
  {
    name: 'superheroes',
    category: 'android',
    language: 'Kotlin',
    description: 'Lista de super-heróis em Jetpack Compose, com tema claro e escuro sobre Material 3.',
    url: 'https://github.com/vitorsoftwaredeveloper/superheroes'
  },
  {
    name: 'woof',
    category: 'android',
    language: 'Kotlin',
    description: 'Lista de cães com nome, idade e atividade favorita, exercitando componentes e cores do Material 3.',
    url: 'https://github.com/vitorsoftwaredeveloper/woof'
  },
  {
    name: 'appCourses',
    category: 'android',
    language: 'Kotlin',
    description: 'Grade de temas de cursos em Compose, cada item com imagem, nome e número de cursos relacionados.',
    url: 'https://github.com/vitorsoftwaredeveloper/appCourses'
  },
  {
    name: 'ArtGallery',
    category: 'android',
    language: 'Kotlin',
    description: 'Galeria de obras navegável por botões, praticando estado com MutableState e layout em Compose.',
    url: 'https://github.com/vitorsoftwaredeveloper/ArtGallery'
  },
  {
    name: 'basic-android-kotlin-compose-training-affirmations',
    category: 'android',
    language: 'Kotlin',
    fork: true,
    description: 'Lista rolável de cards de afirmações, exercício de listas e imagens em Jetpack Compose.',
    url: 'https://github.com/vitorsoftwaredeveloper/basic-android-kotlin-compose-training-affirmations'
  },
  {
    name: 'basic-android-kotlin-compose-training-dessert-clicker',
    category: 'android',
    language: 'Kotlin',
    fork: true,
    description: 'Jogo de clique em sobremesas usado para explorar o ciclo de vida do Android e os logs do Logcat.',
    url: 'https://github.com/vitorsoftwaredeveloper/basic-android-kotlin-compose-training-dessert-clicker'
  },
  {
    name: 'Lemonade',
    category: 'android',
    language: 'Kotlin',
    description: 'App de toques em sequência que monta uma limonada, exercitando mudança de estado entre telas.',
    url: 'https://github.com/vitorsoftwaredeveloper/Lemonade'
  },
  {
    name: 'FirstButton',
    category: 'android',
    language: 'Kotlin',
    description: 'Dice Roller: sorteia um dado ao toque do botão e mostra o resultado em um Image composable.',
    url: 'https://github.com/vitorsoftwaredeveloper/FirstButton'
  },
  {
    name: 'aboutMe',
    category: 'android',
    language: 'Kotlin',
    description: 'Cartão de visita digital em Compose, com foto, nome, cargo e lista de contatos.',
    url: 'https://github.com/vitorsoftwaredeveloper/aboutMe'
  },
  {
    name: 'Learn-Together',
    category: 'android',
    language: 'Kotlin',
    description: 'Tela de tutorial de Jetpack Compose montada a partir de recursos de string e imagem.',
    url: 'https://github.com/vitorsoftwaredeveloper/Learn-Together'
  },
  {
    name: 'Quadrants',
    category: 'android',
    language: 'Kotlin',
    description: 'Tela dividida em quatro quadrantes, cada um descrevendo uma função Composable diferente.',
    url: 'https://github.com/vitorsoftwaredeveloper/Quadrants'
  },
  {
    name: 'happy-birthday-card',
    category: 'android',
    language: 'Kotlin',
    description: 'Cartão de aniversário com texto sobreposto à imagem, primeiro exercício de layout em Compose.',
    url: 'https://github.com/vitorsoftwaredeveloper/happy-birthday-card'
  }
];
