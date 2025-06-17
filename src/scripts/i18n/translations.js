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
      designSystem: 'Design System',
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

    // Design System page
    designSystem: {
      title: 'Design System Showcase',
      subtitle: 'Interactive Design Token Explorer',
      description: 'Explore BSB\'s comprehensive design system including color palettes with accessibility ratings, typography scale with usage examples, spacing system with visual representations, component variations and states, and interactive examples with live code.',
      sections: {
        colors: {
          title: 'Color System',
          description: 'Our color palette is designed with accessibility in mind, ensuring sufficient contrast ratios and meaningful semantic associations.'
        },
        typography: {
          title: 'Typography Scale',
          description: 'A harmonious type scale that ensures readability and hierarchy across all devices and screen sizes.'
        },
        spacing: {
          title: 'Spacing System',
          description: 'Consistent spacing creates visual rhythm and improves readability. Our 8px-based system provides flexibility while maintaining harmony.'
        },
        components: {
          title: 'Component Library',
          description: 'Reusable components built with accessibility, flexibility, and consistency in mind.'
        }
      },
      features: {
        tokens: {
          title: 'Design Tokens',
          description: 'Explore our color palettes, typography scales, and spacing systems with copy-to-clipboard functionality.'
        },
        components: {
          title: 'Components',
          description: 'Interactive component showcase with all variants, states, and usage examples.'
        },
        accessibility: {
          title: 'Accessibility',
          description: 'Learn about accessible design practices with contrast checkers and ARIA examples.'
        }
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
    },

    // Tutorial Hub
    tutorialHub: {
      title: 'Web Development Mastery',
      subtitle: 'Complete Tutorial Collection',
      description: 'From your first line of HTML to advanced performance optimization—master modern web development through comprehensive, hands-on tutorials designed for real-world application.',
      startLearning: 'Start Learning',
      gettingStarted: 'Getting Started Guide',
      
      // Hero Stats
      stats: {
        coreTutorials: 'Core Tutorials',
        hoursContent: 'Hours of Content',
        codeExamples: 'Code Examples'
      },
      
      // Learning Progress Overview
      learningProgress: {
        title: 'Your Learning Journey',
        description: 'Track your progress through our comprehensive curriculum designed to take you from beginner to advanced web developer.',
        tutorialsCompleted: 'Tutorials Completed',
        hoursLearned: 'Hours Learned',
        currentLevel: 'Current Level',
        skillLevels: {
          beginner: 'Beginner',
          learning: 'Learning',
          developing: 'Developing',
          proficient: 'Proficient',
          expert: 'Expert'
        },
        complete: 'Complete'
      },
      
      // Learning Paths
      learningPaths: {
        title: 'Choose Your Learning Path',
        description: 'Structured learning journeys designed for different goals and experience levels. Each path builds systematically on previous knowledge.',
        
        foundation: {
          title: 'Foundation Builder',
          subtitle: 'Perfect for complete beginners',
          description: 'Start your web development journey with solid fundamentals. Learn HTML, CSS, and JavaScript through practical, hands-on projects that build real skills.',
          hours: '15-20 hours',
          level: 'Beginner',
          tutorials: '3 core tutorials'
        },
        
        enhancement: {
          title: 'Skill Enhancer',
          subtitle: 'For developers ready to level up',
          description: 'Elevate your development skills with advanced techniques in performance, accessibility, and modern deployment strategies.',
          hours: '20-25 hours',
          level: 'Intermediate',
          tutorials: '4 advanced tutorials'
        },
        
        complete: {
          title: 'Complete Mastery',
          subtitle: 'The full professional curriculum',
          description: 'The comprehensive journey from beginner to professional web developer. Master all aspects of modern web development with real-world projects and best practices.',
          hours: '40+ hours',
          level: 'Beginner to Advanced',
          tutorials: 'All 7 tutorials',
          mostPopular: 'Most Popular',
          commitment: 'Estimated completion: 6-8 weeks part-time'
        }
      },
      
      // Tutorial Library
      tutorialLibrary: {
        title: 'Complete Tutorial Library',
        description: 'Browse all available tutorials. Each one is designed to be both standalone learning and part of the comprehensive curriculum.',
        filters: {
          difficulty: 'Filter by difficulty:',
          topic: 'Filter by topic:',
          sort: 'Sort by:',
          allLevels: 'All levels',
          allTopics: 'All topics',
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
          htmlCss: 'HTML & CSS',
          javascript: 'JavaScript',
          tooling: 'Build Tools',
          optimization: 'Optimization',
          deployment: 'Deployment',
          recommended: 'Recommended order',
          alphabetical: 'Alphabetical',
          duration: 'Duration'
        },
        
        // Individual Tutorials
        tutorials: {
          componentDevelopment: {
            title: 'Component Development Mastery',
            description: 'Learn to build reusable, accessible components with modern HTML, CSS, and JavaScript. Master semantic markup, responsive design, and interactive functionality.',
            topics: ['HTML5', 'CSS Grid', 'JavaScript', 'Accessibility'],
            highlights: ['Semantic HTML structure', 'CSS component architecture', 'Progressive enhancement', 'Testing and validation']
          },
          
          theming: {
            title: 'CSS Theming & Design Systems',
            description: 'Master CSS custom properties, design tokens, and scalable theming systems. Create consistent, maintainable designs that adapt to user preferences.',
            topics: ['CSS Variables', 'Design Systems', 'Dark Mode', 'Theming'],
            highlights: ['CSS custom properties', 'Design token systems', 'Theme switching', 'Brand customization']
          },
          
          buildProcess: {
            title: 'Modern Build Process Mastery',
            description: 'Understand Vite, bundling, optimization, and modern development workflows. Learn to configure tools for efficient development and production builds.',
            topics: ['Vite', 'Bundling', 'Hot Reload', 'Optimization'],
            highlights: ['Vite configuration', 'Asset optimization', 'Development workflows', 'Production builds']
          },
          
          deployment: {
            title: 'Deployment & CI/CD Excellence',
            description: 'Master GitHub Pages deployment, automated CI/CD pipelines, and production optimization. Learn professional deployment workflows and monitoring.',
            topics: ['GitHub Pages', 'GitHub Actions', 'CI/CD', 'Monitoring'],
            highlights: ['Automated deployment', 'Custom domains', 'Performance monitoring', 'Security best practices']
          },
          
          performance: {
            title: 'Performance Optimization Mastery',
            description: 'Achieve perfect Lighthouse scores and optimize Core Web Vitals. Learn advanced techniques for faster loading, better user experience, and improved SEO.',
            topics: ['Core Web Vitals', 'Lighthouse', 'Image Optimization', 'Caching'],
            highlights: ['LCP, FID, CLS optimization', 'Image and font strategies', 'JavaScript performance', 'Performance budgets']
          },
          
          accessibility: {
            title: 'Accessibility Best Practices',
            description: 'Create inclusive web experiences that work for everyone. Master WCAG guidelines, screen reader optimization, and assistive technology support.',
            topics: ['WCAG 2.1', 'ARIA', 'Screen Readers', 'Keyboard Navigation'],
            highlights: ['Semantic HTML structure', 'ARIA patterns and roles', 'Testing methodologies', 'Inclusive design principles']
          },
          
          seo: {
            title: 'SEO Optimization Mastery',
            description: 'Master search engine optimization for static sites. Learn technical SEO, content strategy, structured data, and advanced techniques for better rankings.',
            topics: ['Technical SEO', 'Schema.org', 'Analytics', 'Content Strategy'],
            highlights: ['On-page optimization', 'Structured data markup', 'Local and mobile SEO', 'Performance for SEO']
          }
        },
        
        progressStates: {
          notStarted: 'Not started',
          inProgress: 'In progress',
          completed: 'Completed ✓'
        },
        
        startTutorial: 'Start Tutorial',
        showingAll: 'Showing all {total} tutorials',
        showingFiltered: 'Showing {visible} of {total} tutorials'
      },
      
      // Call to Action
      cta: {
        title: 'Ready to Start Your Journey?',
        description: 'Join thousands of developers who have mastered web development through our comprehensive, hands-on approach to learning.',
        getStarted: 'Get Started Guide',
        tryPlayground: 'Try the Playground',
        note: 'All tutorials are free and open source. Learn at your own pace.'
      }
    },

    // Meta-Learning Showcase
    metaLearning: {
      title: 'Meta-Learning Showcase',
      subtitle: 'Where Code Teaches Itself',
      description: 'Discover BSB\'s meta-learning features—a revolutionary approach where the codebase becomes your teacher, demonstrating concepts through its own construction.',
      
      features: {
        sourceViewer: {
          title: 'Source Code Viewer',
          description: 'View the source code of any component with inline explanations, best practices, and performance metrics.',
          demo: 'Interactive Demo'
        },
        
        progressTracker: {
          title: 'Progress Tracker',
          description: 'Gamified achievement system that tracks your component exploration, learning time, and skill progression.',
          viewProgress: 'View Progress'
        },
        
        learningToggle: {
          title: 'Learning Toggle',
          description: 'Activate learning mode on any page to reveal educational explanations, tips, and additional context.',
          toggleLearning: 'Toggle Learning'
        }
      },
      
      benefits: {
        title: 'Meta-Learning Benefits',
        contextual: {
          title: 'Contextual Learning',
          description: 'Learn concepts directly in the context where they\'re applied, improving retention and understanding.'
        },
        
        selfDocumenting: {
          title: 'Self-Documenting Code',
          description: 'Every component serves as its own documentation, showing real-world patterns and best practices.'
        },
        
        progressive: {
          title: 'Progressive Disclosure',
          description: 'Information is revealed gradually based on your experience level and interest.'
        }
      }
    },

    // Interactive Playground
    interactivePlayground: {
      title: 'Interactive Code Playground',
      subtitle: 'Learn Web Development by Doing',
      description: 'Master HTML, CSS, and JavaScript through hands-on experimentation. Edit code in real-time and see your changes instantly in a safe, educational environment designed for learning.',
      
      editor: {
        title: 'Interactive Code Playground',
        description: 'Edit the code below and watch your changes come to life in real-time. Experiment, break things, and learn by doing!',
        
        controls: {
          reset: 'Reset',
          fullscreen: 'Fullscreen',
          share: 'Share',
          run: 'Run'
        },
        
        tabs: {
          html: {
            title: 'HTML',
            help: 'Tip: Try adding semantic HTML elements like &lt;header&gt;, &lt;main&gt;, or &lt;section&gt;'
          },
          css: {
            title: 'CSS',
            help: 'Tip: Try experimenting with CSS Grid, Flexbox, or custom properties (CSS variables)'
          },
          js: {
            title: 'JavaScript',
            help: 'Tip: Use console.log() for debugging and experiment with modern JavaScript (ES6+)'
          }
        },
        
        output: {
          title: 'Live Output',
          description: 'Your rendered code appears here in real-time'
        }
      }
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
      designSystem: 'Sistema de Diseño',
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

    // Página del Sistema de Diseño
    designSystem: {
      title: 'Escaparate del Sistema de Diseño',
      subtitle: 'Explorador Interactivo de Tokens de Diseño',
      description: 'Explora el sistema de diseño integral de BSB incluyendo paletas de color con calificaciones de accesibilidad, escala tipográfica con ejemplos de uso, sistema de espaciado con representaciones visuales, variaciones y estados de componentes, y ejemplos interactivos con código en vivo.',
      sections: {
        colors: {
          title: 'Sistema de Color',
          description: 'Nuestra paleta de colores está diseñada con la accesibilidad en mente, asegurando ratios de contraste suficientes y asociaciones semánticas significativas.'
        },
        typography: {
          title: 'Escala Tipográfica',
          description: 'Una escala tipográfica armoniosa que asegura legibilidad y jerarquía en todos los dispositivos y tamaños de pantalla.'
        },
        spacing: {
          title: 'Sistema de Espaciado',
          description: 'El espaciado consistente crea ritmo visual y mejora la legibilidad. Nuestro sistema basado en 8px proporciona flexibilidad manteniendo la armonía.'
        },
        components: {
          title: 'Biblioteca de Componentes',
          description: 'Componentes reutilizables construidos con accesibilidad, flexibilidad y consistencia en mente.'
        }
      },
      features: {
        tokens: {
          title: 'Tokens de Diseño',
          description: 'Explora nuestras paletas de color, escalas tipográficas y sistemas de espaciado con funcionalidad de copiar al portapapeles.'
        },
        components: {
          title: 'Componentes',
          description: 'Escaparate interactivo de componentes con todas las variantes, estados y ejemplos de uso.'
        },
        accessibility: {
          title: 'Accesibilidad',
          description: 'Aprende sobre prácticas de diseño accesible con verificadores de contraste y ejemplos ARIA.'
        }
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
    },

    // Tutorial Hub - Centro de Tutoriales
    tutorialHub: {
      title: 'Dominio del Desarrollo Web',
      subtitle: 'Colección Completa de Tutoriales',
      description: 'Desde tu primera línea de HTML hasta optimización avanzada de rendimiento—domina el desarrollo web moderno a través de tutoriales completos y prácticos diseñados para aplicación en el mundo real.',
      startLearning: 'Comenzar a Aprender',
      gettingStarted: 'Guía de Inicio',
      
      // Estadísticas del Hero
      stats: {
        coreTutorials: 'Tutoriales Principales',
        hoursContent: 'Horas de Contenido',
        codeExamples: 'Ejemplos de Código'
      },
      
      // Resumen de Progreso de Aprendizaje
      learningProgress: {
        title: 'Tu Jornada de Aprendizaje',
        description: 'Rastrea tu progreso a través de nuestro curriculum integral diseñado para llevarte de principiante a desarrollador web avanzado.',
        tutorialsCompleted: 'Tutoriales Completados',
        hoursLearned: 'Horas Aprendidas',
        currentLevel: 'Nivel Actual',
        skillLevels: {
          beginner: 'Principiante',
          learning: 'Aprendiendo',
          developing: 'Desarrollando',
          proficient: 'Competente',
          expert: 'Experto'
        },
        complete: 'Completo'
      },
      
      // Rutas de Aprendizaje
      learningPaths: {
        title: 'Elige tu Ruta de Aprendizaje',
        description: 'Jornadas de aprendizaje estructuradas diseñadas para diferentes objetivos y niveles de experiencia. Cada ruta construye sistemáticamente sobre conocimientos previos.',
        
        foundation: {
          title: 'Constructor de Fundamentos',
          subtitle: 'Perfecto para principiantes completos',
          description: 'Comienza tu jornada de desarrollo web con fundamentos sólidos. Aprende HTML, CSS y JavaScript a través de proyectos prácticos que construyen habilidades reales.',
          hours: '15-20 horas',
          level: 'Principiante',
          tutorials: '3 tutoriales principales'
        },
        
        enhancement: {
          title: 'Potenciador de Habilidades',
          subtitle: 'Para desarrolladores listos para avanzar',
          description: 'Eleva tus habilidades de desarrollo con técnicas avanzadas en rendimiento, accesibilidad y estrategias modernas de despliegue.',
          hours: '20-25 horas',
          level: 'Intermedio',
          tutorials: '4 tutoriales avanzados'
        },
        
        complete: {
          title: 'Dominio Completo',
          subtitle: 'El curriculum profesional completo',
          description: 'La jornada integral de principiante a desarrollador web profesional. Domina todos los aspectos del desarrollo web moderno con proyectos del mundo real y mejores prácticas.',
          hours: '40+ horas',
          level: 'Principiante a Avanzado',
          tutorials: 'Los 7 tutoriales',
          mostPopular: 'Más Popular',
          commitment: 'Finalización estimada: 6-8 semanas medio tiempo'
        }
      },
      
      // Biblioteca de Tutoriales
      tutorialLibrary: {
        title: 'Biblioteca Completa de Tutoriales',
        description: 'Explora todos los tutoriales disponibles. Cada uno está diseñado para ser tanto aprendizaje independiente como parte del curriculum integral.',
        filters: {
          difficulty: 'Filtrar por dificultad:',
          topic: 'Filtrar por tema:',
          sort: 'Ordenar por:',
          allLevels: 'Todos los niveles',
          allTopics: 'Todos los temas',
          beginner: 'Principiante',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
          htmlCss: 'HTML y CSS',
          javascript: 'JavaScript',
          tooling: 'Herramientas',
          optimization: 'Optimización',
          deployment: 'Despliegue',
          recommended: 'Orden recomendado',
          alphabetical: 'Alfabético',
          duration: 'Duración'
        },
        
        // Tutoriales Individuales
        tutorials: {
          componentDevelopment: {
            title: 'Dominio del Desarrollo de Componentes',
            description: 'Aprende a construir componentes reutilizables y accesibles con HTML, CSS y JavaScript modernos. Domina el marcado semántico, diseño responsivo y funcionalidad interactiva.',
            topics: ['HTML5', 'CSS Grid', 'JavaScript', 'Accesibilidad'],
            highlights: ['Estructura HTML semántica', 'Arquitectura de componentes CSS', 'Mejora progresiva', 'Pruebas y validación']
          },
          
          theming: {
            title: 'Tematización CSS y Sistemas de Diseño',
            description: 'Domina las propiedades personalizadas de CSS, tokens de diseño y sistemas de tematización escalables. Crea diseños consistentes y mantenibles que se adapten a las preferencias del usuario.',
            topics: ['Variables CSS', 'Sistemas de Diseño', 'Modo Oscuro', 'Tematización'],
            highlights: ['Propiedades personalizadas CSS', 'Sistemas de tokens de diseño', 'Cambio de temas', 'Personalización de marca']
          },
          
          buildProcess: {
            title: 'Dominio del Proceso de Construcción Moderno',
            description: 'Entiende Vite, empaquetado, optimización y flujos de trabajo de desarrollo modernos. Aprende a configurar herramientas para desarrollo eficiente y construcciones de producción.',
            topics: ['Vite', 'Empaquetado', 'Recarga en Caliente', 'Optimización'],
            highlights: ['Configuración de Vite', 'Optimización de recursos', 'Flujos de trabajo de desarrollo', 'Construcciones de producción']
          },
          
          deployment: {
            title: 'Excelencia en Despliegue y CI/CD',
            description: 'Domina el despliegue en GitHub Pages, pipelines automatizados de CI/CD y optimización de producción. Aprende flujos de trabajo profesionales de despliegue y monitoreo.',
            topics: ['GitHub Pages', 'GitHub Actions', 'CI/CD', 'Monitoreo'],
            highlights: ['Despliegue automatizado', 'Dominios personalizados', 'Monitoreo de rendimiento', 'Mejores prácticas de seguridad']
          },
          
          performance: {
            title: 'Dominio de Optimización de Rendimiento',
            description: 'Logra puntuaciones perfectas de Lighthouse y optimiza Core Web Vitals. Aprende técnicas avanzadas para carga más rápida, mejor experiencia de usuario y SEO mejorado.',
            topics: ['Core Web Vitals', 'Lighthouse', 'Optimización de Imágenes', 'Caché'],
            highlights: ['Optimización LCP, FID, CLS', 'Estrategias de imágenes y fuentes', 'Rendimiento de JavaScript', 'Presupuestos de rendimiento']
          },
          
          accessibility: {
            title: 'Mejores Prácticas de Accesibilidad',
            description: 'Crea experiencias web inclusivas que funcionen para todos. Domina las pautas WCAG, optimización para lectores de pantalla y soporte de tecnología asistiva.',
            topics: ['WCAG 2.1', 'ARIA', 'Lectores de Pantalla', 'Navegación por Teclado'],
            highlights: ['Estructura HTML semántica', 'Patrones y roles ARIA', 'Metodologías de pruebas', 'Principios de diseño inclusivo']
          },
          
          seo: {
            title: 'Dominio de Optimización SEO',
            description: 'Domina la optimización para motores de búsqueda para sitios estáticos. Aprende SEO técnico, estrategia de contenido, datos estructurados y técnicas avanzadas para mejores rankings.',
            topics: ['SEO Técnico', 'Schema.org', 'Analíticas', 'Estrategia de Contenido'],
            highlights: ['Optimización en la página', 'Marcado de datos estructurados', 'SEO local y móvil', 'Rendimiento para SEO']
          }
        },
        
        progressStates: {
          notStarted: 'No iniciado',
          inProgress: 'En progreso',
          completed: 'Completado ✓'
        },
        
        startTutorial: 'Comenzar Tutorial',
        showingAll: 'Mostrando todos los {total} tutoriales',
        showingFiltered: 'Mostrando {visible} de {total} tutoriales'
      },
      
      // Llamada a la Acción
      cta: {
        title: '¿Listo para Comenzar tu Jornada?',
        description: 'Únete a miles de desarrolladores que han dominado el desarrollo web a través de nuestro enfoque integral y práctico de aprendizaje.',
        getStarted: 'Guía de Inicio',
        tryPlayground: 'Probar el Laboratorio',
        note: 'Todos los tutoriales son gratuitos y de código abierto. Aprende a tu propio ritmo.'
      }
    },

    // Meta-Learning Showcase - Escaparate de Meta-Aprendizaje
    metaLearning: {
      title: 'Escaparate de Meta-Aprendizaje',
      subtitle: 'Donde el Código se Enseña a Sí Mismo',
      description: 'Descubre las características de meta-aprendizaje de BSB—un enfoque revolucionario donde la base de código se convierte en tu profesor, demostrando conceptos a través de su propia construcción.',
      
      features: {
        sourceViewer: {
          title: 'Visor de Código Fuente',
          description: 'Ve el código fuente de cualquier componente con explicaciones en línea, mejores prácticas y métricas de rendimiento.',
          demo: 'Demostración Interactiva'
        },
        
        progressTracker: {
          title: 'Rastreador de Progreso',
          description: 'Sistema de logros gamificado que rastrea tu exploración de componentes, tiempo de aprendizaje y progreso de habilidades.',
          viewProgress: 'Ver Progreso'
        },
        
        learningToggle: {
          title: 'Alternador de Aprendizaje',
          description: 'Activa el modo de aprendizaje en cualquier página para revelar explicaciones educativas, consejos y contexto adicional.',
          toggleLearning: 'Alternar Aprendizaje'
        }
      },
      
      benefits: {
        title: 'Beneficios del Meta-Aprendizaje',
        contextual: {
          title: 'Aprendizaje Contextual',
          description: 'Aprende conceptos directamente en el contexto donde se aplican, mejorando la retención y comprensión.'
        },
        
        selfDocumenting: {
          title: 'Código Auto-Documentado',
          description: 'Cada componente sirve como su propia documentación, mostrando patrones del mundo real y mejores prácticas.'
        },
        
        progressive: {
          title: 'Revelación Progresiva',
          description: 'La información se revela gradualmente basada en tu nivel de experiencia y interés.'
        }
      }
    },

    // Interactive Playground - Laboratorio Interactivo  
    interactivePlayground: {
      title: 'Laboratorio de Código Interactivo',
      subtitle: 'Aprende Desarrollo Web Practicando',
      description: 'Domina HTML, CSS y JavaScript a través de experimentación práctica. Edita código en tiempo real y ve tus cambios instantáneamente en un entorno seguro y educativo diseñado para el aprendizaje.',
      
      editor: {
        title: 'Laboratorio de Código Interactivo',
        description: 'Edita el código a continuación y ve tus cambios en tiempo real. ¡Experimenta, rompe cosas y aprende haciendo!',
        
        controls: {
          reset: 'Reiniciar',
          fullscreen: 'Pantalla Completa', 
          share: 'Compartir',
          run: 'Ejecutar'
        },
        
        tabs: {
          html: {
            title: 'HTML',
            help: 'Consejo: Prueba agregando elementos HTML semánticos como &lt;header&gt;, &lt;main&gt;, o &lt;section&gt;'
          },
          css: {
            title: 'CSS',
            help: 'Consejo: Prueba experimentando con CSS Grid, Flexbox o propiedades personalizadas (variables CSS)'
          },
          js: {
            title: 'JavaScript',
            help: 'Consejo: Usa console.log() para depurar y experimentar con JavaScript moderno (ES6+)'
          }
        },
        
        output: {
          title: 'Resultado en Vivo',
          description: 'Tu código renderizado aparece aquí en tiempo real'
        }
      }
    }
  }
};