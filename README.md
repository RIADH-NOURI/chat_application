# Modern Chat Application

A feature-rich real-time chat application built with React Native, Express, and MongoDB, featuring modern architecture and best practices.

## 🌟 Features

- Real-time messaging with Socket.IO
- File and image sharing
- Message reactions
- Online/Offline status
- Message caching with Redis
- Modern UI with NativeWind and React Native Paper
- State management with Zustand
- Data fetching with React Query
-React Compiler intelligence for automatic performance optimization (replaces manual useMemo/useCallback in many cases)## 🏗️ Architecture

### Frontend (Client)
- React Native with Expo
- NativeWind for styling
- React Native Paper for UI components
- Zustand for state management
- React Query for data fetching
- Socket.IO client for real-time communication

### Backend
- Express.js server
- MongoDB for data persistence
- Redis for message caching
- Socket.IO for real-time features
-Jwt with Cookies for authentication
- Design Patterns:
  - Singleton Pattern
  - Template Pattern

## 🚀 Getting Started

### Prerequisites
- Node.js 
- Docker and Docker Compose
- Expo CLI
- MongoDB
- Redis

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/RIADH-NOURI/chat_application.git>
cd chat_app_03
```

2. Install client dependencies:
```bash
cd client
npx expo install
```

3. Start the backend services using Docker:
```bash
cd backend
```run
docker-compose up --build
```

4. Start the Expo development server:
```bash
cd client
npx expo start
```

## 📱 Mobile App Setup

1. Install Expo Go on your mobile device
2. Scan the QR code from the Expo development server
3. The app will load on your device

## 🔧 Environment Variables

### Client (.env)
```
EXPO_PUBLIC_API_URL=your_backend_url
EXPO_PUBLIC_SOCKET_URL=your_socket_url
```

### Backend (.env)
```
JWT_SECRET=your jwt secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY= your_api_key
CLOUDINARY_API_SECRET= your_api_secret
CLIENT_ID=your_client_id google auth
```

## 🏗️ Project Structure

```
chat_app_03/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── utils/ 
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   ├── app.route.js
    │   └── server.ts
    ├── package.json
    └── tsconfig.json
```

## 🛠️ Technologies Used

- **Frontend:**
  - React Native
  - Expo
  - NativeWind
  - React Native Paper
  - Zustand
  - React Query
  - Socket.IO Client

- **Backend:**
  - Express.js
  - MongoDB
  - Redis
  - Socket.IO
  - Docker

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Your Name](https://github.com/RIADH-NOURI)

## 🙏 Acknowledgments

- React Native community
- Expo team
- MongoDB team
- Redis team
- All contributors and supporters

---

