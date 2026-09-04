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
const SPAN_FLAG = /--(alto|largo)$/i;
const DATE = /(?:^|[^\d])((?:19|20)\d{2})(?:[-_.]?(0[1-9]|1[0-2])(?:[-_.]?(0[1-9]|[12]\d|3[01]))?)?(?![\d])/;
const NOISE = /\b(whats?app|image|img|photo|foto|picture|pic|screenshot|captura|tela|de|at|as|pm|am|copy|copia|final|edit|editado|pxl|dsc|dcim|mvimg|burst|pano(?:rama)?|vid|mov|gopro|sam|wa\d*|\d{1,2}[.:h]\d{2}(?:[.:]\d{2})?|\d+)\b/gi;

const MONTHS = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const overrides = new Map(CAPTIONS.map((photo) => [photo.src.split('/').pop(), photo]));

const SPANS = { alto: 'tall', largo: 'wide' };

function readName(name) {
    const bare = name.replace(IMAGE, '');
    const flag = (SPAN_FLAG.exec(bare) || [])[1];
    const withoutFlag = bare.replace(SPAN_FLAG, '');

    const [stamp, year, month] = DATE.exec(withoutFlag) || [];
    const slug = (stamp ? withoutFlag.replace(stamp, ' ') : withoutFlag)
        .replace(/[_-]+/g, ' ')
        .replace(NOISE, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    let caption = slug;
    if (!caption && month) caption = `${MONTHS[Number(month) - 1]} de ${year}`;
    if (!caption && year) caption = `foto de ${year}`;
    if (!caption) caption = 'sem legenda';

    return { caption, year: year || '', month: month || '', span: SPANS[(flag || '').toLowerCase()] };
}

function fromFileName(name, raw) {
    const { caption, year, month, span } = readName(name);
    return {
        src: `${FOLDER}/${name}`,
        raw,
        alt: `Foto da família: ${caption}`,
        caption,
        year,
        month,
        span
    };
}

function sortKey(photo) {
    return `${photo.year || '0000'}-${photo.month || '00'}-${photo.src.split('/').pop()}`;
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
                const parsed = fromFileName(file.name, file.download_url);
                const curated = overrides.get(file.name);
                return { ...parsed, ...(curated || {}), raw: file.download_url };
            });

        return files.length ? sortPhotos(files) : FAMILY_PHOTOS;
    } catch (error) {
        return FAMILY_PHOTOS;
    }
}
