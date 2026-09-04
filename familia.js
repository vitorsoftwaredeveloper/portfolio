const CAPTIONS = [
    {
        src: 'media/familia/familia-completa.jpg',
        alt: 'Vitor, Morgana, Clarice e Samuel juntos em uma celebração',
        caption: 'nós quatro',
        year: '2023',
        width: 813,
        height: 1200,
        span: 'tall'
    },
    {
        src: 'media/familia/dia-das-maes.jpg',
        alt: 'Morgana e o filho segurando um vaso pintado à mão',
        caption: 'projeto feito a quatro mãos',
        year: '2024',
        width: 1200,
        height: 900,
        span: 'wide'
    },
    {
        src: 'media/familia/banho-com-o-pai.jpg',
        alt: 'Pai dando banho no bebê em uma banheira',
        caption: 'turno da noite',
        year: '2022',
        width: 766,
        height: 1200
    },
    {
        src: 'media/familia/avos-e-neto.jpg',
        alt: 'Selfie das avós sorrindo ao lado do neto',
        caption: 'as avós',
        year: '2025',
        width: 1200,
        height: 1200
    },
    {
        src: 'media/familia/descobrindo-o-mundo.jpg',
        alt: 'Criança observando plantas através de uma lupa de papel',
        caption: 'debug do jardim',
        year: '2025',
        width: 900,
        height: 1200
    },
    {
        src: 'media/familia/aquario.jpg',
        alt: 'Criança sentada em frente a um painel de luz com peixes',
        caption: 'passeio no aquário',
        year: '2025',
        width: 900,
        height: 1200
    },
    {
        src: 'media/familia/hora-do-lanche.jpg',
        alt: 'Duas crianças sentadas no chão da escola comendo',
        caption: 'hora do lanche',
        year: '2025',
        width: 900,
        height: 1200
    },
    {
        src: 'media/familia/primeiros-meses.jpg',
        alt: 'Bebê sentado na cama sorrindo para a câmera',
        caption: 'primeiros meses',
        year: '2022',
        width: 900,
        height: 1200
    }
];

const REPO = 'vitorsoftwaredeveloper/portfolio';
const FOLDER = 'media/familia';
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;
const NAMED = /^(?:(\d{4})(?:-\d{2})?[_-])?(.+?)(?:--(alto|largo))?$/;

const overrides = new Map(CAPTIONS.map((photo) => [photo.src.split('/').pop(), photo]));

const SPANS = { alto: 'tall', largo: 'wide' };

function fromFileName(name) {
    const bare = name.replace(IMAGE, '');
    const [, year, slug, flag] = NAMED.exec(bare) || [];
    const caption = (slug || bare).replace(/[_-]+/g, ' ').trim();
    return {
        src: `${FOLDER}/${name}`,
        alt: `Foto da família: ${caption}`,
        caption,
        year: year || '',
        span: SPANS[flag] || undefined
    };
}

function sortKey(photo) {
    return `${photo.year || '0000'}-${photo.src.split('/').pop()}`;
}

function sortPhotos(list) {
    return [...list].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
}

export const FAMILY_PHOTOS = sortPhotos(CAPTIONS);

export async function loadFamilyPhotos() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${FOLDER}`, {
            headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);

        const files = (await response.json())
            .filter((file) => file.type === 'file' && IMAGE.test(file.name))
            .map((file) => {
                const parsed = fromFileName(file.name);
                const curated = overrides.get(file.name);
                return { ...parsed, ...(curated || {}) };
            });

        return files.length ? sortPhotos(files) : FAMILY_PHOTOS;
    } catch (error) {
        return FAMILY_PHOTOS;
    }
}
