# Build and Deployment Guide

## Overview

BSB uses a robust build system that ensures your static site is always production-ready. The pre-commit hooks guarantee that every commit includes a fresh build, making deployment seamless.

## Build System

### Automatic Builds

**Pre-commit Hook**: Every commit automatically triggers:
1. Code linting (ESLint + Stylelint)
2. Fresh build generation
3. Build artifacts added to git

This ensures:
- ✅ No broken code reaches the repository
- ✅ The `dist/` folder is always up-to-date
- ✅ GitHub Pages always has the latest build

### Manual Building

```bash
# Development build with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Build Configuration

The build process (via Vite) includes:
- HTML minification
- CSS optimization with PostCSS
- JavaScript bundling and tree-shaking
- Asset optimization
- Source maps for debugging

## Git Hooks

BSB uses Husky to manage git hooks that ensure code quality:

### Pre-commit Hook
- Runs linters
- Generates fresh build
- Adds `dist/` to commit

### Commit-msg Hook
- Enforces conventional commit format
- Examples: `feat: add new component`, `fix: correct mobile layout`

### Post-merge Hook
- Updates dependencies if package.json changed
- Rebuilds if source files changed

## Deployment

### GitHub Pages (Recommended)

1. **Automatic Deployment**
   - Push to `main` branch
   - GitHub Actions builds and deploys
   - Site available at: `https://[username].github.io/[repo-name]/`

2. **Initial Setup**
   ```bash
   # In your GitHub repository:
   # Settings > Pages > Source: GitHub Actions
   ```

3. **Custom Domain**
   - Add CNAME file to `src/` with your domain
   - Configure DNS settings
   - Update `base` in `vite.config.js`

### Manual Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy

# This runs:
# 1. npm run build
# 2. gh-pages -d dist
```

### Other Platforms

The `dist/` folder can be deployed to any static hosting:

**Netlify**
```bash
# netlify.toml
[build]
  publish = "dist"
```

**Vercel**
```json
// vercel.json
{
  "outputDirectory": "dist"
}
```

**AWS S3**
```bash
aws s3 sync dist/ s3://your-bucket-name
```

## Build Optimization

### Performance Tips

1. **Image Optimization**
   - Use appropriate formats (WebP, AVIF)
   - Implement lazy loading
   - Optimize dimensions

2. **Code Splitting**
   - Vite automatically splits vendor code
   - Use dynamic imports for large components

3. **Caching**
   - Assets include content hashes
   - Configure server cache headers

### Environment Variables

Create `.env.local` for local configuration:
```env
# API endpoints, keys, etc.
VITE_API_URL=https://api.example.com
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Troubleshooting

### Build Fails in Pre-commit

**Linting Errors**
```bash
# See detailed errors
npm run lint

# Auto-fix what's possible
npm run format
```

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

### Deployment Issues

**GitHub Pages 404**
- Check repository settings
- Ensure GitHub Actions completed
- Verify `base` path in `vite.config.js`

**Assets Not Loading**
- Check relative paths
- Ensure `base` configuration matches deployment URL
- Verify asset files are in `dist/`

### Skipping Hooks (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify

# Note: This should be rare! The hooks ensure quality.
```

## Best Practices

1. **Always Test Locally**
   ```bash
   npm run build
   npm run preview
   ```

2. **Monitor Build Size**
   - Check `dist/` folder size
   - Use build analyzer if needed

3. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Use Conventional Commits**
   - Makes changelog generation possible
   - Improves team communication
   - Examples:
     - `feat: add dark mode toggle`
     - `fix: correct header spacing on mobile`
     - `docs: update deployment guide`

## Continuous Integration

The GitHub Actions workflow:

1. **Triggers on**
   - Push to `main`
   - Manual dispatch

2. **Steps**
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Run linters
   - Build site
   - Deploy to GitHub Pages

3. **Configuration**
   - See `.github/workflows/deploy.yml`
   - Customize as needed

## Advanced Configuration

### Custom Build Steps

Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-sitemap.js",
    "postbuild": "node scripts/optimize-images.js"
  }
}
```

### Multiple Environments

```bash
# Development
npm run dev

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

## Summary

The BSB build system ensures:
- 🚀 Every commit is deployable
- 🔒 Code quality is maintained
- 📦 Builds are optimized
- 🌐 Deployment is automated

Follow the conventions, trust the process, and focus on building great websites!