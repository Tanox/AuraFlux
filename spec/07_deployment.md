<!-- openspec/07_deployment.md v2.3.4 -->
# 閮ㄧ讲涓庣幆澧冪郴缁熻鑼?
## 鐗堟湰淇℃伅
- **鐗堟湰**: v2.3.4
- **鏇存柊鏃ユ湡**: 2026-04-19
- **浣滆€?*: Sut

## 1. 鏋勫缓鐜

### 1.1 鏋勫缓宸ュ叿
- **宸ュ叿**: Vite 6.0+
- **鐩爣骞冲彴**: `esnext`
- **鍘嬬缉**: `esbuild`

### 1.2 鐜鍙橀噺
- **蹇呴』鍙橀噺**: `process.env.GEMINI_API_KEY` (鏈嶅姟鍣ㄧ)
- **鍙€夊彉閲?*: 鍏朵粬閰嶇疆鍙橀噺

### 1.3 鏋勫缓閰嶇疆
- **鏂囦欢**: `next.config.ts`
- **鍔熻兘**: Next.js 閰嶇疆

**鏍稿績閰嶇疆:**
- 鍒悕璁剧疆 (`@/`)
- 鏋勫缓浼樺寲
- 鐜鍙橀噺閰嶇疆

**浠ｇ爜绀轰緥:**
```tsx
// next.config.ts 鏍稿績缁撴瀯
// File: next.config.ts | Version: v2.3.4
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src')
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: '2.2.15'
  },
  trailingSlash: false,
  output: 'export'
};

export default nextConfig;
```

## 2. PWA 鏀寔

### 2.1 PWA 鐘舵€?- **褰撳墠鐘舵€?*: 宸插仠鐢?- **鍘熷洜**: 澧炲己鍙楅檺鎵ц鐜涓嬬殑绋冲畾鎬?
### 2.2 PWA 鏂囦欢
- **鏂囦欢**: `public/manifest.json`
- **鏂囦欢**: `public/sw.js`

**璇存槑:**
- 鏂囦欢浠嶄繚鐣欏湪浠ｇ爜搴撲腑
- 涓嶅湪 `index.html` 涓紩鐢?- 鍑嗗鍦ㄦ湭鏉ラ噸鏂板惎鐢?
## 3. 鐢熶骇鍙戝竷

### 3.1 閮ㄧ讲璺緞
- **鍩哄噯璺緞**: `./`
- **鏀寔**: 浠绘剰瀛愯矾寰勯儴缃?
### 3.2 鏉冮檺鐢宠
- **鏂囦欢**: `metadata.json`
- **蹇呴』鏉冮檺**: `camera` 鍜?`microphone`

### 3.3 鐗堟湰绠＄悊
- **鏂囦欢**: `public/version.json`
- **鍔熻兘**: 瀛樺偍搴旂敤鐗堟湰淇℃伅

**鍐呭缁撴瀯:**
```json
{
  "version": "2.2.15"
}
```

## 4. 寮€鍙戠幆澧?
### 4.1 寮€鍙戞湇鍔″櫒
- **鍛戒护**: `npm run dev`
- **绔彛**: 3000

### 4.2 渚濊禆绠＄悊
- **鍖呯鐞嗗櫒**: pnpm
- **閿佹枃浠?*: `pnpm-lock.yaml`

### 4.3 浠ｇ爜璐ㄩ噺
- **ESLint**: 浠ｇ爜椋庢牸妫€鏌?- **TypeScript**: 绫诲瀷妫€鏌?- **Tailwind CSS**: 鏍峰紡绠＄悊

## 5. 璺ㄥ钩鍙版敮鎸?
### 5.1 娴忚鍣ㄥ吋瀹规€?- Chrome/Edge (鏈€鏂扮増鏈?
- Firefox (鏈€鏂扮増鏈?
- Safari (鏈€鏂扮増鏈?

### 5.2 绉诲姩璁惧鏀寔
- iOS Safari (鏈€鏂扮増鏈?
- Android Chrome (鏈€鏂扮増鏈?

### 5.3 鎬ц兘浼樺寲
- 鍝嶅簲寮忓姞杞?- 浠ｇ爜鍒嗗壊
- 璧勬簮浼樺寲
- 缂撳瓨绛栫暐

## 6. 鏋勫缓涓庨儴缃叉祦绋?
### 6.1 鏋勫缓鍛戒护
- **寮€鍙戞瀯寤?*: `npm run build`
- **鐢熶骇鏋勫缓**: `npm run build:prod`
- **棰勮鏋勫缓**: `npm run preview`

### 6.2 閮ㄧ讲骞冲彴
- **Vercel** (鎺ㄨ崘)
- **Netlify**
- **GitHub Pages**
- **AWS Amplify**
- **Firebase Hosting**

### 6.3 CI/CD 閰嶇疆
- **GitHub Actions**: 鑷姩鏋勫缓鍜岄儴缃?- **Vercel**: 鑷姩閮ㄧ讲
- **Netlify**: 鑷姩閮ㄧ讲

### 6.4 鐜鍙橀噺閰嶇疆
- **寮€鍙戠幆澧?*: `.env.development`
- **鐢熶骇鐜**: `.env.production`

### 6.5 閮ㄧ讲鏈€浣冲疄璺?- 浣跨敤 HTTPS
- 鍚敤 gzip/brotli 鍘嬬缉
- 閰嶇疆姝ｇ‘鐨勭紦瀛樼瓥鐣?- 浣跨敤 CDN 鍔犻€熼潤鎬佽祫婧?- 鐩戞帶閮ㄧ讲鐘舵€?
## 7. 鏁呴殰鎺掓煡

### 7.1 甯歌閮ㄧ讲闂
- **API 瀵嗛挜闂**: 纭繚 `GEMINI_API_KEY` 姝ｇ‘閰嶇疆锛堟湇鍔″櫒绔幆澧冨彉閲忥級
- **鏋勫缓澶辫触**: 妫€鏌ヤ緷璧栧拰 TypeScript 绫诲瀷
- **杩愯鏃堕敊璇?*: 妫€鏌ユ祻瑙堝櫒鎺у埗鍙伴敊璇俊鎭?- **鎬ц兘闂**: 浼樺寲璧勬簮鍔犺浇鍜屼唬鐮佸垎鍓?
### 7.2 璋冭瘯鎶€宸?- 浣跨敤娴忚鍣ㄥ紑鍙戣€呭伐鍏?- 妫€鏌ョ綉缁滆姹?- 鏌ョ湅鏋勫缓鏃ュ織
- 娴嬭瘯涓嶅悓娴忚鍣ㄥ拰璁惧
