# Contributing

First off, thanks for taking the time to contribute! These are the guidelines for contributing to this project.

## Development Setup

Make sure you have the latest LTS version of [Node.js](https://nodejs.org/en/download/current) installed.

Clone the repository:
```bash
git clone https://github.com/jrwnnnn/re-color.git
cd re-color
```
Install the required dependencies:
```bash
npm ci
```
Start the development server:
```bash
npm run dev       # optional: pass --host flag expose the server to the local network
```
Bundle the project for production:
```bash
npm run build
```
## Testing
Before submitting a pull request, ensure everything passes locally:

```bash
# Run all unit tests
npm run test

# Run typechecking
npm run typecheck
```
## CI Checks

All pull requests must pass the [GitHub Actions](https://github.com/jrwnnnn/re-color/actions/workflows/main.yml) before they can be merged. The CI runs the following checks:

- Typechecking
- Build
- CodeQL analysis
  
## Code Style

This project enforces a consistent code style using [Prettier](https://prettier.io/). 

A `.prettierrc` file is included in the project root to configure Prettier. Please ensure that your code adheres to the formatting rules defined in this file before submitting a pull request.

## Commit Messages

Follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification.