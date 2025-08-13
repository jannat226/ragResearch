# 🔬 ResearchBlog - AI-Powered Research Platform

A modern, full-stack blogging platform designed specifically for researchers and academics, featuring AI-powered assistance with real research paper integration, vector search capabilities, and beautiful animated UI.

## ✨ Features

### 🤖 AI-Powered Research Assistant
- **Real Research Paper Integration**: Fetches relevant papers from ArXiv API and curated research databases
- **Intelligent Context Analysis**: Uses vector similarity search to find relevant blog content
- **Out-of-Context Detection**: Smart detection when user queries are not related to available content
- **Research Paper Suggestions**: AI suggests related papers based on user queries
- **Clean Response Generation**: Removes database IDs and internal references from user-facing responses

### 📝 Blog Management
- **Rich Content Creation**: Create and edit blogs with rich formatting support
- **User Authentication**: Secure login/registration with JWT tokens
- **Blog Discovery**: Browse and search through published blogs
- **Responsive Design**: Mobile-friendly interface with modern animations

### 🎨 Modern UI/UX
- **Animated Interface**: Beautiful CSS animations and transitions
- **Gradient Backgrounds**: Dynamic gradient animations with floating particles
- **Responsive Design**: Works seamlessly across all device sizes
- **Interactive Elements**: Hover effects, smooth transitions, and engaging micro-interactions

### 🔍 Advanced Search
- **Vector Search**: Neo4j-powered vector similarity search
- **Semantic Understanding**: Context-aware search capabilities
- **Relevance Filtering**: Smart filtering with configurable relevance thresholds

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **React Router Dom 7.7.1** - Client-side routing
- **Vite 7.0.4** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **React Markdown** - Markdown rendering with GFM support
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **Neo4j** - Graph database for vector search
- **MongoDB** - Document database for blog storage
- **JWT** - Secure authentication
- **Mongoose** - MongoDB object modeling

### AI & Research Integration
- **Google Generative AI** - AI response generation
- **OpenAI API** - Alternative AI provider
- **ArXiv API** - Real research paper fetching
- **Scholarly** - Academic paper search
- **Vector Embeddings** - Semantic search capabilities

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- Neo4j database
- OpenAI API key (optional)
- Google Generative AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jannat226/ragResearch.git
   cd ragResearch
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/researchblog
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your_password
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   ```

5. **Database Setup**
   
   **MongoDB**: Ensure MongoDB is running on your system
   
   **Neo4j**: 
   - Install and start Neo4j
   - Create a new database or use the default
   - Update credentials in `.env`

### 🏃‍♂️ Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173` (or next available port)

3. **Access the application**
   Open your browser and navigate to the client URL

## 📁 Project Structure

```
ResearchBlogingRAG/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── WorkingApp.jsx     # Main application component
│   │   └── main.jsx           # Application entry point
│   ├── public/                # Static assets
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── controllers/           # Route controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── blogController.js  # Blog CRUD operations
│   │   ├── ragController.js   # AI and search logic
│   │   └── forgotPasswordController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── upload.js         # File upload handling
│   ├── models/               # Database models
│   │   ├── User.js           # User schema
│   │   └── Blog.js           # Blog schema
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── blog.js           # Blog routes
│   ├── utils/                # Utility functions
│   │   ├── llm.js            # AI integration
│   │   ├── scholarSearch.js  # Research paper search
│   │   └── vectorSearch.js   # Neo4j vector operations
│   ├── uploads/              # File upload directory
│   ├── app.js                # Express application setup
│   └── package.json
│
└── README.md                  # Project documentation
```

## 🔧 Configuration

### AI Configuration
The platform supports multiple AI providers:
- **Google Generative AI** (Primary)
- **OpenAI GPT** (Fallback)

### Search Configuration
- **Relevance Threshold**: Set in `ragController.js` (default: 1.5)
- **Vector Dimensions**: Configurable in Neo4j setup
- **Search Limits**: Adjustable in controller methods

### Research Paper Sources
- **ArXiv API**: Real-time academic paper fetching
- **Curated Database**: Pre-selected high-quality papers (2023-2024)
- **Fallback System**: Graceful handling when no papers found

## 🎯 Key Features Explained

### AI-Powered Research Assistant
The platform's AI assistant provides:
- Context-aware responses based on your blog content
- Real research paper recommendations from ArXiv
- Intelligent detection of out-of-scope queries
- Clean, database-ID-free responses

### Vector Search Technology
- Uses Neo4j for high-performance vector similarity search
- Semantic understanding of content relationships
- Configurable relevance thresholds for precise results

### Animated User Interface
- Modern CSS animations with staggered loading effects
- Interactive hover states and smooth transitions
- Responsive design with mobile-first approach
- Floating particle backgrounds and gradient animations

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Production Build
```bash
# Build client for production
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables for Production
Update your `.env` file with production values:
- Use production database URLs
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **ArXiv** for providing open access to research papers
- **Neo4j** for powerful graph database capabilities
- **React** and **Node.js** communities for excellent documentation
- **Google** and **OpenAI** for AI APIs

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the configuration guide for setup issues

---

**Built with ❤️ for the research community**
