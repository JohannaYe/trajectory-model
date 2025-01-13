import fs from 'fs';
import path from 'path';

// 递归遍历目录
function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 从文件内容中提取中文文本
function extractChineseText(content: string): string[] {
  const chineseRegex = /['"]([^'"]*[\u4e00-\u9fa5]+[^'"]*)['"]/g;
  const matches = content.match(chineseRegex);
  return matches ? matches.map(m => m.slice(1, -1)) : [];
}

// 生成翻译键
function generateTranslationKey(text: string): string {
  // 简单的将中文转换为拼音或使用hash
  return text.replace(/[^a-zA-Z0-9]/g, '');
}

// 主函数
function generateTranslations(sourceDir: string, outputPath: string) {
  const translations: Record<string, Record<string, string>> = {
    zh: {},
    en: {}
  };

  // 遍历所有.tsx和.ts文件
  walkDir(sourceDir, (filePath) => {
    if (filePath.match(/\.(tsx?|jsx?)$/)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const chineseTexts = extractChineseText(content);

      chineseTexts.forEach(text => {
        const key = generateTranslationKey(text);
        translations.zh[key] = text;
        translations.en[key] = text; // 这里可以接入翻译API自动翻译
      });
    }
  });

  // 写入翻译文件
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputPath, 'zh.json'),
    JSON.stringify(translations.zh, null, 2)
  );
  fs.writeFileSync(
    path.join(outputPath, 'en.json'),
    JSON.stringify(translations.en, null, 2)
  );
}

export default generateTranslations;
