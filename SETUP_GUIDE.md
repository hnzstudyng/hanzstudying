# 🚀 Notes App - Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Environment Variables

First, you need to set up your environment variables. There are two ways to do this:

#### Option A: Using `.env.local` file (Local Development)
1. Create a file named `.env.local` in the root of your project
2. Add these three variables:

```env
OWNER_PASSWORD=your_secure_password_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-db
SESSION_SECRET=your_generated_secret_here
```

#### Option B: Using Vercel Dashboard (For Deployment)
1. Go to your Vercel project settings
2. Click **Settings** → **Environment Variables**
3. Add the same three variables
4. Click **Save and Redeploy**

### Step 2: Install MongoDB (If Not Using Cloud)

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" and copy your connection string
5. Replace username and password in the connection string
6. Paste it as `MONGODB_URI` in your environment variables

**Option B: Local MongoDB**
1. Download from [mongodb.com/community/download-community](https://www.mongodb.com/community/download-community)
2. Install and run MongoDB locally
3. Use this connection string: `mongodb://localhost:27017/notes-db`

### Step 3: Generate SESSION_SECRET

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `SESSION_SECRET` value.

### Step 4: Install Dependencies & Run

```bash
# Install all packages
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` and login with your password!

---

## Environment Variables Explained

### `OWNER_PASSWORD`
- **What it is**: The password to access your private blog
- **Choose carefully**: Use a strong password (mix of uppercase, lowercase, numbers, symbols)
- **Example**: `MySecure@Pass123!`

### `MONGODB_URI`
- **What it is**: Your MongoDB connection string
- **From MongoDB Atlas**: 
  ```
  mongodb+srv://<username>:<password>@cluster.mongodb.net/<database-name>
  ```
- **From Local MongoDB**:
  ```
  mongodb://localhost:27017/notes-db
  ```

### `SESSION_SECRET`
- **What it is**: Encryption key for session cookies
- **Must be secure**: Generate with `openssl rand -base64 32`
- **Example output**: `a3B7kL9mN2pQrS5tU8vW1xYz+AbCdEfGhIjKlMnOpQr=`

---

## First Time Setup Checklist

- [ ] MongoDB instance created or local MongoDB running
- [ ] `MONGODB_URI` environment variable set
- [ ] `OWNER_PASSWORD` environment variable set
- [ ] `SESSION_SECRET` generated and set
- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Can access `http://localhost:3000`
- [ ] Successfully logged in with password

---

## Deployment to Vercel

### Prerequisites
- GitHub repository created and connected
- All code pushed to GitHub

### Steps

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add:
     - `OWNER_PASSWORD`: Your secure password
     - `MONGODB_URI`: Your MongoDB connection string
     - `SESSION_SECRET`: Your generated secret
   - Click **Save**

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)
   - Your app is now live!

5. **Get Your URL**
   - Vercel will show you the deployment URL
   - Share this URL to access your private blog
   - Example: `https://my-notes-app.vercel.app`

---

## Troubleshooting

### "MongoDB Connection Failed"
**Problem**: Can't connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas firewall allows your IP (add 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions
- Test connection string directly with MongoDB Compass

### "Invalid Password"
**Problem**: Login fails with "Invalid password"
**Solution**:
- Double-check `OWNER_PASSWORD` value (case-sensitive!)
- Make sure password was properly saved in env variables
- Restart dev server after changing env variables

### "Session Expired"
**Problem**: You're logged out after a few days
**Solution**:
- Sessions expire after 7 days for security
- Just log in again with your password
- This is normal and expected behavior

### "MongoDB URI Error"
**Problem**: Error with connection string format
**Solution**:
```
✓ Correct format: mongodb+srv://user:pass@cluster.mongodb.net/dbname
✓ Local format: mongodb://localhost:27017/dbname
✗ Wrong: mongodb://cluster.mongodb.net/dbname (missing user:pass)
```

### "env variables not loading"
**Problem**: Changes to `.env.local` not taking effect
**Solution**:
1. Stop dev server (Ctrl+C)
2. Wait 2 seconds
3. Start dev server again (`pnpm dev`)
4. Clear browser cache if needed

---

## Next Steps

After successful setup:

1. **Create Your First Article**
   - Click "New Article" in dashboard
   - Write your title and content
   - Add tags and category
   - Click "Save" to save as draft or "Publish" to publish

2. **Organize Your Articles**
   - Use tags for better organization
   - Categories help group similar topics
   - Search functionality finds articles by keyword

3. **Deploy to Production**
   - Follow "Deployment to Vercel" section above
   - Your app will be accessible anywhere
   - All your articles are private and secure

4. **Customize (Optional)**
   - Change `OWNER_PASSWORD` anytime
   - Modify colors/theme in `app/globals.css`
   - Add custom domain on Vercel

---

## Security Best Practices

1. ✅ Use a strong password (12+ characters, mix of types)
2. ✅ Never share your `SESSION_SECRET` or connection string publicly
3. ✅ Keep MongoDB Atlas firewall configured securely
4. ✅ For production: Use environment variables, not `.env.local`
5. ✅ Sessions expire after 7 days - you'll need to login again

---

## Performance Tips

- MongoDB Atlas free tier is perfect for personal use
- App automatically calculates word count and reading time
- Search is powered by full-text MongoDB queries
- Deployed to Vercel for fast global access

---

## Need Help?

- Check the [README.md](./README.md) for full documentation
- Review error messages in browser console (F12)
- Check server logs for MongoDB connection issues
- Verify all three environment variables are set

---

**Happy writing! 📝✨**
