/**
 * BSB Internationalization (i18n) System
 * =======================================
 *
 * Complete translation system for English/Spanish bilingual support.
 * Provides translation data and utilities for the entire website.
 *
 * @author BSB Team
 * @version 1.0.0
 */

/**
 * Translation data structure
 * Contains all UI text in both English and Spanish
 */
export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      playground: 'Playground',
      projectStructure: 'Project Structure',
      contact: 'Contact'
    },

    // Common UI elements
    ui: {
      skipToMain: 'Skip to main content',
      loading: 'Loading...',
      error: 'Error',
      close: 'Close',
      open: 'Open',
      menu: 'Menu',
      search: 'Search',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      copy: 'Copy',
      share: 'Share'
    },

    // Theme toggle
    theme: {
      switch: 'Switch theme',
      current: 'Current theme',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto'
    },

    // Language toggle
    language: {
      switch: 'Switch language',
      current: 'Current language',
      english: 'English',
      spanish: 'Español'
    },

    // Homepage
    home: {
      title: 'Branded Static Boilerplate',
      subtitle: 'Professional Web Development Foundation',
      description: 'A comprehensive starter template for building modern, accessible, and performant static websites with educational features.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      features: {
        title: 'Why Choose BSB?',
        subtitle: 'Built for developers who value quality, education, and best practices',
        modern: {
          title: 'Modern Architecture',
          description: 'Component-based structure with ES6+ modules, CSS custom properties, and progressive enhancement.'
        },
        accessible: {
          title: 'Accessibility First',
          description: 'WCAG 2.1 AA compliant with semantic HTML, ARIA labels, and keyboard navigation support.'
        },
        educational: {
          title: 'Educational Focus',
          description: 'Interactive tutorials, code examples, and comprehensive documentation to accelerate learning.'
        },
        performance: {
          title: 'Performance Optimized',
          description: 'Fast loading times with optimized assets, minimal dependencies, and Core Web Vitals tracking.'
        },
        testing: {
          title: 'Quality Assured',
          description: 'Comprehensive testing setup with Jest, accessibility audits, and performance monitoring.'
        },
        responsive: {
          title: 'Mobile Ready',
          description: 'Fully responsive design that works beautifully on all devices and screen sizes.'
        }
      }
    },

    // About page
    about: {
      title: 'About BSB',
      subtitle: 'Empowering developers through education and best practices',
      mission: {
        title: 'Our Mission',
        content: 'To provide developers with a comprehensive, educational foundation for building modern web applications while teaching industry best practices and accessibility standards.'
      },
      principles: {
        title: 'Core Principles',
        education: {
          title: 'Education First',
          description: 'Every component and feature is designed to teach modern web development practices.'
        },
        accessibility: {
          title: 'Inclusive Design',
          description: 'Building for everyone, ensuring all users can access and enjoy web experiences.'
        },
        performance: {
          title: 'Performance Matters',
          description: 'Fast, efficient code that respects users\' time and device limitations.'
        },
        quality: {
          title: 'Quality Code',
          description: 'Well-tested, maintainable code that follows industry standards and best practices.'
        }
      }
    },

    // Services page
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive web development solutions',
      webDevelopment: {
        title: 'Web Development',
        description: 'Custom website development using modern technologies and best practices.'
      },
      consultation: {
        title: 'Technical Consultation',
        description: 'Expert advice on architecture, performance, and accessibility improvements.'
      },
      training: {
        title: 'Developer Training',
        description: 'Educational workshops and tutorials on modern web development techniques.'
      },
      audit: {
        title: 'Code Audits',
        description: 'Comprehensive reviews of code quality, performance, and accessibility compliance.'
      }
    },

    // Interactive Playground
    playground: {
      title: 'Interactive Code Playground',
      subtitle: 'Learn Web Development by Doing',
      description: 'Master HTML, CSS, and JavaScript through hands-on experimentation. Edit code in real-time and see your changes instantly in a safe, educational environment designed for learning.',
      startCoding: 'Start Coding Now',
      viewTutorials: 'View Tutorials',
      whyLearn: {
        title: 'Why Learn by Doing?',
        subtitle: 'Interactive coding bridges the gap between theory and practice, providing immediate feedback that accelerates learning and builds confidence.',
        instantFeedback: {
          title: 'Instant Feedback',
          description: 'See your code changes immediately. No build process, no delays - just pure, instant visual feedback that helps you understand cause and effect in web development.'
        },
        safeExperimentation: {
          title: 'Safe Experimentation',
          description: 'Break things without consequences! Our sandboxed environment lets you experiment freely, encouraging the trial-and-error learning that builds deep understanding.'
        },
        progressTracking: {
          title: 'Progress Tracking',
          description: 'Monitor your code quality, performance metrics, and learning progress. Built-in analytics help you understand not just what works, but why it works.'
        }
      },
      workspace: {
        title: 'Your Interactive Workspace',
        subtitle: 'Edit the code below and watch your changes come to life. Each tab contains working code that you can modify, experiment with, and learn from.',
        controls: {
          reset: 'Reset',
          fullscreen: 'Fullscreen',
          share: 'Share',
          run: 'Run'
        },
        tabs: {
          html: 'HTML',
          css: 'CSS',
          javascript: 'JavaScript'
        }
      }
    },

    // Project Structure page
    projectStructure: {
      title: 'Project Structure Explorer',
      subtitle: 'Understanding Your Codebase',
      description: 'Navigate through our organized file structure to understand how modern web projects are architected. Each folder and file has been carefully planned to demonstrate industry best practices.',
      explorer: {
        title: 'Interactive File Explorer',
        description: 'Click on any folder or file to learn about its purpose, importance, and how it fits into the overall architecture. Use the tooltips for quick insights or click for detailed explanations.'
      },
      principles: {
        title: 'Organization Principles',
        subtitle: 'How we structure code for maintainability and scalability',
        separation: {
          title: 'Separation of Concerns',
          description: 'Each folder has a specific purpose, making the codebase easier to navigate and maintain.'
        },
        reusability: {
          title: 'Component Reusability',
          description: 'Modular components that can be easily reused across different pages and projects.'
        },
        scalability: {
          title: 'Scalable Architecture',
          description: 'Structure designed to grow with your project without becoming unwieldy.'
        }
      }
    },

    // Contact page
    contact: {
      title: 'Get in Touch',
      subtitle: 'Ready to start your next project?',
      form: {
        name: 'Your Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.'
      },
      info: {
        title: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        address: 'Address'
      }
    },

    // Footer
    footer: {
      brandDescription: 'A modern, educational web development foundation focused on best practices and accessibility.',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      documentation: 'Documentation',
      tutorials: 'Tutorials',
      examples: 'Examples',
      community: 'Community',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 Branded Static Boilerplate. Built with modern web standards.'
    },

    // File Explorer educational content
    fileExplorer: {
      projectRoot: {
        title: 'Project Root Directory',
        description: 'The main folder containing your entire web project. Everything starts here!'
      },
      packageJson: {
        title: 'Project Configuration & Dependencies',
        description: 'The blueprint of your project - lists dependencies, scripts, and metadata.'
      },
      srcFolder: {
        title: 'Source Code Directory',
        description: 'Your website\'s source code lives here - HTML, CSS, JavaScript, and assets.'
      },
      components: {
        title: 'Reusable UI Components',
        description: 'LEGO blocks for your website - reusable pieces of HTML, CSS, and JavaScript.'
      },
      styles: {
        title: 'CSS Styling System',
        description: 'Organized CSS architecture with variables, utilities, and component styles.'
      },
      scripts: {
        title: 'JavaScript Functionality',
        description: 'Interactive behavior and application logic for your website.'
      },
      tests: {
        title: 'Test Suite',
        description: 'Automated tests to ensure your code works correctly and prevent bugs.'
      },
      docs: {
        title: 'Documentation',
        description: 'Project documentation, tutorials, and guides for developers.'
      }
    },

    // Error messages
    errors: {
      pageNotFound: 'Page Not Found',
      serverError: 'Server Error',
      networkError: 'Network Error',
      retry: 'Try Again',
      goHome: 'Go Home'
    },

    // Accessibility
    a11y: {
      mainNavigation: 'Main navigation',
      currentPage: 'Current page',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      expand: 'Expand',
      collapse: 'Collapse'
    }
  },

  es: {
    // Navegación
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      services: 'Servicios',
      playground: 'Laboratorio',
      projectStructure: 'Estructura del Proyecto',
      contact: 'Contacto'
    },

    // Elementos comunes de la interfaz
    ui: {
      skipToMain: 'Saltar al contenido principal',
      loading: 'Cargando...',
      error: 'Error',
      close: 'Cerrar',
      open: 'Abrir',
      menu: 'Menú',
      search: 'Buscar',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      copy: 'Copiar',
      share: 'Compartir'
    },

    // Selector de tema
    theme: {
      switch: 'Cambiar tema',
      current: 'Tema actual',
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Automático'
    },

    // Selector de idioma
    language: {
      switch: 'Cambiar idioma',
      current: 'Idioma actual',
      english: 'English',
      spanish: 'Español'
    },

    // Página de inicio
    home: {
      title: 'Plantilla Estática de Marca',
      subtitle: 'Fundación Profesional para Desarrollo Web',
      description: 'Una plantilla inicial completa para construir sitios web estáticos modernos, accesibles y eficientes con características educativas.',
      getStarted: 'Comenzar',
      learnMore: 'Aprender Más',
      features: {
        title: '¿Por qué elegir BSB?',
        subtitle: 'Construido para desarrolladores que valoran la calidad, educación y mejores prácticas',
        modern: {
          title: 'Arquitectura Moderna',
          description: 'Estructura basada en componentes con módulos ES6+, propiedades CSS personalizadas y mejora progresiva.'
        },
        accessible: {
          title: 'Accesibilidad Primero',
          description: 'Compatible con WCAG 2.1 AA con HTML semántico, etiquetas ARIA y soporte de navegación por teclado.'
        },
        educational: {
          title: 'Enfoque Educativo',
          description: 'Tutoriales interactivos, ejemplos de código y documentación completa para acelerar el aprendizaje.'
        },
        performance: {
          title: 'Optimizado para Rendimiento',
          description: 'Tiempos de carga rápidos con recursos optimizados, dependencias mínimas y seguimiento de Core Web Vitals.'
        },
        testing: {
          title: 'Calidad Asegurada',
          description: 'Configuración de pruebas completa con Jest, auditorías de accesibilidad y monitoreo de rendimiento.'
        },
        responsive: {
          title: 'Listo para Móviles',
          description: 'Diseño completamente responsivo que funciona hermosamente en todos los dispositivos y tamaños de pantalla.'
        }
      }
    },

    // Página Acerca de
    about: {
      title: 'Acerca de BSB',
      subtitle: 'Empoderando desarrolladores a través de la educación y mejores prácticas',
      mission: {
        title: 'Nuestra Misión',
        content: 'Proporcionar a los desarrolladores una base educativa integral para construir aplicaciones web modernas mientras enseñamos las mejores prácticas de la industria y estándares de accesibilidad.'
      },
      principles: {
        title: 'Principios Fundamentales',
        education: {
          title: 'Educación Primero',
          description: 'Cada componente y característica está diseñado para enseñar prácticas modernas de desarrollo web.'
        },
        accessibility: {
          title: 'Diseño Inclusivo',
          description: 'Construyendo para todos, asegurando que todos los usuarios puedan acceder y disfrutar experiencias web.'
        },
        performance: {
          title: 'El Rendimiento Importa',
          description: 'Código rápido y eficiente que respeta el tiempo de los usuarios y las limitaciones del dispositivo.'
        },
        quality: {
          title: 'Código de Calidad',
          description: 'Código bien probado y mantenible que sigue estándares de la industria y mejores prácticas.'
        }
      }
    },

    // Página de servicios
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones completas de desarrollo web',
      webDevelopment: {
        title: 'Desarrollo Web',
        description: 'Desarrollo de sitios web personalizados usando tecnologías modernas y mejores prácticas.'
      },
      consultation: {
        title: 'Consultoría Técnica',
        description: 'Asesoramiento experto en arquitectura, rendimiento y mejoras de accesibilidad.'
      },
      training: {
        title: 'Capacitación de Desarrolladores',
        description: 'Talleres educativos y tutoriales sobre técnicas modernas de desarrollo web.'
      },
      audit: {
        title: 'Auditorías de Código',
        description: 'Revisiones completas de calidad de código, rendimiento y cumplimiento de accesibilidad.'
      }
    },

    // Laboratorio Interactivo
    playground: {
      title: 'Laboratorio de Código Interactivo',
      subtitle: 'Aprende Desarrollo Web Practicando',
      description: 'Domina HTML, CSS y JavaScript a través de experimentación práctica. Edita código en tiempo real y ve tus cambios instantáneamente en un entorno seguro y educativo diseñado para el aprendizaje.',
      startCoding: 'Comenzar a Programar',
      viewTutorials: 'Ver Tutoriales',
      whyLearn: {
        title: '¿Por qué Aprender Practicando?',
        subtitle: 'La programación interactiva une la brecha entre teoría y práctica, proporcionando retroalimentación inmediata que acelera el aprendizaje y construye confianza.',
        instantFeedback: {
          title: 'Retroalimentación Instantánea',
          description: 'Ve los cambios de tu código inmediatamente. Sin proceso de construcción, sin demoras - solo retroalimentación visual pura e instantánea que te ayuda a entender causa y efecto en el desarrollo web.'
        },
        safeExperimentation: {
          title: 'Experimentación Segura',
          description: '¡Rompe cosas sin consecuencias! Nuestro entorno aislado te permite experimentar libremente, fomentando el aprendizaje de prueba y error que construye comprensión profunda.'
        },
        progressTracking: {
          title: 'Seguimiento del Progreso',
          description: 'Monitorea tu calidad de código, métricas de rendimiento y progreso de aprendizaje. Las analíticas incorporadas te ayudan a entender no solo qué funciona, sino por qué funciona.'
        }
      },
      workspace: {
        title: 'Tu Espacio de Trabajo Interactivo',
        subtitle: 'Edita el código a continuación y observa cómo tus cambios cobran vida. Cada pestaña contiene código funcional que puedes modificar, experimentar y aprender.',
        controls: {
          reset: 'Reiniciar',
          fullscreen: 'Pantalla Completa',
          share: 'Compartir',
          run: 'Ejecutar'
        },
        tabs: {
          html: 'HTML',
          css: 'CSS',
          javascript: 'JavaScript'
        }
      }
    },

    // Página de Estructura del Proyecto
    projectStructure: {
      title: 'Explorador de Estructura del Proyecto',
      subtitle: 'Entendiendo tu Base de Código',
      description: 'Navega a través de nuestra estructura de archivos organizada para entender cómo se arquitecturan los proyectos web modernos. Cada carpeta y archivo ha sido cuidadosamente planificado para demostrar las mejores prácticas de la industria.',
      explorer: {
        title: 'Explorador de Archivos Interactivo',
        description: 'Haz clic en cualquier carpeta o archivo para aprender sobre su propósito, importancia y cómo encaja en la arquitectura general. Usa las descripciones emergentes para información rápida o haz clic para explicaciones detalladas.'
      },
      principles: {
        title: 'Principios de Organización',
        subtitle: 'Cómo estructuramos el código para mantenibilidad y escalabilidad',
        separation: {
          title: 'Separación de Responsabilidades',
          description: 'Cada carpeta tiene un propósito específico, haciendo que la base de código sea más fácil de navegar y mantener.'
        },
        reusability: {
          title: 'Reutilización de Componentes',
          description: 'Componentes modulares que pueden ser fácilmente reutilizados en diferentes páginas y proyectos.'
        },
        scalability: {
          title: 'Arquitectura Escalable',
          description: 'Estructura diseñada para crecer con tu proyecto sin volverse inmanejable.'
        }
      }
    },

    // Página de contacto
    contact: {
      title: 'Ponte en Contacto',
      subtitle: '¿Listo para comenzar tu próximo proyecto?',
      form: {
        name: 'Tu Nombre',
        email: 'Dirección de Email',
        subject: 'Asunto',
        message: 'Mensaje',
        send: 'Enviar Mensaje',
        sending: 'Enviando...',
        success: '¡Mensaje enviado exitosamente!',
        error: 'Falló el envío del mensaje. Por favor intenta de nuevo.'
      },
      info: {
        title: 'Información de Contacto',
        email: 'Email',
        phone: 'Teléfono',
        address: 'Dirección'
      }
    },

    // Pie de página
    footer: {
      brandDescription: 'Una base moderna y educativa para desarrollo web enfocada en mejores prácticas y accesibilidad.',
      quickLinks: 'Enlaces Rápidos',
      resources: 'Recursos',
      documentation: 'Documentación',
      tutorials: 'Tutoriales',
      examples: 'Ejemplos',
      community: 'Comunidad',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      copyright: '© 2024 Plantilla Estática de Marca. Construido con estándares web modernos.'
    },

    // Contenido educativo del Explorador de Archivos
    fileExplorer: {
      projectRoot: {
        title: 'Directorio Raíz del Proyecto',
        description: '¡La carpeta principal que contiene todo tu proyecto web. Todo comienza aquí!'
      },
      packageJson: {
        title: 'Configuración del Proyecto y Dependencias',
        description: 'El plano de tu proyecto - lista dependencias, scripts y metadatos.'
      },
      srcFolder: {
        title: 'Directorio de Código Fuente',
        description: 'El código fuente de tu sitio web vive aquí - HTML, CSS, JavaScript y recursos.'
      },
      components: {
        title: 'Componentes de UI Reutilizables',
        description: 'Bloques LEGO para tu sitio web - piezas reutilizables de HTML, CSS y JavaScript.'
      },
      styles: {
        title: 'Sistema de Estilos CSS',
        description: 'Arquitectura CSS organizada con variables, utilidades y estilos de componentes.'
      },
      scripts: {
        title: 'Funcionalidad JavaScript',
        description: 'Comportamiento interactivo y lógica de aplicación para tu sitio web.'
      },
      tests: {
        title: 'Suite de Pruebas',
        description: 'Pruebas automatizadas para asegurar que tu código funcione correctamente y prevenir errores.'
      },
      docs: {
        title: 'Documentación',
        description: 'Documentación del proyecto, tutoriales y guías para desarrolladores.'
      }
    },

    // Mensajes de error
    errors: {
      pageNotFound: 'Página No Encontrada',
      serverError: 'Error del Servidor',
      networkError: 'Error de Red',
      retry: 'Intentar de Nuevo',
      goHome: 'Ir al Inicio'
    },

    // Accesibilidad
    a11y: {
      mainNavigation: 'Navegación principal',
      currentPage: 'Página actual',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      expand: 'Expandir',
      collapse: 'Contraer'
    }
  }
};