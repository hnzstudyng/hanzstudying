# Notes - Private Blog Application

A modern, private blog and notes application built with Next.js 16, React, MongoDB, and TipTap rich-text editor. Perfect for securely storing your personal articles, thoughts, and ideas with a beautiful, responsive interface.

## Features

✨ **Core Features**
- 🔐 Password-protected access (owner-only)
- ✍️ Rich-text editor with markdown support
- 📝 Draft and published article states
- 🏷️ Tag and category organization
- 🔍 Full-text search across articles
- 📊 Word count and reading time estimates
- 💾 Auto-save functionality
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: MongoDB (NoSQL)
- **Rich-Text Editor**: TipTap
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: SWR (for client-side data fetching)
- **Authentication**: Custom session-based (password)
- **Hosting**: Vercel (recommended)

## Prerequisites

Before getting started, make sure you have:
- Node.js 18+ and pnpm installed
- MongoDB instance (local or MongoDB Atlas)
- A strong password for owner access

## Installation & Setup

### 1. Clone or Download the Project
```bash
# If using GitHub
git clone <your-repo-url>
cd notes-app

# Or download and extract the ZIP file
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-db

# Owner password (use a strong password)
OWNER_PASSWORD=your_secure_password_here

# Session encryption secret (generate with: openssl rand -base64 32)
SESSION_SECRET=your_generated_secret_here
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser. The app will redirect to the login page.

## Usage

### First Login
1. Navigate to `http://localhost:3000`
2. Enter your owner password (from `OWNER_PASSWORD` env variable)
3. Click "Enter" to access the dashboard

### Creating Articles

1. **New Article**: Click "New Article" button in the sidebar
2. **Write Content**: 
   - Add title (required)
   - Add optional description (appears in article cards)
   - Select category for organization
   - Add tags (press Enter after typing each tag)
3. **Rich-Text Editor**: Use the toolbar for formatting
   - Headings (H1, H2)
   - Text formatting (Bold, Italic, Strike, Code)
   - Lists (bullet, ordered)
   - Blockquotes, code blocks
   - Undo/Redo
4. **Save/Publish**:
   - Click "Save" to save as draft
   - Click "Publish" to publish article (visible in dashboard)

### Organizing Articles

- **Dashboard**: View all published articles
- **Drafts**: Access unpublished articles for editing
- **Search**: Full-text search across title, content, and description
- **Filter**: Search by category or tag

### Article Management

- All edits are saved automatically
- Published articles show word count and reading time
- Drafts can be published later
- Unpublished drafts remain private
- Articles can be edited anytime

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### 3. Set Environment Variables in Vercel
In your Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add the following:
   - `MONGODB_URI`: Your MongoDB connection string
   - `OWNER_PASSWORD`: Your secure password
   - `SESSION_SECRET`: Your generated secret

### 4. Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Your app will be live at `https://your-project.vercel.app`

## Architecture

### File Structure
```
app/
├── api/
│   ├── articles/          # Article CRUD endpoints
│   └── auth/              # Login/logout endpoints
├── dashboard/             # Protected routes
│   ├── articles/          # Article editor
│   ├── drafts/            # Draft articles
│   └── search/            # Search page
└── login/                 # Login page

components/
├── RichTextEditor.tsx     # TipTap editor
├── ArticleCard.tsx        # Article list item
├── Sidebar.tsx            # Navigation
└── ErrorBoundary.tsx      # Error handling

lib/
├── mongodb.ts             # MongoDB connection
├── auth.ts                # Authentication utilities
└── models/
    └── Article.ts         # Article schema

hooks/
├── useAuth.ts             # Auth hook
└── useArticles.ts         # Article CRUD hooks
```

### Database Schema

**Articles Collection**
```typescript
{
  _id: ObjectId
  title: string
  content: string (HTML from editor)
  description: string
  tags: [string]
  category: string
  status: 'draft' | 'published'
  wordCount: number
  readTime: number
  createdAt: Date
  updatedAt: Date
}
```

## Security

- ✅ Password hashing with SHA-256
- ✅ Session-based authentication with HMAC validation
- ✅ HTTP-only cookies (secure in production)
- ✅ CSRF protection via Next.js middleware
- ✅ 7-day session expiration
- ✅ Middleware protection for all protected routes
- ✅ Per-query MongoDB operations (no RLS needed)

## API Reference

### Authentication

**POST /api/auth/login**
```json
{
  "password": "your_password"
}
```

**POST /api/auth/logout**
- Requires valid session cookie

### Articles

**GET /api/articles**
Query parameters:
- `status`: 'draft' or 'published'
- `search`: Search term
- `tag`: Filter by tag
- `category`: Filter by category
- `sort`: Sort field (default: '-updatedAt')

**POST /api/articles**
```json
{
  "title": "Article Title",
  "content": "<p>HTML content</p>",
  "description": "Brief description",
  "tags": ["tag1", "tag2"],
  "category": "Technology",
  "status": "draft"
}
```

**GET /api/articles/[id]**
- Returns single article

**PUT /api/articles/[id]**
- Update article (same schema as POST)

**DELETE /api/articles/[id]**
- Delete article

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas firewall settings allow your IP
- Ensure database user has read/write permissions

### Login Issues
- Verify `OWNER_PASSWORD` matches what you're entering
- Check `SESSION_SECRET` is set and valid
- Clear browser cookies and try again

### Session Expires
- Sessions last 7 days by default
- You'll be redirected to login when session expires
- This is for security

### Articles Not Saving
- Check browser console for errors
- Verify MongoDB connection is working
- Check article content is not exceeding size limits
- Try refreshing the page

## Performance Tips

- MongoDB Atlas free tier supports unlimited articles
- Implement pagination for large article lists
- Use CDN for static assets
- Consider adding caching with Upstash Redis for frequently accessed articles

## Future Enhancements

- [ ] Article export (PDF, Markdown)
- [ ] Dark mode toggle (already supports system preference)
- [ ] Article analytics
- [ ] Multiple owner accounts with user management
- [ ] Article sharing with private links
- [ ] AI-powered tagging and categorization
- [ ] Desktop/mobile app with Electron or React Native

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainer.

---

Built with ❤️ using Next.js 16, React, and MongoDB
