# AI Knowledge Assistant - React Frontend

This directory contains the user interface for the AI Knowledge Assistant application, built with **React** and **Vite**. The frontend allows users to register, log in, manage documents, select specific document contexts, chat with the AI assistant, and view activity statistics.

---

## 🚀 Key Features

*   **Secure Authentication**: Register and login pages with persistence using React Context API and standard HTTP headers.
*   **Documents Dashboard**: Drag-and-drop file uploader supporting `.pdf` and `.txt` formats (up to 5MB). Displays a list of documents with metadata and a **"View"** link to inspect files hosted on Supabase Storage.
*   **AI Chat Assistant**: Persistent, multi-turn chat interface with typing indicators, message history, and the ability to link queries to a specific document context.
*   **Contextual Queries**: Dropdown context selector allowing users to chat generally or select a specific uploaded file to ground the AI's responses.
*   **Usage Summary**: Landing page displaying account metrics (number of documents, active conversations, and total messages).

---

## 🛠️ Technology Stack

*   **Framework**: React (v18)
*   **Build Tool**: Vite
*   **Routing**: React Router DOM (v6)
*   **HTTP Client**: Axios
*   **Styling**: Vanilla CSS with custom design tokens (dark theme, modern glassmorphism elements, custom loaders).
*   **State Management**: React Context API (`AuthContext`)

---

## 📁 Directory Structure

```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and styles
│   ├── components/         # Reusable layouts (ProtectedRoute, DashboardLayout)
│   ├── context/            # Global state (AuthContext.jsx)
│   ├── pages/              # App views:
│   │   ├── LoginPage.jsx   # Authentication views
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx # Usage stats metrics
│   │   ├── DocumentsPage.jsx # File uploading and list view
│   │   └── ChatPage.jsx    # persistent AI chat with context selection
│   ├── services/           # Api communications client (api.js)
│   ├── App.jsx             # Main routing and routes declaration
│   ├── index.css           # Global theme variables & layout rules
│   └── main.jsx            # React root injection point
├── .env                    # Environment credentials file
├── vite.config.js          # Vite config
└── package.json            # Node scripts and dependencies
```

---

## ⚙️ Environment Configuration

Create a `.env` file at the root of the `frontend/` directory with the following variables:

```env
# Backend Base API URL
VITE_API_BASE_URL=http://localhost:8080/api

# Supabase Credentials
VITE_SUPABASE_URL=https://cpdfuspjmwtyxjzhajkt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ceqnAPWhy5yYfKugbw1P0g_Igs-9_7c
VITE_SUPABASE_JWKS_URL=https://cpdfuspjmwtyxjzhajkt.supabase.co/auth/v1/.well-known/jwks.json
```

---

## 🏃 Local Setup & Startup

1.  **Navigate to the frontend folder**:
    ```powershell
    cd d:\Thyaga\frontend
    ```
2.  **Install dependencies**:
    ```powershell
    npm install
    ```
3.  **Start the Vite development server**:
    ```powershell
    npm run dev
    ```
4.  Open the local address printed by Vite in your browser (typically `http://localhost:5173`).
