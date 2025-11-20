# Contributing

Contributions are welcome! Please follow these guidelines to contribute to the project.

## Getting Started

1. **Fork the repository**:
   - Click the "Fork" button on the top right of the repository page.

2. **Clone your forked repository**:
   ```bash
   git clone https://github.com/your-username/img-compressor-cli.git
   cd img-compressor-cli
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. Make your changes in the appropriate files
2. Follow the existing code style and conventions
3. Add tests for new features or bug fixes
4. Update documentation as needed

### Running Tests

Before submitting your changes, make sure all tests pass:

```bash
npm test
```

### Testing Locally

You can test the CLI locally before publishing:

```bash
# Link the package locally
npm link

# Test the CLI
img-compressor-com compress test/assets/img.jpg ./output -c webp -q 80

# Unlink when done
npm unlink
```

## Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add meaningful comments for complex logic
- Keep functions small and focused
- Follow existing naming conventions

## Commit Messages

Write clear and descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Start with a capital letter
- Keep the first line under 50 characters
- Add detailed description after a blank line if needed

Examples:
```
Add support for AVIF format
Fix memory leak in batch processing
Update README with new examples
```

## Pull Request Process

1. **Update documentation**: Ensure the README and other docs reflect your changes
2. **Update changelog**: Add your changes to the changelog.md file under "Unreleased"
3. **Pass all tests**: Make sure `npm test` passes
4. **Create pull request**: 
   - Provide a clear title and description
   - Reference any related issues
   - Explain what your changes do and why

### Pull Request Template

When creating a PR, please include:

- **What**: Brief description of the changes
- **Why**: Reason for the changes
- **How**: How the changes were implemented
- **Testing**: How you tested the changes
- **Screenshots**: If applicable (for CLI output changes)

## Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: 
  - Node.js version
  - npm version
  - Operating system
  - Package version

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists or has been requested
- Clearly describe the feature and its use case
- Explain why it would be useful to others

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the "question" label
- Start a discussion on GitHub Discussions
- Review existing issues and PRs for examples

## Recognition

Contributors will be recognized in:

- The project's README (if significant contribution)
- GitHub's contributors page
- Release notes for their specific contributions

Thank you for contributing to img-compressor-com! 🎉
