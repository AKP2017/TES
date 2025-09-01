# Copilot Instructions for the TES Repository

## Overview
This repository contains the codebase for the Shibaro website. The project appears to be a static website with HTML, JavaScript, and supporting assets. The primary purpose of this site is to serve as the Shibaro website.

## Key Files and Directories
- `index.html`: The main entry point for the website.
- `business.html`: A secondary HTML page, likely for business-related content.
- `functions/solopool.js`: Contains JavaScript functionality. Analyze this file for reusable patterns or logic.
- `sitemap.xml`: Defines the structure of the website for search engines.
- `robots.txt`: Provides instructions for web crawlers.
- `CNAME`: Likely used for custom domain configuration.
- `shibaroo-logo.png`: The website's logo.

## Project-Specific Conventions
- **Static Website**: The project is structured as a static website. There is no evidence of server-side code or frameworks.
- **File Organization**: All files are located in the root directory or within the `functions` folder. Keep this structure consistent when adding new files.

## Development Workflow
1. **Editing HTML**: Update `index.html` or `business.html` for content changes.
2. **JavaScript Updates**: Modify `functions/solopool.js` for any interactive or dynamic functionality.
3. **Assets**: Add or update images and other assets directly in the root directory.

## Testing and Debugging
- Open the HTML files in a browser to test changes.
- Use browser developer tools to debug JavaScript in `functions/solopool.js`.

## Deployment
- Ensure all changes are committed to the `main` branch.
- Verify that `CNAME` and `sitemap.xml` are correctly configured for deployment.

## Notes for AI Agents
- Follow the existing file organization and naming conventions.
- Avoid introducing server-side code unless explicitly requested.
- When adding new functionality, ensure it integrates seamlessly with the static nature of the site.

## Examples
- **Adding a New Page**: Create a new `.html` file in the root directory and link it from `index.html`.
- **Updating JavaScript**: Add functions to `functions/solopool.js` and ensure they are invoked in the relevant HTML files.

For further clarification or updates, consult the repository owner.
