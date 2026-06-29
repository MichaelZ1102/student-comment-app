# 学生年终评语生成助手

帮助老师快速生成正式、自然的学生年终评语，支持单个生成与批量处理。

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenAI API
- docx / xlsx

## 本地开发

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local，填入 OPENAI_API_KEY
npm run dev
```

## 构建

```bash
npm run build
npm run start
```

## 功能

- 单个学生评语生成
- 批量导入 Excel/CSV
- 批量生成评语
- 逐条微调
- 导出 Word
