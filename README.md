#  Professional Task Manager - Frontend

A modern, responsive task management application built with React and Vite. Features user authentication, task CRUD operations, collaboration, and a professional dashboard.

##  Live Demo

**Frontend**: [Deployed on Vercel](https://your-app.vercel.app)  
**Backend**: [API on Render](https://to-do-list-backend-04i3.onrender.com)

##  Features

-  **User Authentication** - Sign up, sign in with JWT tokens
-  **Task Management** - Create, read, update, delete tasks
-  **Tag System** - Organize tasks with tags
-  **Collaboration** - Share tasks with other users
-  **Dashboard** - Visual stats and task overview
-  **Responsive Design** - Works on desktop and mobile
-  **Modern UI** - Clean, professional interface with Tailwind CSS

##  Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Forms**: Formik + Yup validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: Zustand
- **HTTP Client**: Fetch API

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/royvincent580/to-do-list-frontend.git
   cd to-do-list-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend URL:
   ```env
   VITE_API_URL=https://to-do-list-backend-04i3.onrender.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

##  Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BackendHealthCheck.jsx
│   ├── CollaborationModal.jsx
│   ├── FormikTaskForm.jsx
│   ├── ProfessionalDashboard.jsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── TasksPage.jsx
│   └── ...
├── stores/             # Zustand state management
│   └── auth-store.js
├── config/             # Configuration files
│   └── api.js
└── App.jsx            # Main app component
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Deploy to Vercel (if configured)
```

##  Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Set Environment Variables**
   - Add `VITE_API_URL` = `https://to-do-list-backend-04i3.onrender.com`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy dist folder**
   - Drag `dist/` folder to Netlify
   - Or connect your GitHub repo

##  Authentication

The app uses JWT tokens for authentication:

1. **Sign Up** - Create a new account
2. **Sign In** - Get JWT token stored in Zustand
3. **Protected Routes** - Automatic token validation
4. **Auto Logout** - Token expiration handling

##  Task Management

### Task Features
-  Create tasks with title, content, tags, and status
-  Update task details and status
-  Delete tasks
-  Filter by status (Pending, In Progress, Completed)
-  Tag-based organization

### Collaboration
-  Share tasks with other users by email
-  Add multiple collaborators at once
-  View collaborative tasks separately

##  UI Components

### Key Components
- **ProfessionalDashboard** - Main dashboard with stats
- **FormikTaskForm** - Task creation/editing form
- **TaskCard** - Individual task display
- **CollaborationModal** - Share tasks with others
- **BackendHealthCheck** - Handle backend cold starts

### Styling
- **Tailwind CSS** for utility-first styling
- **Responsive design** for all screen sizes
- **Professional color scheme** with gradients
- **Smooth animations** and transitions

##  Configuration

### Environment Variables
```env
VITE_API_URL=https://your-backend-url.com
```

### API Integration
The frontend connects to a Flask REST API:
- **Base URL**: Configured via `VITE_API_URL`
- **Authentication**: Bearer token in headers
- **Error Handling**: Graceful error messages

##  Troubleshooting

### Common Issues

**Backend Not Available**
- The backend (Render free tier) may take 30-60 seconds to wake up
- The app shows a loading screen during cold starts

**Environment Variables**
- Make sure `VITE_API_URL` is set correctly
- Restart dev server after changing `.env`

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

##  License

This project is licensed under the MIT License.

##  Links

- **Frontend Repository**: [GitHub](https://github.com/royvincent580/to-do-list-frontend)
- **Backend Repository**: [GitHub](https://github.com/royvincent580/to-do-list-backend)
- **Live Demo**: [Vercel](https://your-app.vercel.app)

---

Built with ❤️ using React and modern web technologies.
