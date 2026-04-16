/**
 * PWA PNG 图标生成脚本
 * 使用 sharp 库从 SVG 生成不同尺寸的 PNG 图标
 * 
 * 使用方法:
 * npm install sharp
 * node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 图标尺寸配置
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SVG_PATH = path.join(__dirname, '../public/pwa-icon.svg');
const ICONS_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('🎨 Generating PNG icons from SVG...');

  // 确保 icons 目录存在
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // 读取 SVG 文件
  if (!fs.existsSync(SVG_PATH)) {
    console.error('❌ SVG file not found:', SVG_PATH);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  // 生成不同尺寸的 PNG
  for (const size of SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }

  // 生成 apple-touch-icon.png
  const appleIconPath = path.join(__dirname, '../public/apple-touch-icon.png');
  try {
    await sharp(svgBuffer)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(appleIconPath);
    
    console.log('✅ Generated: apple-touch-icon.png (180x180)');
  } catch (error) {
    console.error('❌ Failed to generate apple-touch-icon.png:', error.message);
  }

  // 生成 favicon.png
  const faviconPath = path.join(__dirname, '../public/favicon.png');
  try {
    await sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ Generated: favicon.png (32x32)');
  } catch (error) {
    console.error('❌ Failed to generate favicon.png:', error.message);
  }

  console.log('\n✨ All icons generated successfully!');
  console.log('📝 Remember to update manifest.json to use PNG icons');
}

generateIcons().catch(console.error);
