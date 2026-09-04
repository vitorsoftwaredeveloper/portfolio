export const FRONTEND = [
    {
        name: 'HealthCar',
        kind: 'Web app',
        description:
            'O prontuário do carro: leitura do odômetro, histórico de serviços com recibo, plano de manutenção que vence por quilômetro e por tempo, e um índice de saúde do veículo.',
        stack: ['Next.js 16', 'React 19', 'TypeScript', 'React Query', 'React Hook Form', 'Zod'],
        shot: 'media/projetos/health-car.jpg',
        alt: 'Tela de entrada do HealthCar, com o formulário de login sobre fundo escuro',
        url: 'https://github.com/vitorsoftwaredeveloper/health_car',
        homepage: 'https://health-car-orpin.vercel.app',
        parts: [
            { repo: 'health_car', role: 'interface', main: true },
            { repo: 'health_car_api', role: 'API, leitura do OBD e cálculo de saúde' }
        ]
    },
    {
        name: 'Aquarela Kids',
        kind: 'Web app',
        description:
            'A rotina do berçário à pré-escola na palma da mão: agenda diária, mural de recados, avisos e financeiro. Três áreas em um só app — responsável acompanha a criança, professor lança o dia, escola cuida de turmas, mensalidades e relatórios.',
        stack: ['Next.js 16', 'React 19', 'TypeScript', 'AWS Amplify', 'Firebase', 'React Hook Form', 'Vitest'],
        shot: 'media/projetos/aquarela.jpg',
        alt: 'Página inicial do Aquarela Kids, com a agenda do dia da criança em um celular',
        url: 'https://github.com/vitorsoftwaredeveloper/aquarela_app',
        homepage: 'https://aquarela-app.vercel.app',
        parts: [
            { repo: 'aquarela_app', role: 'interface dos três perfis', main: true },
            { repo: 'aquarela_serverless', role: 'API serverless: turmas, mensalidades e pagamentos' }
        ]
    },
    {
        name: 'Resgatar',
        kind: 'Web app',
        description:
            'Versão web da comunidade Resgatar, mobile-first: leituras do dia, contribuições e feed, consumindo a mesma API do aplicativo com login pelo Cognito.',
        stack: ['Next.js 16', 'React 19', 'TypeScript', 'AWS Amplify', 'React Hook Form'],
        shot: 'media/projetos/resgatar-browser.jpg',
        alt: 'Tela de entrada do Resgatar, com versículo à esquerda e formulário de login à direita',
        url: 'https://github.com/vitorsoftwaredeveloper/resgatar-browser',
        homepage: 'https://resgatar-browser.vercel.app',
        parts: [
            { repo: 'resgatar-browser', role: 'interface web', main: true },
            { repo: 'resgatar_app', role: 'aplicativo em React Native e Expo' },
            { repo: 'resgatar_community', role: 'API, contribuições e cobranças' },
            { repo: 'resgatar-privacy-policy', role: 'política de privacidade das lojas' }
        ]
    }
];
