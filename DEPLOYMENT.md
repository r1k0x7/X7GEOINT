# X7 GEOINT - Vercel Deployment Guide

## 🚀 Cara Deploy ke Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/x7-geoint.git
   git push -u origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository GitHub kamu
   - Framework Preset: **Next.js**
   - Klik "Deploy"

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "document is not defined" (SSR Error)
**Cause**: Three.js menggunakan `document` yang hanya ada di browser, tidak di server.
**Solution**: ✅ Sudah di-fix dengan:
- `dynamic(() => import('@/components/Globe3D'), { ssr: false })`
- `typeof window !== 'undefined'` checks
- `isClient` state dengan `useEffect`

### Issue 2: "Images cannot be optimized"
**Cause**: Next.js Image Optimization tidak work dengan static export.
**Solution**: ✅ Sudah di-fix dengan `images: { unoptimized: true }`

### Issue 3: "Module not found" atau import errors
**Cause**: Case-sensitive file names atau path alias tidak terkonfigurasi.
**Solution**: ✅ Sudah di-fix dengan:
- `paths: { "@/*": ["./*"] }` di tsconfig.json
- Semua import menggunakan `@/components/...`

### Issue 4: Build timeout atau memory limit
**Cause**: Three.js bundle terlalu besar untuk Vercel free tier.
**Solution**: ✅ Sudah di-fix dengan:
- Next.js 14 (lebih stabil dari 15)
- React 18 (lebih ringan dari 19)
- Three.js v0.165 (versi stable)

### Issue 5: "Cannot find module 'next'"
**Cause**: Node.js version mismatch.
**Solution**: 
- Pastikan Node.js version di Vercel: **18.x atau 20.x**
- Atur di Vercel Dashboard → Settings → Node.js Version

---

## 🔧 Vercel Settings

### Build & Output Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables (jika diperlukan)
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 📋 Pre-Deployment Checklist

- [ ] `npm install` berhasil tanpa error
- [ ] `npm run build` berhasil di local
- [ ] Folder `dist/` ter-generate
- [ ] Tidak ada file `next.config.ts` (sudah diganti ke `.js`)
- [ ] Tidak ada file `tailwind.config.ts` (sudah diganti ke `.js`)

---

## 🧪 Test Build Local

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Check output
ls dist/
```

Jika build berhasil, folder `dist/` akan berisi file HTML statis.

---

## 📞 Troubleshooting

Jika masih gagal deploy, cek build logs di Vercel Dashboard:
1. Buka project di Vercel
2. Klik tab "Deployments"
3. Klik deployment yang failed
4. Scroll ke atas untuk lihat error pertama (bukan yang terakhir!)

Error pertama adalah root cause, error setelahnya biasanya cascading.
