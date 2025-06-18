/**
 * Root Directory and Configuration Files Data
 * ===========================================
 */

export const rootDirectoryData = {
  '/': {
    type: 'folder',
    name: 'branded-static-boilerplate',
    title: 'Project Root Directory',
    description: 'The main folder containing your entire web project. Everything starts here!',
    importance: 'high',
    category: 'root',
    details: `
      <p>This is your project's <strong>root directory</strong> - think of it as the main folder that contains your entire website.</p>
      <h5>🎯 Key Concepts:</h5>
      <ul>
        <li><strong>Single Source of Truth:</strong> Everything related to your project lives here</li>
        <li><strong>Version Control:</strong> This folder is tracked by Git</li>
        <li><strong>Deployment Unit:</strong> When you deploy, this entire folder goes to the server</li>
      </ul>
      <h5>💡 Best Practices:</h5>
      <ul>
        <li>Keep the root clean - only essential files and folders</li>
        <li>Use descriptive folder names that explain their purpose</li>
        <li>Include a README.md to explain your project</li>
      </ul>
    `,
    links: [
      { text: 'Project Structure Guide', url: '/docs/tutorials/project-structure.md' },
      { text: 'Git Best Practices', url: '/docs/tutorials/git-workflow.md' }
    ]
  },
  '/package.json': {
    type: 'file',
    fileType: 'config',
    name: 'package.json',
    title: 'Project Configuration & Dependencies',
    description: 'The blueprint of your project - lists dependencies, scripts, and metadata.',
    importance: 'high',
    details: `
      <p><strong>package.json</strong> is like your project's ID card and instruction manual combined.</p>
      <h5>📋 What it contains:</h5>
      <ul>
        <li><strong>Dependencies:</strong> External libraries your project needs</li>
        <li><strong>Scripts:</strong> Commands you can run (build, test, deploy)</li>
        <li><strong>Metadata:</strong> Project name, version, description</li>
      </ul>
      <h5>🔧 Example Scripts:</h5>
      <pre><code>{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest"
  }
}</code></pre>
    `,
    links: [
      {
        text: 'NPM Package.json Guide',
        url: 'https://docs.npmjs.com/cli/v8/configuring-npm/package-json'
      }
    ]
  },
  '/vite.config.js': {
    type: 'file',
    fileType: 'config',
    name: 'vite.config.js',
    title: 'Build Tool Configuration',
    description: 'Vite bundler settings for development server and production builds.',
    importance: 'high',
    details: `
      <p><strong>Vite</strong> is your build tool - it transforms your source code into optimized websites.</p>
      <h5>⚡ What Vite Does:</h5>
      <ul>
        <li><strong>Development Server:</strong> Hot reload for instant feedback</li>
        <li><strong>Bundling:</strong> Combines multiple files for performance</li>
        <li><strong>Optimization:</strong> Minifies and compresses for faster loading</li>
      </ul>
      <h5>🔧 Common Configuration:</h5>
      <pre><code>export default {
  root: './src',
  build: {
    outDir: '../dist'
  }
}</code></pre>
    `,
    links: [
      { text: 'Vite Guide', url: 'https://vitejs.dev/guide/' }
    ]
  },
  '/.gitignore': {
    type: 'file',
    fileType: 'config',
    name: '.gitignore',
    title: 'Git Ignore Rules',
    description: 'Tells Git which files to ignore (node_modules, build outputs, etc.).',
    importance: 'medium',
    details: `
      <p><strong>.gitignore</strong> keeps your repository clean by excluding unnecessary files.</p>
      <h5>🚫 Common Ignores:</h5>
      <pre><code>node_modules/    # Dependencies
dist/           # Build output
.env            # Secret keys
.DS_Store       # Mac system files</code></pre>
      <h5>💡 Why Ignore?</h5>
      <ul>
        <li><strong>Size:</strong> node_modules can be huge</li>
        <li><strong>Security:</strong> Never commit secrets</li>
        <li><strong>Cleanliness:</strong> Focus on source code</li>
      </ul>
    `
  },
  '/README.md': {
    type: 'file',
    fileType: 'docs',
    name: 'README.md',
    title: 'Project Documentation',
    description: 'The first thing people see - explains what your project does and how to use it.',
    importance: 'high',
    details: `
      <p><strong>README.md</strong> is your project's front door - make a great first impression!</p>
      <h5>📋 Essential Sections:</h5>
      <ul>
        <li><strong>Project Title & Description:</strong> What does it do?</li>
        <li><strong>Installation:</strong> How to get started</li>
        <li><strong>Usage:</strong> Basic examples</li>
        <li><strong>Contributing:</strong> How others can help</li>
      </ul>
      <h5>✨ Pro Tips:</h5>
      <ul>
        <li>Use screenshots and GIFs to show functionality</li>
        <li>Include live demo links</li>
        <li>Keep it concise but comprehensive</li>
      </ul>
    `
  }
};