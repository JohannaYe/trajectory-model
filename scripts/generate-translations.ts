import path from 'path';
import generateTranslations from '../src/utils/generateTranslations';

const sourceDir = path.join(__dirname, '../src');
const outputDir = path.join(__dirname, '../src/i18n/locales');

generateTranslations(sourceDir, outputDir);
