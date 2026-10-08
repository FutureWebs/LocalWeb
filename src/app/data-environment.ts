/* ============================================================
   FutureWebs · data-environment.ts
   Única fuente de verdad de la información que se muestra en la
   web. El texto "es" es el idioma base; "en" es la traducción
   que resuelve TranslationService (con fallback a "es").
   ============================================================ */

export type Lang = 'es' | 'en';

/** Texto bilingüe: el idioma base siempre es el español. */
export interface L10n {
  es: string;
  en: string;
}

export interface NavItem {
  id: string;
  label: L10n;
  route: string;
}

export interface ProjectEntry {
  id: string;
  title: L10n;
  summary: L10n;
  description: L10n;
  tags: string[];
  link: string;
  gradient: string;
}

export interface ServiceEntry {
  id: string;
  icon: string;
  title: L10n;
  description: L10n;
  bullets: L10n[];
}

export interface ValueEntry {
  id: string;
  title: L10n;
  text: L10n;
}

export interface ConstellationNode {
  id: string;
  route: string;
  label: L10n;
  hint: L10n;
  accent: string;
  /** Radio del núcleo de la estrella en coordenadas del viewBox (0-100). */
  core: number;
  /** Número de puntas del trazo exterior. */
  points: number;
  /** La estrella contacto ocupa exactamente el centro de la pantalla. */
  center?: boolean;
  desktop: { x: number; y: number };
  mobile: { x: number; y: number };
}

export const ROUTES = {
  home: '/',
  map: '/mapa',
  equipo: '/equipo',
  servicios: '/servicios',
  proyectos: '/proyectos',
  contacto: '/contacto',
} as const;

/* ------------------------------------------------------------
   Constelación: 4 estrellas navegables. Contacto vive en el
   centro exacto del lienzo; el resto orbita alrededor.
   ------------------------------------------------------------ */
export const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: 'contacto',
    route: ROUTES.contacto,
    label: { es: 'Contáctanos', en: 'Contact us' },
    hint: { es: 'El centro de todo', en: 'The center of it all' },
    accent: 'var(--c-gold)',
    core: 4.6,
    points: 4,
    center: true,
    desktop: { x: 50, y: 50 },
    mobile: { x: 50, y: 50 },
  },
  {
    id: 'equipo',
    route: ROUTES.equipo,
    label: { es: 'Equipo', en: 'Team' },
    hint: { es: 'Quiénes somos', en: 'Who we are' },
    accent: 'var(--c-violet)',
    core: 3.6,
    points: 4,
    desktop: { x: 22, y: 26 },
    mobile: { x: 24, y: 24 },
  },
  {
    id: 'servicios',
    route: ROUTES.servicios,
    label: { es: 'Servicios', en: 'Services' },
    hint: { es: 'Lo que hacemos', en: 'What we do' },
    accent: 'var(--c-cyan)',
    core: 3.6,
    points: 4,
    desktop: { x: 78, y: 27 },
    mobile: { x: 76, y: 25 },
  },
  {
    id: 'proyectos',
    route: ROUTES.proyectos,
    label: { es: 'Proyectos', en: 'Projects' },
    hint: { es: 'Nuestro trabajo', en: 'Our work' },
    accent: 'var(--c-pink)',
    core: 3.6,
    points: 4,
    desktop: { x: 47, y: 82 },
    mobile: { x: 50, y: 83 },
  },
];

/** Líneas que unen las estrellas (pares de ids). */
export const CONSTELLATION_LINKS: [string, string][] = [
  ['equipo', 'contacto'],
  ['servicios', 'contacto'],
  ['proyectos', 'contacto'],
  ['equipo', 'servicios'],
];

export const NAV_ITEMS: NavItem[] = [
  { id: 'map', label: { es: 'Constelación', en: 'Constellation' }, route: ROUTES.map },
  { id: 'equipo', label: { es: 'Equipo', en: 'Team' }, route: ROUTES.equipo },
  { id: 'servicios', label: { es: 'Servicios', en: 'Services' }, route: ROUTES.servicios },
  { id: 'proyectos', label: { es: 'Proyectos', en: 'Projects' }, route: ROUTES.proyectos },
  { id: 'contacto', label: { es: 'Contacto', en: 'Contact' }, route: ROUTES.contacto },
];

/* ------------------------------------------------------------
   Contenido
   ------------------------------------------------------------ */
export const DATA_ENVIRONMENT = {
  brand: {
    name: 'FutureWebs',
    tagline: {
      es: 'Traspasa el horizonte de sucesos.',
      en: 'Cross the event horizon.',
    },
  },

  landing: {
    kicker: { es: 'Emprendimiento digital', en: 'Digital venture' },
    subtitle: {
      es: 'Arquitecturas robustas y experiencias inmersivas.',
      en: 'Robust architectures and immersive experiences.',
    },
    description: {
      es: 'Convertimos ideas en órbitas: producto, código y diseño girando alrededor de una sola estrella. Inicia el viaje y descubre nuestra constelación.',
      en: 'We turn ideas into orbits: product, code and design circling a single star. Start the journey and discover our constellation.',
    },
    cta: { es: 'Empezar viaje', en: 'Start journey' },
    hint: {
      es: 'Un agujero de gusano nos espera al otro lado.',
      en: 'A wormhole waits on the other side.',
    },
  },

  map: {
    kicker: { es: 'Centro de navegación', en: 'Navigation hub' },
    title: { es: 'Nuestra constelación', en: 'Our constellation' },
    subtitle: {
      es: 'Cada estrella abre un destino.',
      en: 'Every star opens a destination.',
    },
  },

  equipo: {
    kicker: { es: 'Quiénes somos', en: 'Who we are' },
    title: { es: 'El equipo detrás de la estrella', en: 'The team behind the star' },
    intro: {
      es: 'FutureWebs es un emprendimiento digital que une ingeniería y diseño para construir productos que se sienten vivos. Creemos en sistemas sólidos, detalles obsesivos y experiencias que se recuerdan.',
      en: 'FutureWebs is a digital venture joining engineering and design to build products that feel alive. We believe in solid systems, obsessive detail and experiences worth remembering.',
    },
    mission: {
      title: { es: 'Misión', en: 'Mission' },
      text: {
        es: 'Llevar la ingeniería al límite y romper la monotonía visual de la web, entregando soluciones que funcionan y enamoran.',
        en: 'Push engineering to the limit and break the visual monotony of the web, delivering solutions that work and delight.',
      },
    },
    vision: {
      title: { es: 'Visión', en: 'Vision' },
      text: {
        es: 'Ser el estudio al que acuden las marcas cuando necesitan algo que nadie ha visto antes.',
        en: 'Become the studio brands turn to when they need something nobody has seen before.',
      },
    },
    valuesTitle: { es: 'Valores en órbita', en: 'Values in orbit' },
    valuesIntro: {
      es: 'Las cuatro leyes que mantienen nuestro sistema estable.',
      en: 'The four laws keeping our system stable.',
    },
    values: [
      {
        id: 'v1',
        title: { es: 'Curiosidad orbital', en: 'Orbital curiosity' },
        text: {
          es: 'Preguntamos “¿y si?” antes de escribir la primera línea de código.',
          en: 'We ask “what if?” before writing the first line of code.',
        },
      },
      {
        id: 'v2',
        title: { es: 'Ingeniería rigurosa', en: 'Rigorous engineering' },
        text: {
          es: 'Arquitecturas limpias, mantenibles y listas para escalar sin gravedad.',
          en: 'Clean, maintainable architectures ready to scale with zero gravity.',
        },
      },
      {
        id: 'v3',
        title: { es: 'Diseño con alma', en: 'Design with soul' },
        text: {
          es: 'Cada píxel, microinteracción y animación tiene una razón de ser.',
          en: 'Every pixel, micro-interaction and animation has a reason to exist.',
        },
      },
      {
        id: 'v4',
        title: { es: 'Órbita cercana', en: 'Close orbit' },
        text: {
          es: 'Trabajamos codo a codo con quien nos confía su producto.',
          en: 'We work side by side with whoever trusts us with their product.',
        },
      },
    ] as ValueEntry[],
  },

  servicios: {
    kicker: { es: 'Lo que hacemos', en: 'What we do' },
    title: { es: 'Servicios en órbita', en: 'Services in orbit' },
    intro: {
      es: 'Cuatro maneras de poner tu producto en movimiento, desde la idea hasta la puesta en producción.',
      en: 'Four ways to put your product in motion, from idea to production.',
    },
    items: [
      {
        id: 's1',
        icon: '01',
        title: { es: 'Diseño y desarrollo web', en: 'Web design & development' },
        description: {
          es: 'Sitios y plataformas rápidas, accesibles y con identidad propia.',
          en: 'Fast, accessible sites and platforms with an identity of their own.',
        },
        bullets: [
          { es: 'Landing pages y sitios corporativos', en: 'Landing pages and corporate sites' },
          { es: 'Dashboards y portales internos', en: 'Dashboards and internal portals' },
          { es: 'Optimización de performance y SEO', en: 'Performance and SEO tuning' },
        ],
      },
      {
        id: 's2',
        icon: '02',
        title: { es: 'Aplicaciones a medida', en: 'Custom applications' },
        description: {
          es: 'Producto digital de punta a punta: APIs, integraciones y experiencias full-stack.',
          en: 'End-to-end digital product: APIs, integrations and full-stack experiences.',
        },
        bullets: [
          { es: 'Arquitectura frontend y backend', en: 'Frontend and backend architecture' },
          { es: 'Integraciones y automatizaciones', en: 'Integrations and automations' },
          { es: 'MVPs listos para validar', en: 'MVPs ready to validate' },
        ],
      },
      {
        id: 's3',
        icon: '03',
        title: { es: 'Experiencias interactivas', en: 'Interactive experiences' },
        description: {
          es: 'Animación, 3D y motion que convierten una página en un viaje.',
          en: 'Animation, 3D and motion that turn a page into a journey.',
        },
        bullets: [
          { es: 'Microinteracciones y transiciones', en: 'Micro-interactions and transitions' },
          { es: 'Escenas 3D y fondos generativos', en: '3D scenes and generative backgrounds' },
          { es: 'Storytelling visual con scroll', en: 'Scroll-driven visual storytelling' },
        ],
      },
      {
        id: 's4',
        icon: '04',
        title: { es: 'Consultoría digital', en: 'Digital consulting' },
        description: {
          es: 'Auditamos, ordenamos y trazamos la ruta de tu producto digital.',
          en: 'We audit, organize and map the route for your digital product.',
        },
        bullets: [
          { es: 'Auditoría de código y UX', en: 'Code and UX audits' },
          { es: 'Design systems y consistencia', en: 'Design systems and consistency' },
          { es: 'Roadmap técnico por fases', en: 'Phased technical roadmap' },
        ],
      },
    ] as ServiceEntry[],
  },

  proyectos: {
    kicker: { es: 'Nuestro trabajo', en: 'Our work' },
    title: { es: 'Proyectos desplegados', en: 'Deployed projects' },
    intro: {
      es: 'Sistemas complejos, soluciones elegantes. Una muestra de lo que ya está en órbita.',
      en: 'Complex systems, elegant solutions. A sample of what is already in orbit.',
    },
    cta: { es: 'Explorar código', en: 'Explore code' },
    items: [
      {
        id: 'p1',
        title: { es: 'Plataforma Educativa Modular', en: 'Modular Educational Platform' },
        summary: {
          es: 'Arquitectura Full-Stack en Angular y Spring Boot.',
          en: 'Full-Stack architecture with Angular and Spring Boot.',
        },
        description: {
          es: 'Gestión de bloques de contenido interactivos y validación social, pensada para crecer por módulos sin reescribir el núcleo.',
          en: 'Interactive content block management and social validation, built to grow module by module without rewriting the core.',
        },
        tags: ['Angular', 'Spring Boot', 'TypeScript'],
        link: 'https://github.com/FutureWebs',
        gradient: 'linear-gradient(45deg, #1f1c2c, #928dab)',
      },
      {
        id: 'p2',
        title: { es: 'Generador de Video Automatizado', en: 'Automated Video Generator' },
        summary: {
          es: 'Pipeline diseñado para canales de YouTube.',
          en: 'Pipeline designed for YouTube channels.',
        },
        description: {
          es: 'Parseo de scripts, síntesis de voz automatizada y animación cutout 2D para publicar contenido de forma consistente.',
          en: 'Script parsing, automated voice synthesis and 2D cutout animation to publish content consistently.',
        },
        tags: ['Node.js', 'Automation', 'Motion'],
        link: 'https://github.com/FutureWebs',
        gradient: 'linear-gradient(45deg, #0f2027, #203a43, #2c5364)',
      },
      {
        id: 'p3',
        title: { es: 'Transpilador C++ Competitivo', en: 'Competitive C++ Transpiler' },
        summary: {
          es: 'Lenguaje específico para optimización extrema.',
          en: 'A language built for extreme optimization.',
        },
        description: {
          es: 'Diseño conceptual de un lenguaje que se transpila a C++ para entornos de alta competencia donde cada milisegundo cuenta.',
          en: 'Conceptual design of a language that transpiles to C++ for high-competition environments where every millisecond counts.',
        },
        tags: ['C++', 'Compilers', 'R&D'],
        link: 'https://github.com/FutureWebs',
        gradient: 'linear-gradient(45deg, #141e30, #243b55)',
      },
    ] as ProjectEntry[],
  },

  contacto: {
    kicker: { es: 'El centro del sistema', en: 'The center of the system' },
    title: { es: 'Contáctanos', en: 'Contact us' },
    intro: {
      es: 'La singularidad te espera. Cuéntanos qué quieres construir y respondemos en menos de 48 horas.',
      en: 'The singularity awaits. Tell us what you want to build and we reply within 48 hours.',
    },
    info: {
      email: 'hola@futurewebs.com',
      response: {
        es: 'Tiempo de respuesta habitual: menos de 48 horas.',
        en: 'Typical response time: under 48 hours.',
      },
      location: {
        es: 'Trabajamos desde cualquier órbita.',
        en: 'We work from any orbit.',
      },
    },
    form: {
      name: { es: 'Nombre completo', en: 'Full name' },
      namePlaceholder: { es: 'Tu nombre', en: 'Your name' },
      email: { es: 'Correo', en: 'Email' },
      emailPlaceholder: { es: 'tu@correo.com', en: 'you@email.com' },
      message: { es: 'Mensaje', en: 'Message' },
      messagePlaceholder: { es: '¿Qué idea quieres poner en órbita?', en: 'What idea do you want to put in orbit?' },
      submit: { es: 'Enviar mensaje', en: 'Send message' },
      sending: { es: 'Transmitiendo señal…', en: 'Transmitting signal…' },
      success: {
        es: 'Mensaje enviado. ¡Gracias por la señal!',
        en: 'Message sent. Thanks for the signal!',
      },
      error: {
        es: 'No se pudo enviar. Inténtalo de nuevo o escríbenos directo al correo.',
        en: 'Could not send. Try again or email us directly.',
      },
      required: { es: 'Este campo es obligatorio', en: 'This field is required' },
      invalidEmail: { es: 'Ingresa un correo válido', en: 'Enter a valid email' },
      minLength: { es: 'Cuéntanos un poco más (mín. 10 caracteres)', en: 'Tell us a bit more (min. 10 characters)' },
    },
  },

  ui: {
    back: { es: 'Volver', en: 'Back' },
    backToMap: { es: 'Volver a la constelación', en: 'Back to the constellation' },
    home: { es: 'Inicio', en: 'Home' },
    langToEn: { es: 'EN', en: 'ES' },
    explore: { es: 'Explorar código', en: 'Explore code' },
    viewAll: { es: 'Ver todos', en: 'View all' },
    scrollHint: { es: 'Desplaza para explorar', en: 'Scroll to explore' },
    navBack: { es: 'Constelación', en: 'Constellation' },
  },
};

/* ------------------------------------------------------------
   Configuración de EmailJS (tokens reutilizados del service)
   ------------------------------------------------------------ */
export const EMAIL_CONFIG = {
  serviceId: 'service_m9bdz6h',
  templateId: 'template_d8wt22v',
  publicKey: 'sDRdYX3uylxg3MajX',
};
