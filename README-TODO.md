# Nivrita - Simple Todo App with Cloudflare D1

A modern, responsive todo application built with Next.js and Cloudflare D1 database using Drizzle ORM.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Clean, modern UI with Tailwind CSS
- ✅ Cloudflare D1 database integration
- ✅ Drizzle ORM for type-safe database operations
- ✅ No user authentication (simple todo app)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Deployment**: Cloudflare Workers/Pages
- **Validation**: Zod

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Cloudflare account
- Wrangler CLI

### Setup

1. **Clone and install dependencies**:

   ```bash
   cd nivrita
   npm install
   ```

2. **Set up Cloudflare D1 database**:

   ```bash
   # Create D1 database
   npx wrangler d1 create nivrita-todo-db
   
   # Update wrangler.jsonc with your database ID
   # Copy the database_id from the command output
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env.local
   # Update with your Cloudflare credentials
   ```

4. **Run database migrations**:

   ```bash
   # Apply to local database
   npx wrangler d1 migrations apply nivrita-todo-db --local
   ```

5. **Start development server**:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see your todo app!

## Database Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT false NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

## API Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Deployment

### To Cloudflare

1. **Configure remote database**:

   ```bash
   # Apply migrations to remote database
   npx wrangler d1 migrations apply nivrita-todo-db --remote
   ```

2. **Deploy the application**:

   ```bash
   npm run deploy
   # or use the provided script
   ./deploy.sh
   ```

### Environment Variables for Production

Set these in your Cloudflare Workers environment:

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_DATABASE_ID`: Your D1 database ID
- `CLOUDFLARE_D1_TOKEN`: Your D1 API token

## Project Structure

```
src/
├── app/
│   ├── page.js              # Main page component
│   ├── layout.js            # Root layout
│   └── api/
│       └── todos/
│           ├── route.js     # CRUD operations
│           └── [id]/
│               └── route.js # Individual todo operations
├── components/
│   └── TodoApp.js           # Main todo application component
└── db/
    ├── index.ts             # Database connection
    └── schema.ts            # Database schema and types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

---

Built with ❤️ using Cloudflare D1 and Drizzle ORM
