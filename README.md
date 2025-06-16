# Branded Static Boilerplate (BSB)

> A self-documenting static website boilerplate that teaches as it serves

## What is BSB?

Branded Static Boilerplate is more than just another website template. It's a comprehensive learning platform disguised as a static site generator. Every file, every comment, every structure decision is designed to teach you modern web development best practices while you build.

## Features

- 📚 **Self-Documenting**: Extensive inline documentation in every file
- 🚀 **Quick Start**: From zero to deployed in under 5 minutes
- 📱 **Responsive**: Mobile-first design with modern CSS
- ♿ **Accessible**: WCAG AA compliant out of the box
- 🎨 **Themeable**: CSS custom properties for easy customization
- 📦 **Component-Based**: Reusable HTML/CSS/JS components
- 🔧 **Modern Build**: Vite-powered development and optimization
- 🌐 **GitHub Pages Ready**: Automated deployment workflow included

## Quick Start

### Option 1: Using npx (Recommended)

```bash
npx create-bsb my-website
cd my-website
npm run dev
```

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/branded-static-boilerplate.git my-website
cd my-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
branded-static-boilerplate/
├── src/                    # Source files
│   ├── index.html         # Main page (heavily documented)
│   ├── components/        # Reusable components
│   ├── styles/           # CSS architecture
│   ├── scripts/          # JavaScript enhancements
│   ├── assets/           # Images, fonts, icons
│   └── pages/            # Additional HTML pages
├── docs/                  # Documentation
│   ├── tutorials/        # Step-by-step guides
│   ├── api/             # Component documentation
│   └── examples/        # Real-world examples
├── config/               # Build configuration
└── .github/              # GitHub automation
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint CSS and JavaScript
npm run format    # Format code with Prettier
npm run test      # Run tests
npm run deploy    # Deploy to GitHub Pages
```

## Creating Your First Page

1. **Copy** `src/index.html` to `src/pages/about.html`
2. **Update** the content and meta tags
3. **Link** to it from your navigation
4. **Build** and see your new page live!

Each HTML file includes detailed comments explaining:
- Why each element exists
- Best practices for SEO
- Accessibility considerations
- Performance optimizations

## Customization

### Changing Colors and Fonts

Edit `src/styles/base/variables.css`:

```css
:root {
    --bsb-primary: #007bff;      /* Your brand color */
    --bsb-font-base: system-ui;   /* Your font stack */
}
```

### Adding Components

Use our component generator:

```bash
npm run generate component MyComponent
```

This creates:
- Component HTML template
- Component-specific CSS
- Optional JavaScript enhancement
- README with usage examples

## Deployment

### GitHub Pages (Automatic)

1. Push to your `main` branch
2. GitHub Actions automatically builds and deploys
3. Access at `https://yourusername.github.io/your-repo-name`

### Other Platforms

The `dist/` folder after `npm run build` contains static files ready for any hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## Learning Resources

Every directory contains a `README.md` explaining:
- What belongs there
- How to use it
- Best practices
- Common patterns

Start with:
- `/src/README.md` - Understanding the source structure
- `/docs/tutorials/first-page.md` - Creating your first page
- `/src/styles/README.md` - CSS architecture guide

## Contributing

We welcome contributions! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## Philosophy

BSB believes that the best documentation lives with the code. By embedding knowledge directly into the boilerplate, we ensure that:

1. Documentation never gets out of sync
2. Learning happens in context
3. Best practices are demonstrated, not just described
4. The codebase teaches by example

## Support

- 📖 [Documentation](docs/)
- 💬 [Discussions](https://github.com/yourusername/branded-static-boilerplate/discussions)
- 🐛 [Issues](https://github.com/yourusername/branded-static-boilerplate/issues)
- 📧 Email: bsb@example.com

## License

MIT License - feel free to use BSB for any project!

---

Built with ❤️ by the BSB Community. Making the web more accessible, one static site at a time.