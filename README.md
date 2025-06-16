# Branded Static Boilerplate (BSB)

> A self-documenting static website boilerplate that teaches web development through interactive examples and comprehensive documentation

[![Deploy to GitHub Pages](https://github.com/madfam-io/branded-static-boilerplate/actions/workflows/deploy.yml/badge.svg)](https://github.com/madfam-io/branded-static-boilerplate/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Demo**: [https://madfam-io.github.io/branded-static-boilerplate/](https://madfam-io.github.io/branded-static-boilerplate/)

## What Makes BSB Special?

BSB isn't just another static site generator. It's an **educational platform** disguised as a boilerplate that:

- 🎓 **Teaches as you build** - Every file contains learning materials
- 🔍 **Self-documenting** - Code and documentation live together
- ⚡ **Production-ready** - Optimized for performance and accessibility
- 🧩 **Component-based** - Reusable, maintainable architecture
- 🚀 **Deploy-ready** - Automated GitHub Pages deployment included

Perfect for **neophyte web developers** learning modern development practices and **experienced developers** who want a solid foundation with comprehensive documentation.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Documentation Map](#-documentation-map)
- [Project Architecture](#-project-architecture)
- [Learning Path](#-learning-path)
- [Customization Guide](#-customization-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- GitHub account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/madfam-io/branded-static-boilerplate.git my-website
cd my-website

# Install dependencies
npm install

# Start development with learning mode enabled
npm run dev

# Open browser and click "Enable Learning Mode" for interactive tooltips
```

### Available Scripts

| Command | Description | Learn More |
|---------|-------------|------------|
| `npm run dev` | Start development server | [Development Guide](docs/tutorials/development.md) |
| `npm run build` | Build for production | [Build Process](docs/tutorials/build-process.md) |
| `npm run preview` | Preview production build | [Testing Guide](docs/tutorials/testing.md) |
| `npm run lint` | Lint CSS and JavaScript | [Code Quality](docs/tutorials/code-quality.md) |
| `npm run deploy` | Deploy to GitHub Pages | [Deployment Guide](docs/tutorials/deployment.md) |

## 📚 Documentation Map

BSB's documentation is distributed throughout the codebase for contextual learning:

### Core Documentation
- **[README.md](README.md)** ← You are here
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and decisions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to BSB

### Source Documentation
- **[src/README.md](src/README.md)** - Source code organization
- **[src/components/README.md](src/components/README.md)** - Component architecture
- **[src/styles/README.md](src/styles/README.md)** - CSS methodology
- **[src/scripts/README.md](src/scripts/README.md)** - JavaScript patterns

### Tutorials & Guides
- **[docs/tutorials/](docs/tutorials/)** - Step-by-step learning guides
- **[docs/api/](docs/api/)** - Component API documentation
- **[docs/examples/](docs/examples/)** - Real-world implementation examples

### Component Documentation
Each component includes its own README:
- **[src/components/header/README.md](src/components/header/README.md)** - Navigation and branding
- **[src/components/card/README.md](src/components/card/README.md)** - Content cards
- **[src/components/hero/README.md](src/components/hero/README.md)** - Hero sections
- **[src/components/footer/README.md](src/components/footer/README.md)** - Site footer

## 🏗️ Project Architecture

```
branded-static-boilerplate/
├── 📁 src/                    # Source files (📖 src/README.md)
│   ├── 📄 index.html         # Main page with extensive comments
│   ├── 📁 components/        # UI components (📖 components/README.md)
│   │   ├── 📁 header/        # Navigation (📖 header/README.md)
│   │   ├── 📁 card/          # Content cards (📖 card/README.md)
│   │   ├── 📁 hero/          # Hero sections (📖 hero/README.md)
│   │   └── 📁 footer/        # Site footer (📖 footer/README.md)
│   ├── 📁 styles/           # CSS architecture (📖 styles/README.md)
│   │   ├── 📁 base/         # Reset, variables, typography
│   │   ├── 📁 utilities/    # Helper classes
│   │   └── 📁 themes/       # Color schemes
│   ├── 📁 scripts/          # JavaScript (📖 scripts/README.md)
│   │   ├── 📁 core/         # Essential functionality
│   │   └── 📁 modules/      # Feature modules
│   ├── 📁 assets/           # Images, fonts, icons
│   └── 📁 pages/            # Additional HTML pages
├── 📁 docs/                  # Documentation hub
│   ├── 📁 tutorials/        # Learning guides
│   ├── 📁 api/             # Component APIs
│   └── 📁 examples/        # Implementation examples
├── 📁 .github/              # GitHub workflows and templates
└── 📁 dist/                 # Built files (auto-generated)
```

## 🎯 Learning Path

### For Beginners
1. **Start here**: [Getting Started Tutorial](docs/tutorials/getting-started.md)
2. **Understand structure**: [Project Organization](src/README.md)
3. **Create first page**: [Your First Page](docs/tutorials/first-page.md)
4. **Learn components**: [Component Basics](src/components/README.md)
5. **Style your site**: [CSS Architecture](src/styles/README.md)

### For Intermediate Developers
1. **Architecture deep-dive**: [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Component patterns**: [Advanced Components](docs/tutorials/advanced-components.md)
3. **Performance optimization**: [Performance Guide](docs/tutorials/performance.md)
4. **Build customization**: [Build Process](docs/tutorials/build-process.md)

### For Advanced Developers
1. **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Plugin development**: [Plugin API](docs/api/plugins.md)
3. **Custom build tools**: [Build Extension](docs/tutorials/build-extension.md)

## 🎨 Customization Guide

### Quick Theming
Update your brand colors in `src/styles/base/variables.css`:

```css
:root {
  /* Brand Colors */
  --bsb-primary: #your-brand-color;
  --bsb-secondary: #your-secondary-color;
  
  /* Typography */
  --bsb-font-base: your-font-stack;
}
```

📖 **Learn more**: [Theming Guide](docs/tutorials/theming.md)

### Adding Components
Generate new components with built-in documentation:

```bash
npm run generate component MyComponent
```

📖 **Learn more**: [Component Development](docs/tutorials/component-development.md)

### Page Creation
Each page includes educational comments:

```bash
cp src/index.html src/pages/my-page.html
# Edit content, update meta tags, add to navigation
```

📖 **Learn more**: [Page Creation](docs/tutorials/page-creation.md)

## 🚀 Deployment

### GitHub Pages (Recommended)
BSB includes automated deployment to GitHub Pages:

1. **Fork/clone** this repository
2. **Enable GitHub Pages** in repository settings
3. **Push to main branch** - automatic deployment triggers
4. **Visit** `https://yourusername.github.io/repository-name`

📖 **Learn more**: [GitHub Pages Setup](docs/tutorials/github-pages.md)

### Other Platforms
The `dist/` folder contains static files ready for:
- **Netlify** - Drag and drop deployment
- **Vercel** - Git integration
- **AWS S3** - Static hosting
- **Firebase** - Google hosting

📖 **Learn more**: [Alternative Deployments](docs/tutorials/deployment-options.md)

## 🧩 Key Features

### Educational Features
- **Interactive tooltips** in development mode
- **Component documentation** accessible via help buttons  
- **Code comments** explaining the "why" not just "what"
- **Progressive learning** from basic to advanced concepts

### Performance Features
- **Optimized builds** with Vite bundler
- **Modern CSS** with custom properties
- **Vanilla JavaScript** for minimal bundle size
- **Image optimization** and lazy loading

### Developer Experience
- **Hot reloading** during development
- **Linting and formatting** for code quality
- **Pre-commit hooks** ensure clean commits
- **Component generators** for rapid development

## 🤝 Contributing

We welcome contributions from developers of all skill levels! BSB grows through community involvement.

### Ways to Contribute
- 📝 **Improve documentation** - Add examples, fix typos, clarify explanations
- 🐛 **Report bugs** - Help us identify and fix issues
- ✨ **Suggest features** - Propose new educational tools or components
- 🔧 **Submit code** - Fix bugs, add features, improve performance

📖 **Get started**: [CONTRIBUTING.md](CONTRIBUTING.md)

## 📖 Philosophy

BSB believes the best way to learn is through **contextual education**:

1. **Documentation lives with code** - Never out of sync
2. **Learning happens in context** - See concepts applied immediately
3. **Best practices demonstrated** - Not just described
4. **Code teaches by example** - Every file is a lesson

## 🆘 Support & Community

- 📖 **Documentation**: Browse the [docs/](docs/) directory
- 💬 **Discussions**: [GitHub Discussions](https://github.com/madfam-io/branded-static-boilerplate/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/madfam-io/branded-static-boilerplate/issues)
- 🌟 **Feature Requests**: [GitHub Issues](https://github.com/madfam-io/branded-static-boilerplate/issues)

## 📄 License

MIT License - Feel free to use BSB for personal or commercial projects!

See [LICENSE](LICENSE) for full details.

---

**Built with ❤️ by the BSB Community**  
*Making the web more accessible and educational, one static site at a time.*

---

### 🔗 Quick Links
- [Live Demo](https://madfam-io.github.io/branded-static-boilerplate/) 
- [Getting Started](docs/tutorials/getting-started.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Component Library](src/components/README.md)
- [CSS Methodology](src/styles/README.md)
- [JavaScript Patterns](src/scripts/README.md)