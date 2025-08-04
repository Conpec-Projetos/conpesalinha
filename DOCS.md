# Salinha - Room Reservation System

A modern room reservation system for managing a small meeting/study room at our junior company. Built with clean code principles and SOLID design patterns.

## 🎯 Project Overview

**Salinha** is a web application designed to help team members reserve and manage a shared room for meetings and study sessions. The system provides real-time visibility into room availability and reservations, enabling better coordination and scheduling among team members.

### Key Features

- 📅 **Real-time Room Availability**: View current and upcoming reservations
- 🔒 **No Authentication Required**: Quick and easy access for all team members
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Instant Updates**: Real-time synchronization across all devices
- 🎨 **Modern UI**: Clean, intuitive design using Shadcn components
- 📊 **Schedule Overview**: Visual timeline of daily reservations

## 🚀 Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework for production |
| **TypeScript** | Type safety and developer experience |
| **Firebase** | Backend-as-a-Service (Firestore + Hosting) |
| **Shadcn/ui** | Modern, accessible UI components |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Beautiful, customizable icons |

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #F66C0E;     /* Main orange */
--primary-dark: #D95B08; /* Dark orange */

/* Secondary Colors */
--secondary: #FFFFFF;    /* White */
--accent: #000000;      /* Black */

/* Additional Colors */
--background: #FAFAFA;   /* Light gray background */
--muted: #F5F5F5;       /* Muted background */
--border: #E5E5E5;      /* Border color */
```

### Design Principles

- **Modern & Clean**: Minimalist interface focusing on functionality
- **Accessibility First**: WCAG 2.1 AA compliant design
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Consistent Spacing**: 8px grid system for consistent layouts
- **Typography**: Clear hierarchy using system fonts

## 📋 Features & User Stories

### Core Functionality

1. **View Reservations**
   - See all current and upcoming reservations
   - Visual timeline showing room availability
   - Real-time updates when new reservations are made

2. **Make Reservations**
   - Quick reservation form with essential details
   - Date and time picker with availability validation
   - Purpose/description field for reservation context

3. **Manage Reservations**
   - Edit existing reservations (if needed)
   - Cancel reservations
   - Extend or modify reservation times

### User Interface

- **Dashboard**: Overview of today's schedule and quick actions
- **Calendar View**: Weekly/monthly view of all reservations
- **Reservation Form**: Simple, intuitive booking interface
- **Mobile Menu**: Collapsible navigation for mobile devices

## 🏗️ Architecture & Clean Code Principles

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each component has a single, well-defined purpose
   - Separation of concerns between UI, business logic, and data access

2. **Open/Closed Principle (OCP)**
   - Components are open for extension but closed for modification
   - Use of composition and higher-order components

3. **Liskov Substitution Principle (LSP)**
   - Proper TypeScript interfaces and type definitions
   - Consistent component APIs

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces and props
   - No forced dependencies on unused functionality

5. **Dependency Inversion Principle (DIP)**
   - Dependency injection for Firebase services
   - Abstract interfaces for data access layers

### Project Structure

```text
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   ├── calendar/         # Calendar-related components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── firebase.ts       # Firebase configuration
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validation schemas
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Additional styling files
```

## 🔥 Firebase Integration

### Firestore Database Structure

```javascript
// Collections
reservations: {
  id: string,
  title: string,
  description?: string,
  startTime: Timestamp,
  endTime: Timestamp,
  reservedBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{document} {
      allow read, write: if true; // No authentication required
    }
  }
}
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Firebase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd salinha
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project
   - Enable Firestore Database
   - Copy configuration to `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm start
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: '640px',   /* Small devices */
md: '768px',   /* Medium devices */
lg: '1024px',  /* Large devices */
xl: '1280px',  /* Extra large devices */
2xl: '1536px'  /* 2X large devices */
```

### Component Responsiveness

- **Navigation**: Hamburger menu on mobile, full navigation on desktop
- **Calendar**: Stacked view on mobile, grid view on larger screens
- **Forms**: Single column on mobile, optimized layouts on desktop
- **Cards**: Responsive grid layouts with appropriate spacing

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Firebase emulator testing
- **E2E Tests**: Playwright for critical user flows
- **Accessibility Tests**: axe-core integration

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize**

   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build and deploy**

   ```bash
   npm run build
   firebase deploy
   ```

## 📈 Future Enhancements

- **Email Notifications**: Reservation confirmations and reminders
- **Recurring Reservations**: Support for weekly/monthly bookings
- **Resource Management**: Additional room equipment tracking
- **Analytics Dashboard**: Usage statistics and insights
- **Integration**: Calendar sync with Google Calendar/Outlook

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support or questions about the Salinha reservation system, please contact the development team or create an issue in the repository.

---

Built with ❤️ by the Junior Company Development Team