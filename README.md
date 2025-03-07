# LLM-API 🤖

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white)](https://js.langchain.com/)

A powerful API service that combines Google's Gemini and LangChain for advanced language processing and learning capabilities.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

## 🎯 Project Role & Purpose

This LLM-API serves as a crucial bridge between language learning applications and advanced AI models, playing several key roles:

| Role | Description |
|------|------------|
| 🎓 **Language Learning Platform Backend** | Powers interactive language learning applications with real-time AI-driven conversations |
| 🔄 **Multi-Model Orchestrator** | Seamlessly integrates and manages multiple AI models (Gemini & LangChain) for optimal language processing |
| 📊 **Progress Tracking System** | Provides comprehensive analytics and assessment tools for language proficiency evaluation |
| 🗣️ **Speech Processing Hub** | Handles text-to-speech conversion for pronunciation and listening practice |
| 🌐 **Cross-Language Bridge** | Facilitates communication between different languages with advanced translation capabilities |

### Key Benefits

- **For Language Learners**: 
  - Natural conversation practice with AI
  - Immediate feedback on language usage
  - Personalized learning paths
  - Progress tracking and assessment

- **For Developers**:
  - Ready-to-use API endpoints
  - Flexible model integration
  - Scalable architecture
  - Comprehensive documentation

- **For Educational Institutions**:
  - Standardized assessment tools
  - Progress monitoring capabilities
  - Multi-user support
  - Data-driven insights

## 🌟 Features

| Feature | Description |
|---------|------------|
| 🤖 **Multi-Model Support** | Integrates both Google Gemini and LangChain models |
| 💬 **Chat System** | Advanced chat functionality with session management |
| 🎯 **Level Testing** | Language proficiency assessment capabilities |
| 🗣️ **Text-to-Speech** | Built-in TTS functionality for language learning |
| 🌍 **Multi-Language** | Support for multiple languages and translations |
| 📊 **Analytics** | Score tracking and performance analytics |

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/LLM-API.git

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the application
yarn start:dev
```

### Docker Setup

```bash
# Build the Docker image
docker build -t llm-api .

# Run the container
docker run -p 3000:3000 llm-api
```

## 💻 Usage

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `XTTS_API_URL` | Text-to-Speech API URL | Yes |

## 🔌 API Endpoints

### Chat Service

| Endpoint | Method | Description |
|----------|---------|------------|
| `/gemini/create` | POST | Create a new chat session |
| `/gemini/chat` | POST | Send message and get response |
| `/gemini/terminate/:id/:scores?` | DELETE | End chat session |

### Level Test Service

| Endpoint | Method | Description |
|----------|---------|------------|
| `/gemini/level-test/:user_id?:learn_lan` | GET | Start language level test |
| `/gemini/test-result/:qna/:learn_lan` | GET | Get test results |

## 📝 Example Usage

```typescript
// Create a new chat session
const response = await axios.post('http://localhost:3000/gemini/create', {
  conv_lan: 'en',
  ex_lan: 'ko',
  model: 'gemini-pro',
  model_id: 'chat-001'
});

// Send a message
const chatResponse = await axios.post('http://localhost:3000/gemini/chat', {
  answer: 'Hello, how are you?',
  id: response.data.id
});
```

## 🏗️ Project Structure

```
LLM-API/
├── src/
│   ├── gemini/         # Gemini integration
│   ├── langchain/      # LangChain integration
│   ├── types/          # TypeScript types
│   ├── constants/      # Constants and configs
│   └── app/           # Main application code
├── test/              # Test files
└── docker/            # Docker configuration
```

## 🛠️ Development

```bash
# Development
yarn start:dev

# Production build
yarn build
yarn start:prod

# Run tests
yarn test
```

## 📚 API Documentation

Once the application is running, visit:
- Swagger UI: `http://localhost:3000/api`
- API Documentation: `http://localhost:3000/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini Team
- LangChain Community
- NestJS Team

---

<div align="center">
Made with ❤️ by Your Team Name
</div>
