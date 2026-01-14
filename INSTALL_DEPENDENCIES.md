# Installing Dependencies

The required dependencies have been added to `package.json`. To install them, run:

```bash
npm install
```

This will install:
- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind CSS classes
- `zod` - For schema validation
- `@supabase/ssr` - Supabase client for Next.js Server Components

## If npm is not found

If you get an error that `npm` is not recognized, try one of these solutions:

1. **Open a new terminal window** - Sometimes the PATH isn't loaded in the current session

2. **Use Node Version Manager (if installed)**:
   ```bash
   nvm use node
   npm install
   ```

3. **Check if Node.js is installed**:
   ```bash
   node --version
   npm --version
   ```
   If these commands don't work, you may need to install Node.js from [nodejs.org](https://nodejs.org/)

4. **Try using a different package manager** (if available):
   ```bash
   yarn install
   # or
   pnpm install
   ```

## After Installation

Once dependencies are installed, you can:

1. Set up your `.env.local` file with Supabase credentials
2. Run the development server: `npm run dev`
3. Start using the application!
