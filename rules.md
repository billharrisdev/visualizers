# Project Rules and Conventions

This document outlines the rules and conventions for developing in this repository.

## 1. Linting

All code should pass the project's linting checks before being committed. To enforce this, a pre-commit hook has been set up that automatically runs the linter on staged files.

The lint command is:
```bash
npm run lint
```

## 2. Testing

This project uses **Jest** and **React Testing Library** for unit and component testing.

- All new features or bug fixes should be accompanied by tests where applicable.
- Tests should be placed in appropriate directories, following the existing project structure.
- The test command is:
  ```bash
  npm run test
  ```

### A Note on Agent Verification

The software agent (Jules) working on this repository may sometimes use other tools for its own internal verification process (e.g., Python with Playwright to generate screenshots of UI changes). These scripts are temporary, live in an untracked `jules-scratch` directory, and are **not** a substitute for the project's Jest tests. The primary testing framework for this repository remains Jest.
