# Code Highlights Repository

This repository is a curated collection of standout code snippets, projects, and solutions that showcase my programming approach and technical skills. Each piece represents a unique solution, insight, or highlight from various projects I've worked on. You'll find code spanning multiple languages and frameworks, with annotations and documentation for context where applicable.

## Web App Components

### Form Controls ./src/components/form-controls

This is my goto implementation for form handling and client validations. Instead of using an external library I've rolled my own utilizing HTML5 validations and the api available in the browser. It follows WCAG 2.0 recomendations for form validations. Submitting the form without any fields filled will trigger all validations immediately and show the related errors. If part of the form is fulfilled when submitting the form will automatically focus the first input that has a validation error.

### Chart

I built this animated line chart outputting svg

## Svelte

### Svelte Store for handling formatting according to browser locale ./src/svelte/stores/formatter.ts
:
This is a helper store for handling numbers & dates utilizing browser api's. It derives the actual locale from a SvelteKit store $page. The locale is set in a server hook. 

## TypeScript 

### Prisma Extensions ./src/prisma/extensions

Here area various examples of extending prisma models manually that would accept computing properties based on relations. This used to be the recommended way by Prisma.io but now they encourage a different approach. I still much prefer this approach.

## Misc

### File / Directory structure

If we take a closer look at ./src/components/form-controls/ this is how I like to structure my component folders.
Pros: 
- I can use named imports like `import {Form, Input} from '$alias/components/form-controls`
- I can group various related components in same folder.
- When a file/buffer is open it will have a real file name and not just a bunch of index files
- Index file acts as redirection

Another example could be a Button component. I would like to keep it in its own folder, if I did not use this index file I would have to write `import Button from '$alias/components/button/button.svelte` with index file I can just do `import Button from '$alias/components/button` and still have various other files in the folder. When working on the file/buffer the name would still be `Button.svelte`

### Dotfiles

My [dotfiles](https://github.com/zwergius/dotfiles) implementation. I used to use a package to manage this for me, but after the 3rd got deprecated I decided to just make my own, using a makefile pattern.

### [www.eldánes.com](https://www.eldanés.com)

Fun fact, clicking the 'return' arrow in the top right corner will show the actual code of the page. I used githubs raw api to fetch it [see here](https://github.com/zwergius/el-danes/blob/master/src/routes/code/%5Bpage%5D.json/%2Bserver.ts)

### Cryptographic Library

I was the architect on this project, making the structure and functions. I did not make the crypto implementations [link](https://github.com/FortKnoxster/fortknoxster-crypto-web)
