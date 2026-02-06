# 食物热量识别 Web App（React + Vite + Vercel）

一个可直接部署到 Vercel 的纯 Web 应用：上传/拍照识别食物，返回热量与营养信息，按热量从低到高排序，并自动识别图片语言展示结果。支持暗色模式与 PWA 安装。

## 项目结构
```
food-calorie-web/
├── api/
│   └── analyze.js          # Vercel Serverless Function
├── public/
│   ├── manifest.json
│   └── icon.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── UploadButton.jsx
│       ├── FoodCard.jsx
│       └── Loading.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## 本地运行
```
npm install
npm run dev
```

## 部署到 Vercel
1. Fork/Clone 项目
2. 访问 vercel.com 导入项目
3. 添加环境变量：`GEMINI_API_KEY`
   - 获取地址：https://aistudio.google.com/apikey
4. 点击 Deploy
5. 获得在线网址，手机电脑都能访问

## 说明
- 前端通过 `/api/analyze` 调用 Vercel Serverless Function。
- 支持相机拍照（MediaDevices）与相册上传（FileReader）。
- 默认使用系统深色/浅色偏好，可手动切换并保存。
