import fs from 'fs';
import path from 'path';

// 语言列表
const languages = [
  'en', 'zh', 'tw', 'es', 'ar', 'fr', 'pt', 'pt-BR', 'de', 'ja', 'ko', 'ru'
];

// 子文件列表
const subFiles = ['common', 'onboarding', 'panels', 'help', 'settings', 'messages'];

// 基准语言（英语）
const baseLanguage = 'en';

// 检查目录
const localesDir = path.join(__dirname, '../src/locales');

// 读取文件内容
function readFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 简单的 CommonJS 模块解析
    const module = { exports: {} };
    const require = (path: string) => {
      if (path.startsWith('./')) {
        const relativePath = path.replace('./', '');
        const fullPath = path.join(__dirname, '../src/locales', baseLanguage, relativePath + '.ts');
        return readFile(fullPath);
      }
      throw new Error(`Unsupported require: ${path}`);
    };
    eval(content.replace('export const', 'module.exports ='));
    return module.exports;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// 收集所有键
function collectKeys(obj: any, prefix: string = ''): string[] {
  const keys: string[] = [];
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        keys.push(...collectKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

// 检查语言文件完整性
function checkLanguage(lang: string) {
  console.log(`\n=== Checking ${lang} ===`);
  
  // 检查主文件
  const mainFile = path.join(localesDir, `${lang}.ts`);
  if (!fs.existsSync(mainFile)) {
    console.error(`❌ Main file missing: ${mainFile}`);
    return false;
  }
  
  // 检查子文件
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) {
    console.error(`❌ Language directory missing: ${langDir}`);
    return false;
  }
  
  let allSubFilesExist = true;
  for (const subFile of subFiles) {
    const subFilePath = path.join(langDir, `${subFile}.ts`);
    if (!fs.existsSync(subFilePath)) {
      console.error(`❌ Sub file missing: ${subFilePath}`);
      allSubFilesExist = false;
    } else {
      console.log(`✅ Sub file exists: ${subFilePath}`);
    }
  }
  
  return allSubFilesExist;
}

// 检查翻译键完整性
function checkTranslationKeys() {
  console.log('\n=== Checking Translation Keys ===');
  
  // 读取基准语言
  const baseFile = path.join(localesDir, `${baseLanguage}.ts`);
  const baseTranslations = readFile(baseFile);
  if (!baseTranslations) {
    console.error('❌ Failed to read base language file');
    return;
  }
  
  const baseKeys = collectKeys(baseTranslations);
  console.log(`Base language (${baseLanguage}) has ${baseKeys.length} keys`);
  
  // 检查其他语言
  for (const lang of languages) {
    if (lang === baseLanguage) continue;
    
    console.log(`\nChecking ${lang}:`);
    const langFile = path.join(localesDir, `${lang}.ts`);
    const langTranslations = readFile(langFile);
    
    if (!langTranslations) {
      console.error(`❌ Failed to read ${lang} translations`);
      continue;
    }
    
    const langKeys = collectKeys(langTranslations);
    
    // 检查缺失的键
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
    if (missingKeys.length > 0) {
      console.error(`❌ Missing ${missingKeys.length} keys:`);
      missingKeys.forEach(key => console.error(`  - ${key}`));
    } else {
      console.log(`✅ All keys present (${langKeys.length} keys)`);
    }
    
    // 检查多余的键
    const extraKeys = langKeys.filter(key => !baseKeys.includes(key));
    if (extraKeys.length > 0) {
      console.warn(`⚠️  Extra ${extraKeys.length} keys:`);
      extraKeys.forEach(key => console.warn(`  - ${key}`));
    }
  }
}

// 主函数
function main() {
  console.log('🔍 Checking i18n file integrity...');
  
  let allLanguagesValid = true;
  for (const lang of languages) {
    if (!checkLanguage(lang)) {
      allLanguagesValid = false;
    }
  }
  
  if (allLanguagesValid) {
    console.log('\n✅ All language files exist');
    checkTranslationKeys();
  } else {
    console.log('\n❌ Some language files are missing');
  }
}

main();
