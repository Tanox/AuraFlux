import fs from 'fs';
import path from 'path';

// 语言列表
const languages = [
  'en', 'zh', 'tw', 'es', 'ar', 'fr', 'pt', 'pt-BR', 'de', 'ja', 'ko', 'ru'
];

// 子文件列表
const subFiles = ['common', 'onboarding', 'panels', 'help', 'settings', 'messages'];

// 检查目录
const localesDir = path.join(process.cwd(), 'src', 'locales');

// 检查语言文件完整性
function checkLanguageFiles() {
  console.log('🔍 Checking i18n file integrity...\n');
  
  let allFilesExist = true;
  
  for (const lang of languages) {
    console.log(`=== Checking ${lang} ===`);
    
    // 检查主文件
    const mainFile = path.join(localesDir, `${lang}.ts`);
    if (!fs.existsSync(mainFile)) {
      console.error(`❌ Main file missing: ${mainFile}`);
      allFilesExist = false;
    } else {
      console.log(`✅ Main file exists: ${mainFile}`);
    }
    
    // 检查子文件目录
    const langDir = path.join(localesDir, lang);
    if (!fs.existsSync(langDir)) {
      console.error(`❌ Language directory missing: ${langDir}`);
      allFilesExist = false;
    } else {
      console.log(`✅ Language directory exists: ${langDir}`);
      
      // 检查子文件
      for (const subFile of subFiles) {
        const subFilePath = path.join(langDir, `${subFile}.ts`);
        if (!fs.existsSync(subFilePath)) {
          console.error(`❌ Sub file missing: ${subFilePath}`);
          allFilesExist = false;
        } else {
          console.log(`✅ Sub file exists: ${subFilePath}`);
        }
      }
    }
    
    console.log('');
  }
  
  return allFilesExist;
}

// 主函数
function main() {
  try {
    const filesExist = checkLanguageFiles();
    
    if (filesExist) {
      console.log('✅ All language files exist');
    } else {
      console.log('❌ Some language files are missing');
    }
  } catch (error) {
    console.error('Error during check:', error);
  }
}

main();
