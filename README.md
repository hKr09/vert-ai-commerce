# AI Content Generator - Shopify App

A Shopify embedded app that generates AI-powered content using OpenAI GPT-4.

## Features

- 🤖 AI content generation with GPT-4
- 🛍️ Fully embedded in Shopify admin
- 🎨 Modern UI with Shopify Polaris
- ⚡ Real-time loading states and error handling
- 📋 Copy to clipboard functionality

## Setup

1. **Environment Variables** (create `.env` file):
```env
SHOPIFY_API_KEY=your_shopify_api_key
OPENAI_API_KEY=your_openai_api_key
```

2. **Install & Run**:
```bash
npm install
npm run dev
```

## Usage

1. Enter product description in the text field
2. Click "Generate AI Content"
3. Copy the generated content to your clipboard

## API

- **POST** `/api/generate` - Generates AI content
- **Body**: `{ "prompt": "your description" }`
- **Response**: `{ "success": true, "generatedText": "..." }`

## Dependencies

All required dependencies are already included in `package.json`:
- Remix 2
- Shopify Polaris
- Shopify App Bridge
- OpenAI API integration
