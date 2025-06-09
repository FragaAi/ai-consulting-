# AI Consulting Platform

A modern Next.js application for AI consulting services with user management, AI agent deployment, and admin dashboard capabilities.

## Features

### 🏠 Landing Page
- Modern dark-themed design
- Service explanations and value propositions
- Call-to-action for user registration
- Responsive design for all devices

### 👤 User Authentication & Profiles
- Secure authentication via Supabase
- User registration and login
- Profile management with user information
- Role-based access control (User/Admin)

### 🤖 AI Agent Management
- Create and configure AI agents
- Multiple agent types (Chatbot, Data Analyzer, Virtual Assistant, Content Moderator)
- Start, pause, and delete agents
- Real-time status monitoring

### ⚙️ Admin Dashboard
- Admin-only access control
- User management and role assignment
- System-wide AI agent monitoring
- Platform statistics and analytics

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel ready

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if from git)
git clone <repository-url>
cd ai-consulting-platform

# Install dependencies
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Get your project URL and anon key from Settings > API

3. Create environment variables:
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Database Schema Setup

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI agents table
CREATE TABLE ai_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'paused')) DEFAULT 'inactive',
  type TEXT NOT NULL,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create policies for ai_agents table
CREATE POLICY "Users can view own agents" ON ai_agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own agents" ON ai_agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents" ON ai_agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents" ON ai_agents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all agents" ON ai_agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create an admin user (replace with your email)
-- Run this after you've registered with your email
UPDATE users SET is_admin = true WHERE email = 'your-admin-email@example.com';
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   └── Navbar.tsx         # Navigation component
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   └── supabase.ts       # Supabase client
└── types/                 # TypeScript type definitions
    └── database.ts        # Database schema types
```

## Usage

### For Users:
1. Sign up for an account on the landing page
2. Navigate to your profile to manage AI agents
3. Create, configure, and manage your AI agents
4. Monitor agent status and performance

### For Admins:
1. Get admin privileges (update your user record in Supabase)
2. Access the admin dashboard via the navigation
3. Manage user accounts and permissions
4. Monitor all AI agents across the platform
5. View platform statistics and analytics

## Features in Detail

### AI Agent Types:
- **Chatbot**: Interactive conversational agents
- **Data Analyzer**: Data processing and analysis agents
- **Virtual Assistant**: Task automation agents
- **Content Moderator**: Content filtering and moderation agents

### Security Features:
- Row Level Security (RLS) in Supabase
- Role-based access control
- Secure authentication flows
- Protected admin routes

## Development

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment

This application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.
