## Octolane AI

Octolane AI is an open-source project that provides a B2B Data Enrichment API powered by LLM. The project is built using Next.js and Prisma, and it uses various other libraries and tools such as Tailwind CSS for styling, Husky for Git hooks, and Prettier for code formatting.

---

### Getting Started

To get started with the project, you need to run the development server as follows:

Start the local postgres database from docker-compose file:
`docker-compose up -d`

Start the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

After running the server, you can open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

### Project Structure

The project is structured in a way that separates concerns and makes it easy to navigate. Here are some of the key directories and files:

- **src:** This directory contains the main application code. It includes subdirectories for components, pages, styles, and utilities.
- **prisma:** This directory contains the Prisma schema and migrations. The schema defines the database structure, and migrations are used to update the database over time.
- **public:** This directory contains static files that are served by the server. This includes images, fonts, and the site's favicon.
- **package.json:** This file contains the list of project dependencies and scripts.
- **.env:** This file contains environment variables.

### Environment Variables

The project uses environment variables for configuration. These are defined in the `src/constants/configs.ts` file. You need to provide these variables in a `.env` file at the root of the project. The `.env` file is ignored by Git as specified in the `.gitignore` file. Simply copy the `.env.example` file to `.env` and replace with your values.
