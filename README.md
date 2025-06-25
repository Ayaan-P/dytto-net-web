# Dytto - Relationship Management Platform

A modern, AI-powered relationship management platform built with Next.js and Supabase.

## Features

### 🚀 Core Features
- **Relationship Management** - Track and organize your personal and professional relationships
- **AI-Powered Insights** - Get intelligent analysis of your interactions and relationship patterns
- **Leveling System** - Gamified relationship progression with XP and levels
- **Quest System** - Personalized challenges to deepen your connections
- **Analytics Dashboard** - Comprehensive insights into your relationship patterns

### 🎯 Advanced Features
- **Real-time Sync** - All data synced across devices
- **Smart Suggestions** - AI-generated conversation starters and relationship advice
- **Milestone Tracking** - Celebrate important moments in your relationships
- **Category Evolution** - Relationships naturally evolve based on interaction patterns
- **Backup & Restore** - Export and import your relationship data

## Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Zustand** - State management

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data security
- **Edge Functions** - Serverless functions
- **Real-time subscriptions** - Live data updates

### AI & Analytics
- **Edge Functions** - AI processing
- **Sentiment Analysis** - Interaction analysis
- **Pattern Recognition** - Relationship insights
- **Predictive Analytics** - Relationship forecasting

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dytto.git
   cd dytto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Run the migration files in the `supabase/migrations` folder

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Running Migrations

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase locally**
   ```bash
   supabase init
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Run migrations**
   ```bash
   supabase db push
   ```

### Edge Functions

Deploy the included edge functions:

```bash
supabase functions deploy analyze-interaction
supabase functions deploy generate-insights
supabase functions deploy generate-quest
```

## Project Structure

```
dytto/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── analytics/         # Analytics dashboard
│   ├── relationships/     # Relationship management
│   ├── quests/           # Quest system
│   ├── settings/         # User settings
│   └── tree/             # Tree visualization
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal components
│   └── ui/               # UI primitives
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── supabase/         # Supabase client and types
│   └── utils/            # Utility functions
├── supabase/             # Supabase configuration
│   ├── functions/        # Edge functions
│   └── migrations/       # Database migrations
└── public/               # Static assets
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- **Row Level Security**: All data is protected by Supabase RLS policies
- **Authentication**: Secure user authentication with Supabase Auth
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy First**: Your relationship data is private and secure

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables**
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.dytto.com](https://docs.dytto.com)
- **Community**: [Discord](https://discord.gg/dytto)
- **Issues**: [GitHub Issues](https://github.com/your-username/dytto/issues)
- **Email**: support@dytto.com

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Team/organization features
- [ ] Integration with calendar apps
- [ ] Social media integration
- [ ] Advanced analytics and reporting

---

Built with ❤️ by the Dytto team