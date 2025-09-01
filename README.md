# CineReview - Movie Review Application

A modern web application built with React, TypeScript, and Supabase for managing and reviewing movies.

## 🚀 Features

- **User Authentication**: Secure sign-up and sign-in with Supabase Auth using JWT tokens
- **Movie Management**: Add, edit, and delete movies
- **Review System**: Rate and review movies with text comments
- **Watchlist**: Save movies to your personal watchlist
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: JWT tokens with Supabase Auth
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```

   **Important**: Replace the values with your actual Supabase project credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🔐 Authentication Setup

### JWT Token Authentication

This application uses Supabase Auth with JWT tokens for secure authentication:

- **Automatic JWT Management**: Supabase handles JWT token generation, refresh, and storage
- **Secure Storage**: Tokens are stored in localStorage with automatic refresh
- **Row Level Security**: Database policies use JWT claims for authorization
- **Session Persistence**: User sessions persist across browser restarts

### Supabase Configuration

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials**:
   - Go to Settings → API
   - Copy the Project ID and anon/public key
   - Update your `.env` file with these values

3. **Enable Authentication**:
   - Go to Authentication → Settings
   - Enable Email confirmations (recommended)
   - Configure JWT settings and token expiration
   - Set up any additional providers as needed

### Database Setup

The application includes database migrations that will be automatically applied:

- **Profiles table**: User profile information
- **Movies table**: Movie data and metadata
- **Reviews table**: User reviews and ratings
- **Watchlists table**: User movie watchlists

Run migrations if needed:
```bash
npx supabase db push
```




## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── pages/              # Application pages
├── data/               # Data fetching and management
└── lib/                # Utility functions
```

## 🔒 Security Features

- **JWT Token Authentication**: Secure token-based authentication with automatic refresh
- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **Secure Token Storage**: JWT tokens stored securely with automatic expiration handling
- **Input Validation**: Form validation with Zod schemas
- **CORS Protection**: Configured Supabase CORS settings

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables in the deployment platform
3. Build command: `npm run build`
4. Output directory: `dist`

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify your Supabase project configuration
4. Check the [Supabase documentation](https://supabase.com/docs)

## 🔄 Recent Updates

- Fixed authentication configuration to use environment variables
- Added proper TypeScript declarations for environment variables
- Improved error handling and debugging in Supabase client
- Fixed missing image import error in Hero component
- Implemented JWT token-based authentication with Supabase
- Added comprehensive documentation and troubleshooting guide
