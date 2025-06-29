# Dytto - Relationship Management Platform

A modern, AI-powered relationship management platform built with React (Vite) frontend and Flask backend, powered by Supabase.

## Features

### 🚀 Core Features
- **Relationship Management** - Track and organize your personal and professional relationships
- **AI-Powered Insights** - Get intelligent analysis of your interactions and relationship patterns
- **Leveling System** - Gamified relationship progression with XP and levels
- **Quest System** - Personalized challenges to deepen your connections
- **Analytics Dashboard** - Comprehensive insights into your relationship patterns

### 🎯 Advanced Features
- **Real-time Sync** - All data synced across devices via Supabase
- **Smart Suggestions** - AI-generated conversation starters and relationship advice
- **Milestone Tracking** - Celebrate important moments in your relationships
- **Category Evolution** - Relationships naturally evolve based on interaction patterns
- **Tree Visualization** - Beautiful tree-based visualization of your relationship network

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Zustand** - State management

### Backend
- **Flask** - Python web framework
- **Supabase** - Backend-as-a-Service (PostgreSQL)
- **Anthropic Claude** - AI processing for sentiment analysis
- **Python Services** - Modular service architecture

### AI & Analytics
- **Anthropic Claude** - Advanced AI processing
- **Sentiment Analysis** - Interaction analysis
- **Pattern Recognition** - Relationship insights
- **Predictive Analytics** - Relationship forecasting

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dytto
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env
   ```
   
   Fill in your credentials in the `.env` file:
   ```env
   # Frontend environment variables
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=http://127.0.0.1:5000

   # Backend environment variables
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the migration file in `supabase/migrations/` in your Supabase SQL editor
   - This will create all necessary tables and security policies

5. **Start the Backend Server**
   ```bash
   python run_backend.py
   ```
   
   This script will:
   - Install Python dependencies automatically
   - Check your environment configuration
   - Start the Flask server on http://127.0.0.1:5000

6. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dytto/
├── src/                          # React frontend
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   ├── modals/             # Modal components
│   │   └── ui/                 # UI primitives
│   ├── lib/                    # Utilities and configurations
│   │   ├── api/                # API client for backend
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # Utility functions
│   ├── pages/                  # Page components
│   └── globals.css             # Global styles
├── services/                   # Python backend services
│   ├── ai_processing.py        # AI analysis and processing
│   ├── quest_generation.py     # Quest generation logic
│   ├── leveling_system.py      # XP and leveling calculations
│   ├── tree_system.py          # Relationship tree visualization
│   ├── ai_insights.py          # Advanced AI insights
│   └── global_tree_service.py  # Global tree data processing
├── supabase/                   # Supabase configuration
│   ├── functions/              # Edge functions (optional)
│   └── migrations/             # Database migrations
├── app.py                      # Flask backend server
├── run_backend.py              # Backend setup and run script
├── requirements.txt            # Python dependencies
└── package.json                # Node.js dependencies
```

## Key Features Explained

### Relationship Leveling System
- **Levels 1-10**: Relationships progress through levels based on interaction quality
- **XP System**: Earn experience points for meaningful interactions
- **Automatic Progression**: Levels increase automatically as you build stronger connections

### AI Analysis
- **Sentiment Analysis**: Understand the emotional tone of your interactions
- **Pattern Recognition**: Identify recurring themes and communication patterns
- **Smart Suggestions**: Get personalized advice for deepening relationships
- **Evolution Suggestions**: AI suggests when relationships might evolve to new categories

### Quest System
- **Daily Quests**: Simple tasks to maintain connections
- **Weekly Challenges**: Deeper relationship-building activities
- **Milestone Quests**: Special challenges for relationship level-ups
- **Custom Quests**: AI-generated quests based on your relationship patterns

### Analytics Dashboard
- **Interaction Trends**: Track communication frequency and patterns
- **Emotional Summary**: Understand the emotional dynamics of your relationships
- **Relationship Forecasts**: AI predictions about relationship trajectories
- **Growth Metrics**: Monitor your relationship-building progress

## API Endpoints

The Flask backend provides a comprehensive REST API:

### Relationships
- `GET /relationships` - Get all relationships
- `POST /relationships` - Create new relationship
- `GET /relationships/{id}` - Get specific relationship
- `PUT /relationships/{id}` - Update relationship
- `DELETE /relationships/{id}` - Delete relationship

### Interactions
- `POST /interactions` - Log new interaction (with AI analysis)
- `GET /interactions` - Get all interactions
- `GET /relationships/{id}/interactions` - Get relationship interactions

### Quests
- `GET /relationships/{id}/quests` - Get relationship quests
- `POST /relationships/{id}/generate_quest` - Generate new quest
- `PUT /quests/{id}` - Update quest status

### Analytics
- `GET /dashboard_data` - Get dashboard overview
- `GET /relationships/{id}/insights` - Get AI insights
- `GET /global_tree_data` - Get global relationship tree

## Development

### Running in Development Mode

1. **Backend** (Terminal 1):
   ```bash
   python run_backend.py
   ```

2. **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

### Building for Production

1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Deploy Backend**:
   - Deploy Flask app to your preferred platform (Railway, Heroku, etc.)
   - Update `VITE_API_BASE_URL` to your production backend URL

## Security

- **Row Level Security**: All data is protected by Supabase RLS policies
- **Authentication**: Secure user authentication with Supabase Auth
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy First**: Your relationship data is private and secure

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Add environment variables
3. Deploy

### Backend (Railway/Heroku)
1. Deploy Flask app to your preferred platform
2. Set environment variables
3. Update frontend `VITE_API_BASE_URL`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/dytto/issues)
- **Documentation**: Check the code comments and API documentation

---

Built with ❤️ using React, Flask, and Supabase