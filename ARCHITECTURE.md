# AI-Powered Meeting Summarizer & Action Item Extractor - Architecture

## Overview
A web application that processes meeting audio to generate AI-powered summaries and extract actionable tasks.

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Services**: 
  - OpenAI Whisper API (Speech-to-Text)
  - OpenAI GPT-4 (Summarization & Action Item Extraction)
- **Storage**: Supabase Storage for audio files
- **Deployment**: Vercel

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Web Client    │────▶│  Next.js Server  │────▶│    Supabase     │
│  (React/Next)   │     │   (API Routes)   │     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                           │
                               ▼                           ▼
                        ┌──────────────┐          ┌─────────────────┐
                        │  OpenAI API  │          │ Supabase Storage│
                        │(Whisper/GPT) │          │  (Audio Files)  │
                        └──────────────┘          └─────────────────┘
```

## Data Flow
1. User uploads audio file or provides recording link
2. Audio stored in Supabase Storage
3. Whisper API transcribes audio to text
4. GPT-4 processes transcript to:
   - Generate concise summary
   - Extract action items with assignees
5. Results saved to database
6. UI displays summary and action items

## Database Schema

### Users Table
- id (UUID, primary key)
- email (string, unique)
- name (string)
- subscription_tier (enum: free, pro, enterprise)
- created_at (timestamp)

### Meetings Table
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (string)
- audio_url (string)
- transcript (text)
- summary (text)
- duration (integer, seconds)
- created_at (timestamp)

### Action Items Table
- id (UUID, primary key)
- meeting_id (UUID, foreign key)
- description (text)
- assignee (string)
- priority (enum: low, medium, high)
- status (enum: pending, completed)
- due_date (date, nullable)
- created_at (timestamp)

### Usage Tracking Table
- id (UUID, primary key)
- user_id (UUID, foreign key)
- month_year (string, format: YYYY-MM)
- summaries_count (integer)
- audio_minutes (integer)

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

### Meetings
- POST /api/meetings/upload - Upload audio file
- POST /api/meetings/process - Process audio to summary
- GET /api/meetings - List user's meetings
- GET /api/meetings/[id] - Get meeting details

### Action Items
- GET /api/action-items - List all action items
- PATCH /api/action-items/[id] - Update action item status

### Usage
- GET /api/usage - Get current month usage stats

## Security Considerations
- All API routes require authentication
- Audio files stored with secure URLs
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration

## Freemium Model
- **Free Tier**: 5 meetings/month, max 30 min audio
- **Pro Tier**: 50 meetings/month, max 2 hour audio
- **Enterprise**: Unlimited, custom features

## Performance Optimizations
- Audio chunking for large files
- Background job processing for transcription
- Caching of processed results
- CDN for static assets
- Database indexing on frequently queried fields