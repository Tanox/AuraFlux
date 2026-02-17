/**
 * File: app/locales/pt-BR.ts
 * Version: v1.9.36
 * Author: Sut
 * Description: Portuguese (Brazil) translations.
 */

import { LyricsStyle, VisualizerMode } from '../../types';
import { COLOR_THEMES } from '../../constants';

// --- Helper for creating theme names, directly from constants for now ---
const THEME_NAMES = ["Vaporwave", "Aurora", "Sunset", "Cotton Candy", "Electric", "Neon", "Matrix", "Gold", "Royal", "Solar", "Ocean", "Cyber", "Sakura", "Arctic", "Desert", "Voltage", "Emerald", "Cyanide"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_, i) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const ptBR = {
  // --- Global / Common strings ---
  common: {
    queue: "Fila",
    empty: "Vazia",
    clearAll: "Limpar Tudo",
    confirmClear: "Tem certeza que deseja limpar a playlist?",
    updateAvailable: "Nova atualização detectada",
    updateAction: "Atualizar Agora",
    dropFiles: "SOLTE PARA IMPORTAR",
    unknownTrack: "Faixa Desconhecida",
    unknownArtist: "Artista Desconhecido",
    track: "Faixa",
    artist: "Artista",
    loading: "Carregando",
    processing: "Processando",
    simple: "Simples",
    advanced: "Avançado",
    active: "Faixas",
  },

  // --- App Version & Info ---
  appVersion: "v1.9.36",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Inteligência Sinestésica",
  startExperience: "INICIALIZAR SISTEMA",

  // --- Onboarding ---
  onboarding: {
    welcome: "Bem-vindo",
    subtitle: "Vamos configurar sua experiência Aura Flux",
    selectLanguage: "Selecione seu idioma preferido",
    next: "Próximo",
    back: "Voltar",
    finish: "Concluir",
    features: {
      title: "Desbloqueie sua Experiência Aura Flux",
      visuals: {
        title: "Visuais Dinâmicos",
        desc: "Transforme seu áudio em arte generativa deslumbrante em tempo real com visualizadores 2D e 3D."
      },
      ai: {
        title: "Sinestesia AI",
        desc: "Obtenha identificação de músicas em tempo real, análise de humor e recomendações visuais inteligentes com Gemini 3.0."
      },
      privacy: {
        title: "Privacidade Primeiro",
        desc: "O processamento de áudio acontece no seu dispositivo. As solicitações de IA são mínimas, anônimas e seguras."
      }
    },
    shortcuts: {
      title: "Domine o Fluxo",
      desc: "Navegue e controle rapidamente sua experiência com atalhos intuitivos.",
    },
    sections: {
      essentials: "Essenciais",
      visual: "Controles Visuais",
      advanced: "Recursos Avançados",
    }
  },

  // --- Controls / Tabs ---
  tabs: {
    visual: "Visuais",
    input: "Entrada de Áudio",
    playback: "Reprodução",
    text: "Sobreposição de Texto",
    studio: "Estúdio",
    system: "Sistema",
  },

  // --- Visual Panel ---
  visualPanel: {
    display: "Qualidade de Exibição",
    aiBg: "Fundo IA",
    generateBg: "Forjar Arte IA",
    regenerate: "Reforjar Arte",
    showBg: "Mostrar Fundo IA",
    opacity: "Opacidade",
    bgGenerated: "Fundo IA Gerado",
  },

  // --- Audio Panel ---
  audioPanel: {
    audioInput: "Arquitetura de Sinal",
    mic: "Microfone",
    defaultMic: "Microfone Padrão",
    start: "INICIAR CAPTURA",
    stop: "PARAR CAPTURA",
    fileActive: "TRANSMISSÃO ATIVA",
    analysisAi: "Motor Neural",
    enableAi: "Análise ao Vivo",
    apiKey: "Chave API Gemini",
    apiKeyPlaceholder: "Chave Gemini...",
    saved: "PRONTO",
    update: "ATUALIZAR",
    keyVerified: "Chave Verificada e Salva",
    keyCleared: "Chave da API Limpa",
    keyInvalid: "Chave de API Gemini Inválida",
    aiDirector: "Diretor Automático IA",
    analyzing: "Analisando...",
    recognitionSource: "Protocolo IA",
    save: "SALVAR",
  },

  // --- Player Panel ---
  player: {
    nowPlaying: "Tocando Agora",
    playlistTitle: "Playlist",
    noActiveTrack: "Nenhuma Faixa Ativa",
    add: "Arquivos Locais",
    addUrl: "Link IA",
    urlPlaceholder: "Cole URL ou Link de Playlist...",
    supportInfo: "Suporta MP3, WAV, FLAC, OGG e Plataformas de Streaming Populares (Powered by AI)",
    import: "Importado",
    importing: "IA Analisando Playlist...",
    bg: "Fundo da Arte do Álbum",
    cover: "Sobreposição de Info",
    blur: "Desfoque",
    info: "Meta Informações",
  },

  // --- Custom Text Panel ---
  textPanel: {
    overlay: "Configuração da Camada de Texto",
    appearance: "Estilo e Tipografia",
  },

  // --- System Panel ---
  systemPanel: {
    localization: "Estética e Idioma",
    darkMode: "Modo Escuro",
    lightMode: "Modo Claro",
    uiMode: "Modo UI",
    interface: "Sistema e Comportamento",
    installApp: "Instalar App Aura Flux",
    factoryReset: "Restaurar Configurações de Fábrica",
  },

  // --- Global Settings / Shared ---
  sensitivity: "Ganho",
  speed: "Velocidade",
  smoothing: "Inércia",
  glow: "Brilho",
  trails: "Rastro",
  autoRotate: "Ciclo Automático",
  cycleColors: "Ciclo de Cores",
  hideCursor: "Ocultar Cursor",
  fftSize: "Tamanho FFT",
  quality: "Qualidade",
  monitor: "Monitor",
  wakeLock: "Manter Tela Ligada",
  showFps: "Mostrar FPS",
  showTooltips: "Mostrar Dicas",
  doubleClickFullscreen: "Duplo Clique Tela Cheia",
  autoHideUi: "Ocultar UI Automaticamente",
  mirrorDisplay: "Espelhar Exibição",
  language: "Idioma",
  region: "Região",
  visualizerMode: "Modo Visualizador",
  styleTheme: "Tema de Estilo",
  recognitionSource: "Protocolo IA",
  showLyrics: "Exibir Letra",
  lyricsStyle: "Estilo da Letra",
  lyricsPosition: "Posição da Âncora",
  textFont: "Fonte",
  textSize: "Tamanho",
  textRotation: "Rotação",
  textAudioReactive: "Pulso",
  text3D: "Efeito 3D",
  customColor: "Croma Dinâmico",
  customText: "Camada de Texto",
  customTextPlaceholder: "DIGITE O TEXTO",
  textSource: "Fonte de Conteúdo",
  showOptions: "Mostrar Controles",
  hideOptions: "Ocultar Controles",
  randomize: "Aleatório",

  // --- Placeholders for dynamic lists / Enums ---
  modes: {
    [VisualizerMode.PLASMA]: "Fluxo de Plasma",
    [VisualizerMode.BARS]: "Barras de Espectro",
    [VisualizerMode.DIGITAL_GRID]: "Grade Digital",
    [VisualizerMode.SILK_WAVE]: "Seda Lumina",
    [VisualizerMode.OCEAN_WAVE]: "Ondas do Oceano",
    [VisualizerMode.PARTICLES]: "Campo Estelar",
    [VisualizerMode.TUNNEL]: "Túnel de Dobra",
    [VisualizerMode.RINGS]: "Anéis de Ressonância",
    [VisualizerMode.LASERS]: "Feixes de Laser",
    [VisualizerMode.FLUID_CURVES]: "Curvas Fluidas",
    [VisualizerMode.WAVEFORM]: "Fitas Espectrais",
    [VisualizerMode.NEBULA]: "Nebulosa Cósmica",
    [VisualizerMode.RIPPLES]: "Ondulações Concêntricas",
    [VisualizerMode.SPIRAL]: "Espiral Logarítmica",
    [VisualizerMode.NEURAL_FLOW]: "Fluxo Neural",
    [VisualizerMode.CUBE_FIELD]: "Campo de Cubos",
    [VisualizerMode.KINETIC_WALL]: "Parede Cinética",
    [VisualizerMode.RESONANCE_ORB]: "Orbe de Ressonância",
  },
  modeDescriptions: {
    [VisualizerMode.PLASMA]: "Campos de energia fluidos e hipnóticos com mistura de cores vibrantes.",
    [VisualizerMode.BARS]: "Barras clássicas de espectro de áudio, reagindo dinamicamente às frequências.",
    [VisualizerMode.DIGITAL_GRID]: "Uma grade digital 3D imersiva, reagindo com pulsos de luz.",
    [VisualizerMode.SILK_WAVE]: "Fitas fluidas e brilhantes que ondulam com a energia do áudio.",
    [VisualizerMode.OCEAN_WAVE]: "Um terreno estilizado de ondas, visualizando o histórico de áudio.",
    [VisualizerMode.PARTICLES]: "Um campo estelar dinâmico ou nuvem de partículas, reagindo a altas frequências.",
    [VisualizerMode.TUNNEL]: "Um túnel geométrico pulsante, criando uma sensação de velocidade de dobra.",
    [VisualizerMode.RINGS]: "Anéis concêntricos expandindo e contraindo com picos de áudio.",
    [VisualizerMode.LASERS]: "Feixes de laser nítidos e vibrantes cortando o espaço visual.",
    [VisualizerMode.FLUID_CURVES]: "Curvas suaves e fluidas que mudam e se transformam com o som.",
    [VisualizerMode.WAVEFORM]: "Formas de onda abstratas criando fitas espectrais na tela.",
    [VisualizerMode.NEBULA]: "Uma nuvem suave e em evolução de gás e poeira, ambiental e reativa.",
    [VisualizerMode.RIPPLES]: "Ondulações circulares em expansão, emanando do centro nas batidas.",
    [VisualizerMode.SPIRAL]: "Uma espiral logarítmica de partículas, reagindo a mudanças de frequência.",
    [VisualizerMode.NEURAL_FLOW]: "Linhas complexas e interconectadas formando uma rede fluida e orgânica.",
    [VisualizerMode.CUBE_FIELD]: "Um campo de cubos brilhantes que animam e mudam de tamanho com a música.",
    [VisualizerMode.KINETIC_WALL]: "Uma parede dinâmica de elementos que empurram e puxam em resposta ao áudio.",
    [VisualizerMode.RESONANCE_ORB]: "Uma esfera central que transforma sua superfície com base na entrada de áudio.",
  },

  lyricsStyles: {
    [LyricsStyle.STANDARD]: "Padrão",
    [LyricsStyle.KARAOKE]: "Karaokê",
    [LyricsStyle.MINIMAL]: "Mínimo",
  },

  themes: getThemeLabels(),

  aiProviders: {
    GEMINI: "Gemini 3.0 (Google)",
    OPENAI: "GPT-4o (OpenAI)",
    GROQ: "Groq (Personalizado)",
    CLAUDE: "Claude (Anthropic)",
    DEEPSEEK: "DeepSeek",
    QWEN: "Qwen (Alibaba Cloud)",
    MOCK: "Simulação Local (Dev)",
  },

  regions: {
    global: "Global",
    US: "Estados Unidos",
    CN: "China",
    JP: "Japão",
    KR: "Coreia",
    EU: "Europa",
    LATAM: "América Latina",
  },

  textSources: {
    auto: "Auto",
    custom: "Manual",
    song: "Música",
    clock: "Relógio",
  },

  fonts: {
    default: "Inter (Padrão)",
    system: "Interface do Sistema",
    mono: "JetBrains Mono",
    modern: "Montserrat",
    heavy: "Oswald",
    elegant: "Playfair Display",
    retro: "Courier New",
    serif: "Times New Roman",
    custom: "Personalizado...",
  },

  positions: {
    tl: "Superior Esquerdo", tc: "Superior Centro", tr: "Superior Direito",
    ml: "Meio Esquerdo", mc: "Meio Centro", mr: "Meio Direito",
    bl: "Inferior Esquerdo", bc: "Inferior Centro", br: "Inferior Direito",
  },

  presets: {
    title: "Motor de Atmosfera",
    hint: "Predefinições Visuais",
    select: "Escolha um clima...",
    all_modes: "Todos os Modos (Ciclo)",
    calm: "Meditação Calma",
    party: "Vibe de Festa",
    ambient: "Sonho Ambiente",
    galaxy: "Galáxia Profunda",
    cyberpunk: "Cidade Cyberpunk",
    retrowave: "Pôr do Sol Retrowave",
    psychedelic: "Viagem Psicodélica",
    vocal: "Foco Vocal",
  },
  qualities: {
    low: "Baixa (Energia)",
    med: "Média (Equilibrada)",
    high: "Alta (Fidelidade)",
  },

  // --- Hints for Tooltips ---
  hints: {
    randomize: "Aleatorizar Visuais e Cores",
    resetVisual: "Redefinir Configurações Visuais",
    resetAudio: "Redefinir Configurações de Áudio",
    resetText: "Redefinir Configurações de Texto",
    autoRotate: "Ciclar automaticamente pelos modos visuais",
    enterLocalFont: "ex: Arial, Helvetica Neue",
    confirmReset: "Tem certeza que deseja restaurar todas as configurações para o padrão de fábrica? Isso não pode ser desfeito.",
    recGain: "Ajuste o volume do áudio para gravação de vídeo. Ganho mais alto pode levar a visuais mais altos e reativos nas gravações.",
    syncStart: "Se estiver reproduzindo um arquivo, inicie a gravação automaticamente quando a reprodução começar.",
    countdown: "Exibir uma contagem regressiva antes de iniciar a gravação.",
  },

  // --- Toasts / Notifications ---
  toasts: {
    canvasNotFound: "Elemento Canvas não encontrado.",
    audioNotReady: "Fonte de áudio não pronta. Tente iniciar o microfone ou reproduzir um arquivo.",
    noVideoFormat: "Nenhum formato de vídeo suportado para gravação.",
    recInitFail: "Falha na inicialização da gravação.",
    recStart: "Gravação Iniciada!",
    processing: "Processando vídeo...",
    reviewReady: "Vídeo Pronto para Revisão!",
    exportFail: "Falha na exportação do vídeo.",
    copied: "Link Copiado!",
    unsupported: "Funcionalidade de compartilhamento não suportada pelo seu navegador.",
    aiDirectorReq: "Chave API Gemini necessária para recursos de IA.",
    aiFail: "Falha na geração de IA. Verifique a chave API ou tente novamente.",
  },

  // --- Errors ---
  errors: {
    accessDenied: "Acesso ao microfone negado. Por favor, habilite nas configurações do navegador.",
    trackLoad: "Não foi possível carregar a faixa ou decodificar os dados de áudio.",
    configMissing: "Chave API ausente ou inválida. Por favor, configure nas Configurações do Sistema.",
    unsupportedTitle: 'Navegador Não Suportado',
    unsupportedText: 'O Aura Flux requer recursos modernos de navegador (como acesso ao microfone) que não estão disponíveis. Por favor, atualize para uma versão recente do Chrome, Firefox ou Safari.',
  },

  config: {
    title: "Gerenciamento de Dados",
    export: "EXPORTAR",
    import: "IMPORTAR",
    exported: "Configuração Exportada",
    importSuccess: "Configuração importada",
    invalidFile: "Arquivo de configuração inválido",
    library: "ARQUIVO DE PRESETS",
    placeholder: "Nome do Preset...",
    save: "SALVAR",
    load: "Preset Carregado",
    delete: "Removido",
    deleteConfirm: "Tem certeza que deseja excluir este preset?",
    limitReached: "Limite de presets atingido (máx 3).",
    saved: "Salvo",
  },

  songOverlay: {
    provider: {
      local: 'Cache Local',
      mock: 'Simulação',
      id3: 'Tag ID3',
    },
    aiSynesthesia: 'Sinestesia IA',
    googleSearch: 'Pesquisa Google',
  },

  wrongSong: "Tentar Novamente",

  // --- Share ---
  share: {
    appTitle: "Aura Flux - Visualizador de Música IA",
    appMessage: "Experimente Aura Flux - Visualizador de Música IA! 🎵✨",
    shareApp: "Compartilhar App",
    title: "Criação Aura Flux",
    message: "Confira esta arte criada com Aura Flux! \n\n{song} por {artist}",
    hashtags: "#AuraFlux #AuraFluxVisualizer #AIMusicArt",
    copied: "Texto copiado!",
    unsupported: "Compartilhamento não suportado",
  },

  // --- Studio Panel ---
  studioPanel: {
    videoConfig: "Configurações de Vídeo",
    audioMix: "Mixagem de Áudio",
    previewTitle: "Prévia da Gravação",
    discard: "Descartar",
    share: "Compartilhar",
    save: "Salvar",
    stopping: "Parando...",
    processing: "Processando...",
    arming: "Armado e Aguardando...",
    start: "Gravar Vídeo",
    settings: {
      resolution: "Resolução",
      resNative: "Nativa",
      aspectRatio: "Proporção",
      fps: "FPS",
      codec: "Formato de Vídeo",
      bitrate: "Taxa de Bits",
      recGain: "Ganho de Gravação",
      syncStart: "Sincronizar com Reprodução",
      countdown: "Contagem Regressiva",
    },
    hints: {
      recGain: "Ajuste o volume do áudio para gravação de vídeo. Ganho mais alto pode levar a visuais mais altos e reativos nas gravações.",
      syncStart: "Se estiver reproduzindo um arquivo, inicie a gravação automaticamente quando a reprodução começar.",
      countdown: "Exibir uma contagem regressiva antes de iniciar a gravação.",
    },
    formats: {
      vp9: "WebM (VP9)",
      vp8: "WebM (VP8)",
      mp4_h264: "MP4 (H.264)",
    },
  },

  helpModal: {
    title: "Ajuda e Informações",
    tabs: {
      guide: "Guia",
      shortcuts: "Atalhos",
      about: "Sobre",
    },
    intro: "Aura Flux transforma som em experiências visuais de tirar o fôlego. Mergulhe em um mundo imersivo onde sua música dita a arte.",
    howItWorksTitle: "Como Usar",
    howItWorksSteps: [
      "Clique em 'Inicializar Sistema' para começar, concedendo acesso ao microfone para visualização em tempo real.",
      "Explore diversos modos visuais e ajuste configurações como velocidade, sensibilidade e cores na aba 'Visuais'.",
      "Carregue arquivos de áudio locais em 'Reprodução' ou use 'Link IA' para analisar URLs de plataformas de streaming populares.",
      "Ative 'Análise ao Vivo' em 'Entrada de Áudio' para identificação de músicas por IA e recomendações visuais baseadas no humor.",
      "Personalize com sobreposições de texto personalizadas, fontes e efeitos 3D em 'Sobreposição de Texto'.",
      "Capture suas criações em resolução de até 4K usando as ferramentas de 'Estúdio', ou gerencie idioma e preferências de UI em 'Sistema'.",
    ],
    shortcutsTitle: "Atalhos de Teclado",
    shortcutItems: {
      toggleMic: "Alternar Mic/Reprodução",
      fullscreen: "Alternar Tela Cheia",
      lyrics: "Alternar Info IA / Letra",
      hideUi: "Alternar Visibilidade da UI",
      randomize: "Aleatorizar Visuais",
      speed: "Ajustar Velocidade",
      glow: "Alternar Brilho",
      trails: "Alternar Rastro",
      changeMode: "Ciclar Modo Visual",
      changeTheme: "Ciclar Tema de Cores",
      tabs: "Alternar Abas do Painel",
      help: "Abrir Ajuda (Este Modal)",
    },
    gesturesTitle: "Gestos de Toque",
    gestureItems: {
      swipeMode: "Deslizar Esq/Dir: Mudar Modo Visual",
      swipeSens: "Deslizar Cima/Baixo: Ajustar Sensibilidade (Ganho)",
      longPress: "Pressionar Longo: Alternar Info IA / Sobreposição de Letra",
    },
    projectInfoTitle: "Nossa Visão",
    aboutDescription: "Aura Flux permite que você veja o invisível. É uma exploração da sinergia entre arte generativa, processamento de áudio em tempo real e IA avançada. Nossa missão é transformar experiências auditivas em jornadas profundamente pessoais e visualmente deslumbrantes.",
    techStackTitle: "Tecnologia Central",
  },
};
