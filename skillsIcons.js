const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const skillIcons = {
    flutter: `${DEVICON_BASE}flutter/flutter-original.svg`,
    dart: `${DEVICON_BASE}dart/dart-original.svg`,
    javascript: `${DEVICON_BASE}javascript/javascript-original.svg`,
    js: `${DEVICON_BASE}javascript/javascript-original.svg`,
    nodejs: `${DEVICON_BASE}nodejs/nodejs-original.svg`,
    node: `${DEVICON_BASE}nodejs/nodejs-original.svg`,
    firebase: `${DEVICON_BASE}firebase/firebase-plain.svg`,
    laravel: `${DEVICON_BASE}laravel/laravel-original.svg`,
    html: `${DEVICON_BASE}html5/html5-original.svg`,
    html5: `${DEVICON_BASE}html5/html5-original.svg`,
    css: `${DEVICON_BASE}css3/css3-original.svg`,
    css3: `${DEVICON_BASE}css3/css3-original.svg`,
    git: `${DEVICON_BASE}git/git-original.svg`,
    github: `${DEVICON_BASE}github/github-original.svg`,
    mongodb: `${DEVICON_BASE}mongodb/mongodb-original.svg`,
    mysql: `${DEVICON_BASE}mysql/mysql-original.svg`,
    sqlite: `${DEVICON_BASE}sqlite/sqlite-original.svg`,
    postgresql: `${DEVICON_BASE}postgresql/postgresql-original.svg`,
    postgres: `${DEVICON_BASE}postgresql/postgresql-original.svg`,
    postman: `${DEVICON_BASE}postman/postman-original.svg`,
    react: `${DEVICON_BASE}react/react-original.svg`,
    vue: `${DEVICON_BASE}vuejs/vuejs-original.svg`,
    python: `${DEVICON_BASE}python/python-original.svg`,
    java: `${DEVICON_BASE}java/java-original.svg`,
    swift: `${DEVICON_BASE}swift/swift-original.svg`,
    kotlin: `${DEVICON_BASE}kotlin/kotlin-original.svg`,
    csharp: `${DEVICON_BASE}csharp/csharp-original.svg`,
    "c#": `${DEVICON_BASE}csharp/csharp-original.svg`,
    docker: `${DEVICON_BASE}docker/docker-original.svg`,
    kubernetes: `${DEVICON_BASE}kubernetes/kubernetes-plain.svg`,
    figma: `${DEVICON_BASE}figma/figma-original.svg`,
    vscode: `${DEVICON_BASE}vscode/vscode-original.svg`,
    typescript: `${DEVICON_BASE}typescript/typescript-original.svg`,
    ts: `${DEVICON_BASE}typescript/typescript-original.svg`,
    linux: `${DEVICON_BASE}linux/linux-original.svg`,
    android: `${DEVICON_BASE}android/android-original.svg`,
    apple: `${DEVICON_BASE}apple/apple-original.svg`,
    ios: `${DEVICON_BASE}apple/apple-original.svg`,

    // Non-Devicon fallbacks (using high-quality flat icons)
    api: 'https://cdn-icons-png.flaticon.com/128/10169/10169724.png',
    apis: 'https://cdn-icons-png.flaticon.com/128/10169/10169724.png',
    restapi: 'https://cdn-icons-png.flaticon.com/128/10169/10169724.png',
    webapi: 'https://cdn-icons-png.flaticon.com/128/10169/10169724.png',
    rest: 'https://cdn-icons-png.flaticon.com/128/10169/10169724.png',
    bloc: 'https://cdn-icons-png.flaticon.com/128/3135/3135755.png',
    solid: 'https://cdn-icons-png.flaticon.com/128/3135/3135755.png',
    patterns: 'https://cdn-icons-png.flaticon.com/128/15103/15103823.png',
    oop: 'https://cdn-icons-png.flaticon.com/128/11494/11494436.png',
    dsa: 'https://cdn-icons-png.flaticon.com/128/2103/2103633.png',
    datastructures: 'https://cdn-icons-png.flaticon.com/128/2103/2103633.png',

    // Default fallback
    default: 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png'
};

/**
 * Normalizes skill name and returns the best matching icon URL.
 * @param {string} skillName 
 * @returns {string} Icon URL
 */
export function getSkillIcon(skillName) {
    if (!skillName) return skillIcons.default;

    // Normalize: lowercase, remove spaces, dots, and common suffixes
    const normalized = skillName.toLowerCase().replace(/[\s\.]/g, '');

    // 1. Direct match
    if (skillIcons[normalized]) return skillIcons[normalized];

    // 2. Partial match (e.g. "Node JS" -> "nodejs", "Learning Flutter" -> "flutter")
    for (const key in skillIcons) {
        if (normalized.includes(key) && key !== 'default') {
            return skillIcons[key];
        }
    }

    // 3. Fallback
    return skillIcons.default;
}
