# SF CLI Web App

A single page app using the [Svelte framework](https://svelte.dev/) to generate Salesforce CLI commands, interactively.

## Running Locally

Pull the repository, install dependencies, and start the dev server:

```bash
npm install
```

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Commands

The commands are served from the [sfcommands.json](./static/sfcommands.json) file. This file is generated by running the command `sf commands --json` and saving the output to the file. If you have additional plugins installed, you may generate a new file by running the command `sf commands --json > ./static/sfcommands.json` from the project root.

## Org aliases

For `target-org` and `target-dev-hub` flags, the app will serve a list of choices from `./static/orgaliases.json`, if the file is present. You may generate this file by running the command `sf org:list --json > ./static/orgaliases.json` from the project root. If this file is not present, `target-org` and `target-dev-hub` flags will be rendered as text inputs.
