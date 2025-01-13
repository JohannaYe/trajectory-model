import React from 'react';
import { useTranslation } from 'react-i18next';

// 自动翻译文本内容的高阶组件
const withTranslation = (WrappedComponent: React.ComponentType<any>) => {
  return function TranslatedComponent(props: any) {
    const { t } = useTranslation();

    // 递归处理对象中的所有字符串
    const translateObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // 如果字符串包含中文字符，尝试翻译
        if (/[\u4e00-\u9fa5]/.test(obj)) {
          // 生成翻译key：将中文转换为拼音或使用简单的hash
          const key = obj.replace(/[^a-zA-Z0-9]/g, '');
          // 如果没有找到翻译，返回原文
          return t(key, obj);
        }
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => translateObject(item));
      }
      
      if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          result[key] = translateObject(obj[key]);
        }
        return result;
      }
      
      return obj;
    };

    // 翻译所有props中的字符串
    const translatedProps = translateObject(props);

    return <WrappedComponent {...translatedProps} />;
  };
};

export default withTranslation;
