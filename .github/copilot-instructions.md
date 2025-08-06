# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern Next.js 14+ news platform converted from a React + Vite application. The project uses TypeScript, TailwindCSS, and App Router for optimal performance and developer experience.

## Architecture Guidelines
- Use App Router for all routing (not Pages Router)
- Implement Server Components by default, use Client Components only when necessary
- Use TypeScript for all components and utilities
- Follow TailwindCSS utility-first approach for styling
- Implement proper SEO with metadata API
- Use Next.js Image component for optimized images

## Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Use React Server Components for data fetching when possible
- Implement proper loading states and error handling
- Follow Next.js conventions for file and folder structure

## Firebase Integration
- Use Firebase for authentication and data storage
- Implement proper security rules
- Use Firebase Admin SDK for server-side operations
- Implement real-time features with Firestore

## News Platform Features
- Support for multi-language content (i18n)
- Admin dashboard for content management
- Real-time news updates
- SEO optimization for news articles
- Responsive design for all devices
- AI-powered content optimization

## Performance
- Implement proper caching strategies
- Use Next.js built-in optimizations
- Implement lazy loading for heavy components
- Optimize images and assets
- Use static generation where appropriate
