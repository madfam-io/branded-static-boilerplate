# Deployment Guide

> 🚀 **Learning Objective**: Master deploying static sites to GitHub Pages with automated CI/CD, custom domains, and production optimizations.

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Static Site Deployment](#understanding-static-site-deployment)
3. [GitHub Pages Fundamentals](#github-pages-fundamentals)
4. [Setting Up Your First Deployment](#setting-up-your-first-deployment)
5. [Continuous Deployment with GitHub Actions](#continuous-deployment-with-github-actions)
6. [Custom Domains](#custom-domains)
7. [Performance Optimizations](#performance-optimizations)
8. [Security Considerations](#security-considerations)
9. [Monitoring and Analytics](#monitoring-and-analytics)
10. [Troubleshooting](#troubleshooting)

## Introduction

Deployment is the final step that makes your website accessible to the world. BSB is optimized for GitHub Pages deployment, providing:

- 🌐 **Free hosting** - No cost for public repositories
- 🔄 **Automatic deployment** - Push to deploy via GitHub Actions
- 🔒 **HTTPS by default** - Secure connections out of the box
- 🌍 **Global CDN** - Fast loading worldwide via Fastly
- 📊 **Built-in analytics** - Basic traffic insights
- 🎯 **Custom domains** - Use your own domain name

### Prerequisites

Before starting, ensure you have:
- A GitHub account
- BSB project pushed to a GitHub repository
- Basic understanding of Git and GitHub
- Completed the [Getting Started](./getting-started.md) tutorial

### What You'll Learn

- How static site deployment works
- Setting up GitHub Pages
- Automating deployment with CI/CD
- Configuring custom domains
- Optimizing for production
- Monitoring your deployed site

## Understanding Static Site Deployment

### Static vs Dynamic Sites

```
Static Sites (like BSB):
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │ --> │    Build    │ --> │   Deploy    │
│   Files     │     │   Process   │     │  HTML/CSS   │
└─────────────┘     └─────────────┘     └─────────────┘
     ↓                    ↓                    ↓
- Markdown           - Compile            - Upload files
- Templates          - Optimize           - Serve via CDN
- Assets             - Bundle             - No server logic

Dynamic Sites:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │ --> │   Server    │ --> │   Client    │
│    Code     │     │  Processing │     │   Renders   │
└─────────────┘     └─────────────┘     └─────────────┘
     ↓                    ↓                    ↓
- Server code        - Database queries   - Dynamic content
- Templates          - API calls          - Real-time updates
- Database           - Authentication     - Server resources
```

### Benefits of Static Deployment

1. **Performance** - No server processing, instant response
2. **Security** - No server vulnerabilities, no database
3. **Scalability** - CDN handles any traffic spike
4. **Cost** - Often free or very cheap
5. **Simplicity** - Just files, no server maintenance

### Deployment Options Comparison

| Platform | Free Tier | Custom Domain | HTTPS | Build Minutes | Bandwidth |
|----------|-----------|---------------|-------|---------------|-----------|
| GitHub Pages | ✅ Unlimited | ✅ Free | ✅ Free | 2,000/month | 100GB/month |
| Netlify | ✅ Generous | ✅ Free | ✅ Free | 300/month | 100GB/month |
| Vercel | ✅ Generous | ✅ Free | ✅ Free | 6,000/month | 100GB/month |
| Cloudflare Pages | ✅ Unlimited | ✅ Free | ✅ Free | 500/month | Unlimited |
| AWS S3 + CloudFront | ❌ Paid | ✅ Free* | ✅ Free* | N/A | Pay-per-use |

*With Route 53 domain

## GitHub Pages Fundamentals

### How GitHub Pages Works

```
1. Push to GitHub
   └── GitHub detects changes
       └── Triggers GitHub Actions
           └── Builds your site
               └── Deploys to Pages
                   └── Serves via CDN
```

### Repository Settings

GitHub Pages can deploy from:

1. **Root of main branch** (`/`)
   ```
   repository/
   ├── index.html
   ├── style.css
   └── script.js
   ```

2. **Docs folder on main branch** (`/docs`)
   ```
   repository/
   ├── src/
   └── docs/        # Deploy from here
       ├── index.html
       └── assets/
   ```

3. **gh-pages branch** (Recommended for BSB)
   ```
   main branch:     Source code
   gh-pages branch: Built files only
   ```

### GitHub Pages URL Structure

```
Default URL:
https://[username].github.io/[repository-name]/

Examples:
https://microsoft.github.io/vscode-docs/
https://facebook.github.io/react/
https://vuejs.github.io/vue/
```

## Setting Up Your First Deployment

### Step 1: Prepare Your Repository

1. **Create GitHub Repository**
   ```bash
   # If not already done
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Configure Base Path**
   
   Edit `vite.config.js`:
   ```javascript
   export default defineConfig({
     // Set base to your repo name
     base: '/your-repo-name/',
     // ... rest of config
   });
   ```

   Why? GitHub Pages serves from a subdirectory:
   - ❌ `https://user.github.io/style.css`
   - ✅ `https://user.github.io/repo-name/style.css`

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 3: Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
# ============================================================================
# GitHub Pages Deployment Workflow
# ============================================================================
# This workflow builds and deploys your site to GitHub Pages automatically
# whenever you push to the main branch.
#
# 🎓 Learning Notes:
# - GitHub Actions is a CI/CD platform
# - Workflows are defined in YAML files
# - Each job runs in a fresh virtual environment
# ============================================================================

name: Deploy to GitHub Pages

# When to run this workflow
on:
  # Run on pushes to main branch
  push:
    branches: [main]
    
  # Allow manual trigger from Actions tab
  workflow_dispatch:

# Set permissions for GITHUB_TOKEN
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one deployment at a time
concurrency:
  group: "pages"
  cancel-in-progress: true

# Define the jobs to run
jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout code
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better caching
      
      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'  # Cache dependencies
      
      # 3. Install dependencies
      - name: Install dependencies
        run: |
          npm ci --prefer-offline --no-audit
          
      # 4. Build the site
      - name: Build site
        run: |
          npm run build
          # Create .nojekyll to prevent Jekyll processing
          touch dist/.nojekyll
        env:
          NODE_ENV: production
          
      # 5. Upload artifact for deployment
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  # Deploy job
  deploy:
    # Add dependency on build job
    needs: build
    
    # Deploy to GitHub Pages environment
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Configure for Production

1. **Update package.json scripts**:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "build:gh-pages": "vite build --base=/your-repo-name/",
       "preview:gh-pages": "vite preview --base=/your-repo-name/"
     }
   }
   ```

2. **Add deployment checklist**:
   ```bash
   # scripts/pre-deploy.sh
   #!/bin/bash
   
   echo "🚀 Pre-deployment checklist:"
   
   # Check for console.logs
   if grep -r "console.log" src/ --exclude-dir=node_modules; then
     echo "⚠️  Warning: console.log statements found"
   fi
   
   # Check image sizes
   find src/assets -name "*.jpg" -o -name "*.png" | while read img; do
     size=$(du -k "$img" | cut -f1)
     if [ $size -gt 500 ]; then
       echo "⚠️  Large image: $img (${size}KB)"
     fi
   done
   
   # Verify build
   npm run build || exit 1
   
   echo "✅ Ready to deploy!"
   ```

### Step 5: First Deployment

```bash
# Commit and push your changes
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main

# Monitor deployment
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

## Continuous Deployment with GitHub Actions

### Understanding the CI/CD Pipeline

```yaml
# Advanced deployment workflow with multiple stages
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # 1. Lint and test
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint code
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Check types
        run: npm run type-check

  # 2. Build and analyze
  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build site
        run: npm run build
        
      - name: Analyze bundle
        run: |
          npm run build -- --analyze
          mkdir -p reports
          mv dist/stats.html reports/
          
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/
          
      - name: Upload reports
        uses: actions/upload-artifact@v4
        with:
          name: analysis-reports
          path: reports/

  # 3. Deploy (only on main branch)
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    permissions:
      pages: write
      id-token: write
      
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
      
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Branch Protection Rules

Protect your main branch:

1. Go to **Settings** → **Branches**
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

### Deployment Environments

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://YOUR_USERNAME.github.io/YOUR_REPO-staging/
    
    steps:
      # Deploy to different repo or branch
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: staging
```

## Custom Domains

### Setting Up a Custom Domain

#### Option 1: Apex Domain (example.com)

1. **Add DNS Records**:
   ```
   Type  Host  Value
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   ```

2. **Create CNAME file**:
   ```bash
   echo "example.com" > src/CNAME
   ```

#### Option 2: Subdomain (www.example.com)

1. **Add CNAME Record**:
   ```
   Type   Host   Value
   CNAME  www    YOUR_USERNAME.github.io
   ```

2. **Create CNAME file**:
   ```bash
   echo "www.example.com" > src/CNAME
   ```

### HTTPS Configuration

GitHub Pages automatically provides HTTPS for custom domains:

1. Wait for DNS propagation (up to 24 hours)
2. Go to **Settings** → **Pages**
3. Check **Enforce HTTPS**

### Handling www and non-www

Add redirect rules in your HTML:

```html
<!-- Canonical URL -->
<link rel="canonical" href="https://www.example.com/current-page">

<!-- JavaScript redirect (if needed) -->
<script>
  if (window.location.hostname === 'example.com') {
    window.location.hostname = 'www.example.com';
  }
</script>
```

### Email Configuration

GitHub Pages doesn't support server-side code, so for contact forms:

1. **Use a third-party service**:
   ```javascript
   // Using Formspree
   const form = document.getElementById('contact-form');
   form.action = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

2. **Or use mailto links**:
   ```html
   <a href="mailto:contact@example.com?subject=Hello%20from%20BSB">
     Email Us
   </a>
   ```

## Performance Optimizations

### Pre-deployment Optimizations

1. **Image Optimization**:
   ```bash
   # Install sharp-cli
   npm install -g sharp-cli
   
   # Optimize images
   sharp -i src/assets/images/*.jpg -o dist/assets/images/ -q 85
   ```

2. **Resource Hints**:
   ```html
   <!-- Preconnect to external domains -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   
   <!-- Prefetch likely next pages -->
   <link rel="prefetch" href="/about.html">
   ```

3. **Service Worker for Offline**:
   ```javascript
   // sw.js
   const CACHE_NAME = 'bsb-v1';
   const urlsToCache = [
     '/',
     '/styles/main.css',
     '/scripts/main.js',
     '/offline.html'
   ];
   
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then(cache => cache.addAll(urlsToCache))
     );
   });
   ```

### GitHub Pages Optimizations

1. **Enable Compression**:
   GitHub Pages automatically serves gzipped content when:
   - File is >1KB
   - Client supports gzip
   - File type is compressible

2. **Leverage Browser Caching**:
   ```html
   <!-- Use versioned filenames -->
   <link rel="stylesheet" href="/styles/main.v1.2.3.css">
   
   <!-- Or use query strings -->
   <script src="/scripts/app.js?v=1.2.3"></script>
   ```

3. **Optimize for GitHub's CDN**:
   - Keep individual files <100MB
   - Total repository <1GB
   - Use `.gitattributes` for large files:
     ```
     *.psd filter=lfs diff=lfs merge=lfs -text
     *.zip filter=lfs diff=lfs merge=lfs -text
     ```

### Monitoring Performance

```yaml
# Add to deployment workflow
- name: Performance Budget Check
  run: |
    # Check total size
    total_size=$(du -sb dist | cut -f1)
    if [ $total_size -gt 5242880 ]; then  # 5MB
      echo "⚠️ Build size exceeds 5MB: $total_size bytes"
      exit 1
    fi
    
    # Check individual files
    find dist -type f -size +500k -exec ls -lh {} \;
```

## Security Considerations

### Security Headers

Since GitHub Pages doesn't allow server configuration, use meta tags:

```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.google-analytics.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;">

<!-- Other security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### Secrets Management

Never commit sensitive data:

1. **Use GitHub Secrets**:
   ```yaml
   - name: Build with API key
     run: npm run build
     env:
       VITE_API_KEY: ${{ secrets.API_KEY }}
   ```

2. **Environment-specific builds**:
   ```javascript
   // vite.config.js
   export default defineConfig({
     define: {
       __API_ENDPOINT__: JSON.stringify(
         process.env.NODE_ENV === 'production'
           ? 'https://api.example.com'
           : 'http://localhost:3001'
       )
     }
   });
   ```

### Dependency Security

```yaml
# Add security scanning to workflow
- name: Security Audit
  run: |
    npm audit --production
    npx snyk test
```

## Monitoring and Analytics

### GitHub Pages Analytics

GitHub provides basic analytics:
1. Go to **Insights** → **Traffic**
2. View:
   - Page views
   - Unique visitors
   - Referring sites
   - Popular content

### Adding Google Analytics

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Privacy-Friendly Analytics

Consider alternatives like:

1. **Plausible Analytics**:
   ```html
   <script defer data-domain="example.com" 
           src="https://plausible.io/js/script.js"></script>
   ```

2. **GoatCounter**:
   ```html
   <script data-goatcounter="https://MYCODE.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   ```

### Uptime Monitoring

```yaml
# .github/workflows/uptime.yml
name: Uptime Check

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check site status
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://YOUR_SITE.com)
          if [ $response -ne 200 ]; then
            echo "Site is down! Status: $response"
            exit 1
          fi
```

## Troubleshooting

### Common Issues and Solutions

#### 1. 404 Error on Deployment

**Problem**: Site shows 404 after deployment

**Solutions**:
- Check base path in `vite.config.js`
- Ensure `dist` folder is being deployed
- Verify GitHub Pages is enabled
- Wait 10 minutes for propagation

#### 2. Assets Not Loading

**Problem**: CSS/JS/Images return 404

**Solutions**:
```javascript
// Fix paths in vite.config.js
export default defineConfig({
  base: '/your-repo-name/',  // Must match repo name
  build: {
    assetsDir: 'assets',      // Consistent asset directory
  }
});
```

#### 3. CORS Errors

**Problem**: Fonts or assets blocked by CORS

**Solutions**:
- Host assets in your repository
- Use relative paths
- For external assets, ensure CORS headers

#### 4. Build Failing in Actions

**Problem**: Local build works, GitHub Actions fails

**Solutions**:
```yaml
# Debug workflow
- name: Debug information
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Directory contents:"
    ls -la
    
# Clear cache
- name: Clear cache
  run: |
    npm cache clean --force
    rm -rf node_modules
    npm install
```

#### 5. Custom Domain Not Working

**Problem**: Custom domain shows 404 or certificate error

**Solutions**:
1. Verify DNS records:
   ```bash
   dig example.com
   dig www.example.com
   ```

2. Check CNAME file:
   ```bash
   cat dist/CNAME  # Should contain your domain
   ```

3. Wait for propagation (up to 24 hours)

### Deployment Checklist

```markdown
## Pre-Deployment Checklist

- [ ] Base path configured correctly
- [ ] All links use relative paths or base URL
- [ ] Images optimized (<500KB each)
- [ ] Console.log statements removed
- [ ] Build runs without errors
- [ ] Tests pass
- [ ] Lighthouse scores meet thresholds
- [ ] CNAME file included (if custom domain)
- [ ] Security headers added
- [ ] Analytics configured
- [ ] 404 page created
- [ ] Robots.txt updated
- [ ] Sitemap generated
- [ ] Open Graph tags added
```

### Rollback Strategy

```yaml
# Rollback workflow
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.commit_sha }}
          
      - name: Build and deploy
        run: |
          npm ci
          npm run build
          # Deploy process...
```

## Advanced Deployment Strategies

### Multi-Region Deployment

Use Cloudflare Pages for global deployment:

```yaml
# .github/workflows/deploy-cloudflare.yml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: 'bsb-site'
    directory: 'dist'
```

### A/B Testing

Implement client-side A/B testing:

```javascript
// ab-test.js
const experiments = {
  heroText: {
    control: 'Welcome to BSB',
    variant: 'Start Building Today'
  }
};

function getVariant(experimentId) {
  const random = Math.random();
  return random > 0.5 ? 'variant' : 'control';
}

// Apply variant
const variant = getVariant('heroText');
document.querySelector('.hero-title').textContent = 
  experiments.heroText[variant];

// Track results
gtag('event', 'experiment_view', {
  experiment_id: 'heroText',
  variant_id: variant
});
```

### Progressive Web App

Make your site installable:

```json
// manifest.json
{
  "name": "BSB Learning Platform",
  "short_name": "BSB",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0066cc",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Summary

You've mastered deployment with GitHub Pages! Key takeaways:

### 🎯 Best Practices

1. **Automate everything** - Use GitHub Actions for CI/CD
2. **Monitor performance** - Set up alerts and budgets
3. **Security first** - Never commit secrets
4. **Test thoroughly** - Check all environments
5. **Document process** - Keep deployment guides updated

### 🚀 Next Steps

1. Set up your first deployment
2. Configure a custom domain
3. Implement performance monitoring
4. Explore advanced deployment options
5. Read the [Performance Optimization](./performance.md) tutorial

### 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Web Performance](https://web.dev/performance/)
- [Security Headers](https://securityheaders.com/)

### Quick Reference

```bash
# Common deployment commands
npm run build              # Build for production
npm run preview            # Preview production build
npm run deploy             # Manual deployment
npm run analyze            # Analyze bundle size

# GitHub Pages URLs
https://username.github.io/repo/          # Main site
https://username.github.io/repo/404.html  # 404 page
https://username.github.io/repo/sitemap.xml # Sitemap

# Debugging
curl -I https://your-site.com  # Check headers
lighthouse https://your-site.com # Performance audit
```

---

*Remember: Deployment is not the end—it's the beginning of your site's journey. Keep monitoring, optimizing, and improving!* 🚀