# Sharing EZ Shopping App

## Quick Share (Temporary Link)

Run these commands to create a public URL anyone can visit:

```bash
cd Apps/ez-shopping
npm run build
npx serve dist -l 3333 &
npx localtunnel --port 3333
```

You'll get a URL like `https://random-words.loca.lt`

**Tunnel Password:** Your public IP (find it at https://ifconfig.me)
- Current IP: 107.122.105.132

**Note:** The link only works while your computer is on and the terminal is open.

## Permanent Deployment Options

### Surge (easiest)
```bash
cd Apps/ez-shopping
npm run build
npx surge dist
```
Follow prompts to create account and get a permanent URL.

### Vercel
```bash
cd Apps/ez-shopping
npx vercel login
npx vercel --yes --prod
```

### Netlify
Drag the `dist` folder to https://app.netlify.com/drop
