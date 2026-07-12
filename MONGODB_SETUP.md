# MongoDB Setup Guide

## Quick Start

Aplikasi ini menggunakan **MongoDB** untuk menyimpan artikel. Ikuti langkah-langkah berikut untuk setup MongoDB:

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Buat MongoDB Atlas Account
1. Buka [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up dengan akun baru atau login
3. Buat organization dan project baru

### Step 2: Buat Database
1. Di dashboard Atlas, klik "Create Deployment"
2. Pilih **M0 Free Tier** (gratis, unlimited capacity untuk development)
3. Pilih provider: AWS, GCP, atau Azure
4. Pilih region terdekat
5. Klik "Create Deployment"

### Step 3: Setup Network Access
1. Di sidebar, klik "Security" → "Network Access"
2. Klik "Add IP Address"
3. Pilih "Allow access from anywhere" (untuk development saja)
4. Klik "Confirm"

### Step 4: Setup Database User
1. Di sidebar, klik "Security" → "Database Access"
2. Klik "Add New Database User"
3. Masukkan username dan password (ingat password ini!)
4. Pilih "Built-in Role": "Atlas admin"
5. Klik "Add User"

### Step 5: Get Connection String
1. Kembali ke Deployment Overview
2. Klik tombol "Connect"
3. Pilih "Drivers"
4. Pilih Node.js dan versi 4.0+
5. Copy connection string yang terlihat seperti:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Ganti `username` dan `password` dengan yang Anda buat
7. Tambahkan nama database di akhir (sebelum `?`):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hanzstudying?retryWrites=true&w=majority
   ```

## Option 2: MongoDB Community (Local)

### Setup Local MongoDB:
1. Download MongoDB dari [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install sesuai OS Anda
3. Start MongoDB service:
   ```bash
   # macOS dengan Homebrew
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```
4. Connection string untuk local:
   ```
   mongodb://localhost:27017/hanzstudying
   ```

## Environment Variables

Set env variables di file `.env.development.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hanzstudying?retryWrites=true&w=majority
OWNER_PASSWORD=your_secure_password
SESSION_SECRET=your_random_session_secret
```

### Cara generate SESSION_SECRET:
```bash
openssl rand -base64 32
```

## Verify Connection

Test apakah MongoDB connected:
1. Login ke aplikasi
2. Buka "New Article"
3. Klik "Create Article"
4. Jika berhasil, Anda akan diarahkan ke editor
5. Jika error "Failed to create article", check:
   - MONGODB_URI benar
   - Credentials (username/password) tepat
   - Network access di Atlas sudah disetup

## Troubleshooting

### Error: "MONGODB_URI is not configured"
- Pastikan `.env.development.local` sudah dibuat
- Pastikan env var sudah benar

### Error: "Database connection failed"
- Check connection string format
- Verify credentials di MongoDB Atlas
- Pastikan IP Anda sudah di whitelist (Network Access)

### Error: "Authentication failed"
- Verify username dan password di connection string
- Re-check credentials di MongoDB Atlas > Database Access

## Data Storage

Semua artikel disimpan di MongoDB dengan struktur:
```json
{
  "_id": "ObjectId",
  "title": "Article Title",
  "content": "HTML content",
  "description": "Brief description",
  "tags": ["tag1", "tag2"],
  "category": "General",
  "status": "draft|published",
  "wordCount": 150,
  "readTime": 2,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

Database unlimited capacity dengan free tier MongoDB Atlas!
