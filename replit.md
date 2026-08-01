# Overview

This is a modern full-stack banking dashboard application for "Italian National Offshore Banking". The application provides a secure online banking interface where users can view account balances, manage beneficiaries, view credit cards, and access various banking services. The system is built as a single-page application with a React frontend and Express.js backend, featuring a clean, professional design with comprehensive banking functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses and proper error handling
- **Development Tools**: tsx for TypeScript execution in development

## Database Design
- **Database**: PostgreSQL using Neon serverless infrastructure
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Core Entities**:
  - Users (authentication and profile data)
  - Accounts (multiple account types: savings, checking, investment)
  - Beneficiaries (internal, external, and wire transfer recipients)
  - Transactions (debit/credit with categorization)
  - Credit Cards (card management and details)

## Development Setup
- **Monorepo Structure**: Shared types and schemas between frontend and backend
- **Hot Reload**: Vite dev server with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Code Quality**: TypeScript strict mode with path aliases for clean imports

## UI/UX Design Patterns
- **Design System**: New York variant of shadcn/ui with neutral color scheme
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Architecture**: Modular, reusable components with consistent props interfaces
- **Banking Theme**: Professional blue color scheme with card-based layouts and smooth animations

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Connection Management**: @neondatabase/serverless for WebSocket-based connections

## UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives including dialogs, forms, navigation
- **Lucide React**: Modern icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component for account displays

## Development Tools
- **Vite Plugins**: React plugin, runtime error overlay, and Replit-specific cartographer plugin
- **Form Libraries**: React Hook Form with Hookform Resolvers for Zod integration
- **Date Handling**: date-fns for date formatting and manipulation
- **Utility Libraries**: clsx and tailwind-merge for conditional CSS classes, class-variance-authority for component variants

## Build and Deployment
- **Frontend Build**: Vite with React plugin and TypeScript support
- **Backend Build**: esbuild for Node.js bundle creation
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer
- **Asset Management**: Vite's built-in asset handling with custom alias resolution