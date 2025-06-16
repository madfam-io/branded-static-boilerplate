# Getting Started with BSB

> Your first steps into the world of modern static web development

## Welcome to Branded Static Boilerplate!

This guide will walk you through setting up your first BSB project and introduce you to the core concepts that make BSB a powerful learning platform.

## 📋 Prerequisites

Before we begin, make sure you have:
- **Node.js 18+** and npm installed ([Download here](https://nodejs.org/))
- **Git** for version control ([Download here](https://git-scm.com/))
- **GitHub account** for deployment ([Sign up here](https://github.com/))
- **Code editor** (We recommend VS Code)

## 🚀 Quick Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/madfam-io/branded-static-boilerplate.git my-website
cd my-website
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all the build tools and development dependencies BSB needs.

### Step 3: Start Development Server

```bash
npm run dev
```

Your site will open automatically at `http://localhost:5173`

### Step 4: Enable Learning Mode

1. Click the **"Enable Learning Mode"** button on the homepage
2. Refresh the page to see interactive tooltips
3. Hover over components to see help buttons (?)
4. Click help buttons to view component documentation

## 🎯 Understanding BSB Structure

BSB organizes code into logical, educational sections:

```
my-website/
├── 📁 src/                    # All your source files
│   ├── 📄 index.html         # Main page (start here!)
│   ├── 📁 components/        # Reusable UI pieces
│   ├── 📁 styles/           # CSS organization
│   ├── 📁 scripts/          # JavaScript enhancements
│   └── 📁 pages/            # Additional pages
├── 📁 docs/                  # Learning materials
└── 📁 dist/                 # Built website (auto-generated)
```

**📖 Deep dive**: [Project Architecture](../README.md#project-architecture)

## 🎨 Your First Customization

Let's personalize your site by changing the brand colors:

### Step 1: Open the Variables File

Edit `src/styles/base/variables.css`:

```css
:root {
  /* Change these to your brand colors */
  --bsb-primary: #007bff;      /* Your main brand color */
  --bsb-secondary: #6c757d;    /* Secondary color */
  
  /* Update typography */
  --bsb-font-base: system-ui, -apple-system, sans-serif;
}
```

### Step 2: See Changes Live

Save the file and watch your site update automatically! This is **hot reloading** in action.

**📖 Learn more**: [Theming Guide](theming.md)

## 📄 Creating Your First Page

### Step 1: Copy the Index Page

```bash
cp src/index.html src/pages/about.html
```

### Step 2: Update the Content

Open `src/pages/about.html` and change:

```html
<!-- Update the title -->
<title>About Us | Your Site Name</title>

<!-- Update the hero content -->
<h1 class="bsb-hero__title">About Our Company</h1>
<p class="bsb-hero__lead">Tell your story here...</p>
```

### Step 3: Add Navigation Link

Edit the header component in your main index.html:

```html
<nav class="bsb-header__nav">
  <ul class="bsb-header__menu">
    <li><a href="/" class="bsb-header__link">Home</a></li>
    <li><a href="/pages/about.html" class="bsb-header__link">About</a></li>
    <!-- Add more pages here -->
  </ul>
</nav>
```

**📖 Learn more**: [Page Creation Guide](page-creation.md)

## 🧩 Understanding Components

BSB uses a **component-based architecture**. Each UI element is self-contained:

### Header Component
- **Location**: `src/components/header/`
- **Files**: `header.html`, `header.css`, `header.js`
- **Purpose**: Site navigation and branding

### Card Component  
- **Location**: `src/components/card/`
- **Files**: `card.html`, `card.css`
- **Purpose**: Content containers

Each component includes its own documentation and examples.

**📖 Learn more**: [Component Architecture](../../src/components/README.md)

## 🎓 Learning Features

### Interactive Documentation
- **Help buttons** appear on hover in development mode
- **Component modals** show documentation and API details
- **Inline comments** explain every decision

### Development Tools
- **Hot reloading** for instant feedback
- **Error overlay** helps debug issues
- **Build optimization** for production

### Educational Comments
Every file includes extensive comments explaining:
- **Why** each element exists
- **How** it fits into the bigger picture  
- **What** you can customize
- **Where** to learn more

## 🚀 Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates optimized files in the `dist/` folder:
- **Minified CSS** and JavaScript
- **Optimized images**
- **Clean HTML** with production paths

**📖 Learn more**: [Build Process](build-process.md)

## 🌐 Deploying to GitHub Pages

BSB includes automatic deployment:

1. **Push your code** to GitHub
2. **Enable GitHub Pages** in repository settings
3. **Automatic deployment** happens on every push

Your site will be live at: `https://yourusername.github.io/repository-name`

**📖 Learn more**: [Deployment Guide](deployment.md)

## 🎯 Next Steps

Now that you have BSB running, explore these learning paths:

### For Visual Learners
1. [CSS Architecture Guide](../../src/styles/README.md) - Understanding the styling system
2. [Component Library](../../src/components/README.md) - Building reusable UI pieces
3. [Theming Tutorial](theming.md) - Customizing colors and fonts

### For Code Enthusiasts  
1. [JavaScript Patterns](../../src/scripts/README.md) - Modern JS techniques
2. [Build Process](build-process.md) - How everything comes together
3. [Performance Optimization](performance.md) - Making sites lightning fast

### For Project Builders
1. [Page Creation](page-creation.md) - Building a multi-page site
2. [Component Development](component-development.md) - Creating custom components
3. [Advanced Techniques](advanced-techniques.md) - Professional patterns

## 🆘 Getting Help

Stuck? Here's where to find answers:

- **📖 Documentation**: Every folder has a README explaining its purpose
- **💬 Community**: [GitHub Discussions](https://github.com/madfam-io/branded-static-boilerplate/discussions)
- **🐛 Issues**: [Report bugs](https://github.com/madfam-io/branded-static-boilerplate/issues)
- **📧 Direct help**: Check component help buttons in development mode

## 🎉 Congratulations!

You've successfully set up BSB and learned the basics. The beauty of BSB is that every file you touch will teach you something new about modern web development.

**Remember**: BSB grows with you. Start simple, explore advanced features as you're ready, and don't hesitate to dive into the source code - it's designed to teach!

---

**🔗 Quick Navigation**
- [← Back to README](../../README.md) 
- [Next: CSS Architecture →](../../src/styles/README.md)
- [Component Basics →](../../src/components/README.md)
- [Page Creation →](page-creation.md)