import type { DesignTokens, PortfolioSection } from "../types/content"
import { resultThemeContent } from "./resultThemes"

export const defaultTokens: DesignTokens = {
  orange: "#FF5414",
  ink: "#171617",
  paper: "#FAFAFA",
  cream: "#F8F4F1",
  muted: "#514742",
  orangeDark: "#BC390C",
  headingFont: "Big Shoulders Display",
  bodyFont: "Inter",
  container: 1680,
  sectionSpace: 64,
  motionDuration: 520,
}

export const sections: PortfolioSection[] = [
  {
    id: "seed-perfil",
    slug: "perfil",
    number: 1,
    title: "Tulius Tsangaropulos",
    eyebrow:
      "Comunicação Corporativa e Institucional · Coordenação de Comunicação · RP, Reputação, Assessoria e Estratégia Digital",
    intro: "Foco em gerar conexões autênticas e projetos inovadores.",
    theme: "paper",
    layout: "hero",
    status: "published",
    animation: "fade-up",
    visible: true,
    panelA: [
      {
        title: "+15 ANOS",
        label: "Experiência",
        text: "de experiência em Comunicação, Marketing e Conteúdo",
        image: "/media/tulius-portrait-dark.jpg",
        alt: "Retrato em preto e branco de Tulius Tsangaropulos",
        hero: {
          panelBackground: "#171617",
          badgeText: "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·",
          badgeVisible: true,
          badgeBackground: "#FF5414",
          badgeColor: "#171617",
          introColor: "#FFFFFF",
          desktop: {
            visualHeight: 45,
            imageWidth: 52,
            imageHeight: 100,
            imagePositionX: 50,
            imagePositionY: 0,
            yearsX: 50,
            yearsY: 10,
            yearsWidth: 43,
            badgeSize: 34,
            badgeX: 55,
            badgeY: 74,
            contentGap: 10,
          },
          mobile: {
            imageWidth: 46,
            imageHeight: 100,
            imagePositionX: 50,
            imagePositionY: 0,
            badgeSize: 28,
            badgeX: 5,
            badgeY: 72,
          },
        },
      },
      {
        title: "Experiência em grandes empresas",
        text: "TV Globo, Vale e Prefeitura de São Paulo",
        icon: "arrow",
      },
      {
        title: "Experiência internacional",
        text: "Correspondente na China; formação em Dublin (2011) e Buenos Aires (2024).",
        icon: "arrow",
      },
      {
        title: "Liderança de equipes",
        text: "Relacionamento com stakeholders, planejamento e visão estratégica",
        icon: "arrow",
      },
      {
        title: "Idiomas",
        text: "Inglês fluente e espanhol avançado",
        icon: "arrow",
      },
    ],
    panelB: [
      { title: "Comunicação Corporativa", themeKey: "corporativa", label: "01" },
      { title: "Gestão e execução de projetos", themeKey: "projetos", label: "02" },
      { title: "Relações públicas e gestão de eventos", themeKey: "eventos", label: "03" },
      { title: "Marketing digital, branding e performance", themeKey: "marketing", label: "04" },
      { title: "Imprensa e influenciadores", themeKey: "imprensa", label: "05" },
      {
        title: "Invest RS",
        targetSlug: "invest-rs",
        meta: "Porto Alegre · 2026",
        text: "Gestão de Eventos · Comunicação Institucional · Relações Públicas · Inovação Digital",
      },
      {
        title: "Prefeitura de São Paulo",
        targetSlug: "prefeitura-sp",
        meta: "2024–2026",
        text: "Liderança de Equipes · Relacionamento com a Imprensa · Gestão de Crise · Estratégia Digital · Comunicação Interna · Media Training",
      },
      {
        title: "Vale",
        targetSlug: "vale",
        meta: "São Paulo · 2020–2024",
        text: "Comunicação Corporativa Global · Comunicação Executiva · Gestão de Projetos · Campanhas Digitais · Reputação e Gestão de Crise",
      },
      {
        title: "Grupo InPress",
        targetSlug: "inpress",
        meta: "São Paulo · 2019–2020",
        text: "Assessoria de Imprensa · Relações Públicas · Gestão de Contas · Comunicação Integrada · Branding e Design",
      },
      {
        title: "TV Globo/SporTV",
        targetSlug: "globo-sportv",
        meta: "Rio de Janeiro, Pequim e São Paulo · 2015–2019",
        text: "Jornalismo · Correspondente Internacional · Produção, Reportagem e Edição · Conteúdo Editorial",
      },
      {
        title: "CDI Comunicação",
        targetSlug: "cdi",
        meta: "São Paulo · 2014–2015",
        text: "Planejamento Estratégico · Comunicação Institucional · Relações Públicas · Gestão de Stakeholders",
      },
    ],
  },
  {
    id: "seed-sobre",
    slug: "sobre",
    number: 2,
    title: "Olá!",
    eyebrow: "Prazer, sou o Tulius",
    intro:
      "Jornalista e profissional sênior de Comunicação e Marketing, com mais de 15 anos de experiência em empresas globais, imprensa, agências e setor público.",
    theme: "orange",
    layout: "editorial",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Imagem da seção 02",
        image: "/media/tulius-portrait.jpg",
        alt: "Retrato de Tulius Tsangaropulos",
        aboutDesktopImage: "/media/tulius-contact.jpg",
        aboutDesktopAlt: "Tulius Tsangaropulos segurando um tablet",
      },
    ],
    panelB: [
      {
        title: "Estratégia também é escuta.",
        text: "Uma trajetória conectando organizações e pessoas.",
      },
      {
        title: "Comunicação de ponta a ponta",
        text: "Conecto estratégia, reputação, conteúdo, tecnologia e gestão de projetos.",
      },
      {
        title: "Visão editorial",
        text: "Clareza para temas complexos, repertório internacional e execução orientada por contexto.",
      },
      {
        title: "Resultados que orientam decisões",
        text: "Indicadores e análise de desempenho para transformar estratégia em impacto mensurável.",
      },
      {
        title: "A voz de quem lidera",
        text: "Posicionamento e mensagens que fortalecem lideranças e criam conexões com públicos estratégicos.",
      },
    ],
  },
  {
    id: "seed-resultados",
    slug: "resultados",
    number: 3,
    title: "Resultados e projetos em destaque",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    intro: "Indicadores documentados nas experiências profissionais.",
    panelA: [
      {
        title: "Mídia e Estratégia",
        metricIcon: "chart",
        relatedThemeKeys: ["marketing"],
        value: "R$ 12 milhões",
        text: "Orçamento anual de mídia paga gerido na Vale, com campanhas orientadas por indicadores.",
      },
      {
        title: "Comunicação Pública",
        metricIcon: "trending",
        relatedThemeKeys: ["marketing"],
        value: "+48% · +225%",
        text: "Crescimento de seguidores e alcance em seis meses na Prefeitura de São Paulo.",
      },
      {
        title: "Jornalismo Internacional",
        metricIcon: "newspaper",
        relatedThemeKeys: ["imprensa"],
        value: "~8 mil",
        text: "Candidatos no processo que selecionou oito repórteres para a TV Globo/SporTV.",
      },
      {
        title: "Relações Públicas e Imprensa",
        metricIcon: "megaphone",
        relatedThemeKeys: ["eventos", "imprensa"],
        value: "+30",
        text: "Veiculações em veículos como TV Globo, Folha, Veja, Exame e Forbes.",
      },
    ],
    panelB: resultThemeContent,
  },
  {
    id: "seed-competencias",
    slug: "competencias",
    number: 4,
    title: "Comunicação e estratégia",
    theme: "cream",
    layout: "editorial",
    status: "published",
    visible: false,
    panelA: [
      {
        title: "Habilidades",
        text: "Planejamento estratégico e comunicação executiva.",
      },
      {
        title: "Gestão",
        text: "Gestão de equipes, projetos, reputação e indicadores.",
      },
    ],
    panelB: [
      {
        title: "Competências",
        text: "Comunicação corporativa, interna e digital.",
      },
      {
        title: "Relações",
        text: "Assessoria de imprensa, relações públicas e gestão de crises.",
      },
      {
        title: "Destaques",
        text: "Mais de 15 anos na Vale, TV Globo/SporTV, Invest RS, agências de comunicação e setor público.",
      },
    ],
  },
  {
    id: "seed-formacao",
    slug: "formacao",
    number: 5,
    title: "Formação",
    theme: "ink",
    layout: "timeline",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Comunicação Social — Jornalismo",
        meta: "UFRN · 2007–2012",
        label: "Graduação",
      },
      {
        title: "Comunicação Integrada e Marketing Digital",
        meta: "UnP · 2013",
        label: "Pós-graduação",
      },
      {
        title: "Marketing Digital, BI e Estratégia Data Driven",
        meta: "PUCRS · 2020–2021",
        label: "MBA",
      },
    ],
    panelB: [
      {
        title: "Swan Training Institute",
        meta: "Dublin, Irlanda · 2010–2011",
        label: "Inglês",
      },
      {
        title: "Instituto Rojas",
        meta: "Buenos Aires, Argentina · 2024",
        label: "Espanhol",
      },
    ],
  },
  {
    id: "seed-invest",
    slug: "invest-rs",
    number: 6,
    title: "Invest RS",
    eyebrow: "Gestão de eventos, comunicação institucional e projetos digitais",
    intro: "Analista Executivo · Julho/2026 – atual · Porto Alegre, RS",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Guia de Boas-Vindas" },
        { title: "Organização de eventos" },
        { title: "Plataforma de eventos e relacionamento" },
      ],
    },
    panelA: [
      {
        title: "Competências aplicadas",
        tags: [
          "Comunicação institucional",
          "Projetos digitais e automação",
          "Relações públicas",
          "Stakeholders",
          "Gestão de eventos",
          "Mailing e convites",
        ],
      },
      {
        title: "Guia de Boas-Vindas",
        text: "Organização editorial e criação de estrutura de atualização do guia institucional.",
      },
      {
        title: "Organização de eventos",
        text: "Apoio a fornecedores, credenciamento, logística, materiais e cobertura, incluindo a Expointer 2026.",
      },
    ],
    panelB: [
      {
        title: "Plataforma de eventos e relacionamento",
        text: "Desenvolvimento de plataforma para eventos, convites, inscrições, check-in, segmentação e relatórios.",
      },
      {
        title: "Diagnóstico do mailing institucional",
        text: "Proposta de governança, fluxos de convites e histórico. Integrações externas permanecem planejadas.",
      },
      {
        title: "Cartões de visita digitais",
        text: "Concepção de variantes multilíngues, QR Code e vCard.",
      },
      {
        title: "Ativos visuais",
        text: "Imagens finais ainda precisam de aprovação editorial.",
        placeholder: true,
      },
    ],
  },
  {
    id: "seed-prefeitura",
    slug: "prefeitura-sp",
    number: 7,
    title: "Prefeitura de São Paulo",
    eyebrow: "Comunicação institucional, interna e digital",
    intro: "Coordenador de Comunicação · Nov/2024 – jan/2026 · São Paulo, SP",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Planejamento de comunicação" },
        { title: "Conteúdo institucional e executivo" },
        { title: "Plataforma SUBPI" },
      ],
    },
    panelA: [
      {
        title: "Planejamento de comunicação",
        label: "01",
        text: "Planejamento institucional, interno e digital.",
      },
      {
        title: "Conteúdo institucional e executivo",
        label: "02",
        text: "Notas oficiais, discursos, comunicados, revistas e materiais informativos.",
      },
      { title: "Seguidores orgânicos", value: "+48%" },
      { title: "Alcance de publicações", value: "+225%" },
      { title: "Colaboradores no escopo", value: "900" },
    ],
    panelB: [
      {
        title: "Imprensa e públicos estratégicos",
        label: "03",
        text: "Relacionamento com imprensa, órgãos públicos, lideranças e cidadãos.",
      },
      {
        title: "Media training e reputação",
        label: "04",
        text: "Preparação de porta-vozes, notas oficiais, suporte à crise e gestão da reputação.",
      },
      {
        title: "Plataforma SUBPI",
        text: "Portal interno concebido para cerca de 900 colaboradores, reunindo comunicados, relatórios e indicadores.",
      },
    ],
  },
  {
    id: "seed-vale",
    slug: "vale",
    number: 8,
    title: "Vale",
    eyebrow: "Comunicação corporativa global e estratégia digital",
    intro: "Analista Sênior de Comunicação · Jun/2020 – out/2024",
    theme: "paper",
    layout: "metrics",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Projetos digitais de ponta a ponta" },
        { title: "Comunicação executiva e reputação" },
        { title: "Mídia paga e inteligência de dados" },
      ],
    },
    panelA: [
      { title: "Orçamento anual de mídia sob gestão", value: "R$ 12 milhões" },
      {
        title: "Equipe digital integrada a áreas e agências",
        value: "6 pessoas",
      },
      {
        title: "Projetos digitais de ponta a ponta",
        label: "01",
        text: "Planejamento, briefing, governança e coordenação com equipes, agências e plataformas.",
      },
    ],
    panelB: [
      {
        title: "Comunicação executiva e reputação",
        label: "02",
        text: "Conteúdo para CEO e vice-presidentes e apoio a campanhas institucionais.",
      },
      {
        title: "Mídia paga e inteligência de dados",
        label: "03",
        text: "Planejamento, otimização de investimentos e relatórios executivos.",
      },
      {
        title: "Temas corporativos e inovação",
        label: "04",
        text: "ESG, sustentabilidade, diversidade e inclusão, comunicação digital e novas tecnologias.",
      },
    ],
  },
  {
    id: "seed-globo",
    slug: "globo-sportv",
    number: 9,
    title: "TV Globo / SporTV",
    eyebrow: "Correspondente internacional",
    intro: "Trainee, Repórter, Produtor, Editor e Correspondente · 2015–2019",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Produção de ponta a ponta" },
        { title: "Jornalista em Pequim" },
        { title: "Reportagens e entradas ao vivo" },
      ],
    },
    panelA: [
      {
        title: "Seleção nacional e formação",
        label: "01",
        text: "Selecionado entre cerca de 8 mil candidatos para uma turma de oito repórteres.",
      },
      {
        title: "Produção de ponta a ponta",
        label: "02",
        text: "Apuração, pauta, entrevistas, roteiro, gravação, reportagem e edição.",
      },
      {
        title: "Televisão e plataformas digitais",
        label: "03",
        text: "Produção jornalística para TV Globo/SporTV e Globoesporte.com.",
      },
    ],
    panelB: [
      {
        title: "Cobertura e conteúdo editorial",
        label: "04",
        text: "Séries especiais e coberturas esportivas e sociais.",
      },
      {
        title: "Jornalista em Pequim",
        label: "05",
        text: "Correspondente por cerca de um ano na China, com reportagens sobre esporte e cultura.",
      },
      {
        title: "Reportagens e entradas ao vivo",
        label: "06",
        text: "Entradas ao vivo e reportagens diárias, da apuração à edição.",
      },
    ],
  },
  {
    id: "seed-inpress",
    slug: "inpress",
    number: 10,
    title: "Grupo InPress",
    eyebrow: "Assessoria de imprensa, relações públicas e gestão de contas",
    intro: "Analista de Comunicação e Atendimento Sênior · Nov/2019 – jun/2020",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Assessoria de imprensa" },
        { title: "Relações públicas" },
        { title: "Campanhas integradas" },
      ],
    },
    panelA: [
      {
        title: "Assessoria de imprensa",
        label: "01",
        text: "Mais de 30 veiculações em TV Globo, Folha, Veja, Exame e Forbes.",
      },
      {
        title: "Relações públicas",
        label: "02",
        text: "Relacionamento com jornalistas, influenciadores e porta-vozes.",
      },
    ],
    panelB: [
      {
        title: "Gestão de contas",
        label: "03",
        text: "Atendimento a GoPro, Johnson & Johnson e Sicredi, com gestão de demandas e entregas.",
      },
      {
        title: "Campanhas integradas",
        label: "04",
        text: "Planejamento articulando imprensa, influenciadores, eventos e ações digitais.",
      },
    ],
  },
  {
    id: "seed-cdi",
    slug: "cdi",
    number: 11,
    title: "CDI Comunicação",
    eyebrow: "Planejamento estratégico e comunicação institucional",
    intro: "Analista de Comunicação e Atendimento Pleno · Nov/2014 – set/2015",
    theme: "paper",
    layout: "timeline",
    status: "published",
    visible: true,
    experienceMedia: {
      slides: [
        { title: "Planejamento estratégico" },
        { title: "Comunicação institucional" },
        { title: "Gestão de stakeholders" },
      ],
    },
    panelA: [
      {
        title: "Planejamento estratégico",
        label: "01",
        text: "Planejamento anual e planos táticos mensais, públicos, mensagens-chave e indicadores.",
      },
      {
        title: "Comunicação institucional",
        label: "02",
        text: "Roteiros, discursos, apresentações e materiais institucionais.",
      },
    ],
    panelB: [
      {
        title: "Relações públicas",
        label: "03",
        text: "Relacionamento institucional de clientes como Sicredi e Instituto Vladimir Herzog.",
      },
      {
        title: "Gestão de stakeholders",
        label: "04",
        text: "Articulação com públicos estratégicos e preparação de porta-vozes.",
      },
    ],
  },
  {
    id: "seed-tools",
    slug: "ferramentas",
    number: 12,
    title: "Ferramentas",
    theme: "ink",
    layout: "editorial",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Análise e indicadores",
        toolIcons: ["analytics","search"],
        text: "Google Analytics 4 (GA4) · Google Search Console · KPIs, dashboards e relatórios",
      },
      {
        title: "Mídia e performance",
        toolIcons: ["meta","growth"],
        text: "Meta Ads · Segmentação e gestão de campanhas · Monitoramento de resultados",
      },
      {
        title: "CRM e monitoramento",
        toolIcons: ["salesforce","hubspot","sprinklr"],
        text: "Salesforce · HubSpot · Sprinklr · CRM e relacionamento · Monitoramento de reputação",
      },
    ],
    panelB: [
      {
        title: "Projetos e colaboração",
        toolIcons: ["asana","notion"],
        text: "Asana · Notion · Planejamento e fluxos de trabalho · Gestão de equipes e entregas",
      },
      {
        title: "Conteúdo e design",
        toolIcons: ["adobe","figma","wordpress"],
        text: "Adobe Creative Cloud · Figma · WordPress · Produção de conteúdo visual e digital",
      },
      {
        title: "Comunicação digital",
        toolIcons: ["social","video","megaphone"],
        text: "Conteúdo e mídias sociais · Comunicação institucional e executiva · Planejamento de campanhas",
      },
    ],
  },
  {
    id: "seed-quotes",
    slug: "depoimentos",
    number: 13,
    title: "Depoimentos",
    theme: "paper",
    layout: "quotes",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Matheus Gomes",
        meta: "Estagiário · Subprefeitura de Pinheiros",
        image: "/media/matheus-gomes.jpg",
        alt: "Retrato de Matheus Gomes",
        text: "“Aprendi muito com ele no desenvolvimento do meu olhar jornalístico e na compreensão de uma comunicação mais estratégica, alinhada aos objetivos institucionais e ao interesse público. Sou muito grato ao Tulius pela oportunidade. Sem dúvida, é um profissional que inspira e ensina.”",
      },
      {
        title: "Ana Beatriz Neves",
        meta: "Estagiária · Subprefeitura de Pinheiros",
        image: "/media/ana-beatriz-neves.jpg",
        alt: "Retrato de Ana Beatriz Neves",
        text: "“Além de jornalista, Tulius se destaca pelo seu olhar voltado à inovação e à tecnologia. Para mim, ele foi também um verdadeiro professor nessa área, sempre disposto a compartilhar conhecimentos, explicar processos e apresentar novas ferramentas e possibilidades que ampliaram minha visão profissional.”",
      },
    ],
    panelB: [
      {
        title: "Fábio Seixas",
        meta: "Chefe de Redação da TV Globo",
        image: "/media/fabio-seixas.jpg",
        alt: "Retrato de Fábio Seixas",
        text: "“Em meio a milhares de candidatos, Tulius foi um dos selecionados para o programa Passaporte SporTV. Destacou-se na fase de seleção e foi enviado à China durante os Jogos Olímpicos do Rio. É um profissional batalhador e cheio de iniciativa, que certamente vai crescer muito na carreira.”",
      },
    ],
  },
  {
    id: "seed-contact",
    slug: "contato",
    number: 14,
    title: "Contato",
    eyebrow: "Vamos criar conexões autênticas?",
    intro: "Tulius Tsangaropulos · Comunicação, estratégia e reputação",
    theme: "orange",
    layout: "contact",
    status: "published",
    visible: true,
    panelA: [
      {
        title: "Tulius Tsangaropulos",
        text: "Moinhos de Vento · Porto Alegre/RS",
        image: "/media/tulius-contact.jpg",
        alt: "Tulius Tsangaropulos segurando um tablet",
      },
    ],
    panelB: [
      {
        title: "WhatsApp",
        value: "(51) 98992-6830",
        meta: "https://wa.me/5551989926830",
      },
      {
        title: "E-mail",
        value: "tuliust@gmail.com",
        meta: "mailto:tuliust@gmail.com",
      },
      {
        title: "LinkedIn",
        value: "linkedin.com/in/tuliust",
        meta: "https://linkedin.com/in/tuliust",
      },
    ],
  },
]
