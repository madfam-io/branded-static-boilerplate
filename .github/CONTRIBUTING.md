# Contributing to Branded Static Boilerplate

Thank you for your interest in contributing to BSB! This document provides guidelines and instructions for contributing.

## 🎯 Our Philosophy

BSB is built on the principle that "the best documentation lives with the code." Every contribution should:

1. Include comprehensive inline documentation
2. Follow existing patterns and conventions
3. Enhance the learning experience
4. Maintain backward compatibility

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/branded-static-boilerplate.git
   cd branded-static-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## 📝 Contribution Guidelines

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments explaining the "why", not just the "what"
- Ensure all code passes linting: `npm run lint`

### Documentation

Every contribution must include:

1. **Inline Comments**: Explain complex logic and decisions
2. **README Updates**: Update relevant README files
3. **Example Usage**: Provide clear examples
4. **Learning Notes**: Add educational comments for beginners

### Component Contributions

When adding a new component:

1. Create component directory: `/src/components/your-component/`
2. Include all required files:
   - `your-component.html` - Semantic HTML structure
   - `your-component.css` - Scoped styles
   - `your-component.js` - Progressive enhancements (optional)
   - `README.md` - Component documentation

3. Follow the component template:
   ```html
   <!--
     =============================================================================
     COMPONENT NAME - Brief Description
     =============================================================================
     
     Detailed description of what this component does.
     
     🎯 Usage:
     - How to implement
     - Common use cases
     
     📚 Learn More:
     - Related documentation
     - Best practices
     
     💡 Tips:
     - Customization options
     - Performance considerations
     =============================================================================
   -->
   ```

### CSS Guidelines

- Use CSS custom properties for customization
- Follow BEM naming convention: `.component__element--modifier`
- Ensure responsive design (mobile-first)
- Test in multiple browsers

### JavaScript Guidelines

- Write vanilla JavaScript (no frameworks in core)
- Ensure progressive enhancement
- Add error handling
- Document all functions with JSDoc

## 🧪 Testing

Before submitting:

1. **Run all tests**
   ```bash
   npm test
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Test in browsers**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile browsers

4. **Check accessibility**
   - Use keyboard navigation
   - Test with screen readers
   - Verify color contrast

## 📥 Submitting Pull Requests

1. **Commit messages**
   - Use clear, descriptive messages
   - Follow conventional commits format:
     ```
     feat: add new card component variant
     fix: correct mobile menu overflow issue
     docs: update installation instructions
     ```

2. **Pull request description**
   - Describe what changes you made
   - Explain why these changes are needed
   - Include screenshots for UI changes
   - Reference any related issues

3. **PR checklist**
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests pass
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] Accessible

## 🐛 Reporting Issues

When reporting issues, include:

1. **Description**: Clear explanation of the problem
2. **Steps to reproduce**: How to recreate the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Browser, OS, version
6. **Screenshots**: If applicable

## 💡 Feature Requests

We love new ideas! When suggesting features:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case**
4. **Provide examples** if possible

## 🏗️ Project Structure

Understanding our structure helps contributions fit seamlessly:

```
src/
├── components/     # Reusable components
├── styles/        # Global styles and utilities
├── scripts/       # JavaScript modules
├── assets/        # Images, fonts, icons
└── pages/         # Static HTML pages

docs/
├── tutorials/     # Step-by-step guides
├── api/          # Component API documentation
└── examples/     # Real-world examples
```

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙋 Getting Help

- **Discord**: [Join our community](#)
- **Discussions**: Use GitHub Discussions
- **Email**: bsb@example.com

## 🏆 Recognition

Contributors are recognized in:
- Our README.md file
- The contributors page
- Release notes

Thank you for helping make BSB better for everyone! 🎉