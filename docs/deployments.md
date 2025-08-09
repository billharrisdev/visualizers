# GitHub Pages Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

## How it works

- On every push to the `main` branch, GitHub Actions will:
  1. Install dependencies with `npm ci`.
  2. Build the production React app with `npm run build`.
  3. Deploy the contents of the `build` directory to the `gh-pages` branch.

## Your site will be available at

```
https://billharrisdev.github.io/visualizers/
```

## To customize

- If your repository is not at the root of your user/organization's GitHub Pages, add this to your `package.json`:

  ```json
  "homepage": "https://billharrisdev.github.io/visualizers"
  ```

- Make sure your `npm run build` command outputs to the `build` directory.

## Manual deployment

If you want to trigger the workflow manually, you can do so from the "Actions" tab on GitHub.
