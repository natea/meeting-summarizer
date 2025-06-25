# AI-Powered Meeting Summarizer & Action Item Extractor

Transform your meeting recordings into actionable summaries and tasks with AI.

![CleanShot 2025-06-25 at 09 28 41](https://github.com/user-attachments/assets/34d6b7ce-4f2e-452d-8154-f4f2eddb3b36)

## Features

- 🎤 **Audio Upload**: Upload meeting recordings or provide cloud recording links
- 🤖 **AI Transcription**: Automatic speech-to-text using OpenAI Whisper
- 📝 **Smart Summarization**: Generate concise meeting summaries with GPT-4
- ✅ **Action Item Extraction**: Automatically identify and track tasks
- 👥 **User Management**: Secure authentication and personal dashboards
- 💎 **Freemium Model**: Free tier with upgrade options

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI (Whisper + GPT-4)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Supabase account

### 1. Clone and Install

```bash
cd meeting-summarizer
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in order:
   - Go to SQL Editor in Supabase dashboard
   - Execute `supabase/migrations/001_initial_schema.sql`
   - Execute `supabase/migrations/002_storage_bucket.sql`

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up**: Create a free account
2. **Upload Meeting**: Upload audio file or provide recording URL
3. **Processing**: AI transcribes and analyzes the meeting
4. **View Results**: See summary and action items
5. **Track Tasks**: Manage action items across all meetings

## Subscription Tiers

- **Free**: 5 meetings/month, max 30 min audio
- **Pro**: 50 meetings/month, max 2 hour audio
- **Enterprise**: Unlimited meetings, custom features

## Project Structure

```
meeting-summarizer/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── supabase/             # Database migrations
```

## API Routes

- `POST /api/auth/logout` - User logout
- `POST /api/meetings/process` - Process uploaded meeting
- `GET /api/meetings` - List user meetings
- `GET /api/action-items` - List action items
- `PATCH /api/action-items/[id]` - Update action item

## Security

- Row Level Security (RLS) on all tables
- User data isolation
- Secure file uploads
- API rate limiting

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Screenshots

![CleanShot 2025-06-25 at 09 30 09](https://github.com/user-attachments/assets/14f2f403-d7c6-4000-8c0b-1c9b5435cfc3)

![CleanShot 2025-06-25 at 09 29 54](https://github.com/user-attachments/assets/22a1b5df-2290-4b6c-953b-378570c45384)

