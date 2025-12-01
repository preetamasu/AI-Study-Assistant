# AI Study Assistant

An AI-powered study assistant that helps students organize notes, generate summaries, create quizzes, and track learning progress.

## Features

- 📝 **Note Management**: Create, view, and delete study notes
- 🤖 **AI Summaries**: Generate concise summaries using Claude AI
- ❓ **Q&A System**: Ask questions about your notes and get AI-powered answers
- 📊 **Quiz Generation**: Create custom quizzes from your study materials
- 📈 **Progress Tracking**: View quiz history and track performance over time

## Tech Stack

**Frontend:**
- Vue.js 3 (Composition API)
- Vue Router
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Anthropic Claude API

**Deployment:**
- Frontend: AWS Amplify
- Backend: AWS EC2
- Database: MongoDB Atlas

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Frontend (.env.production)
```
VITE_API_URL=http://your-ec2-ip:3000/api
```

## Local Development

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Notes
- `POST /api/notes` - Create a note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `DELETE /api/notes/:id` - Delete a note

### AI Features
- `POST /api/summarize` - Generate summary
- `POST /api/ask` - Ask a question
- `POST /api/generate-quiz` - Generate quiz

### Quizzes
- `GET /api/quizzes/:noteId` - Get quizzes by note
- `GET /api/quiz/:quizId` - Get quiz by ID
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history

## Author

Built as a portfolio project demonstrating full-stack development skills.

## License

MIT
