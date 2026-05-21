# AGENTS.md

# Frontend Agent Instructions

## Stack

- React
- TypeScript
- Vite
- Axios

---

# Architecture

This project follows a hybrid clean architecture approach.

Goals:

- Scalable architecture
- Reusable components
- Maintainable codebase
- Clear separation of concerns
- Predictable API handling
- Consistent UI structure

---

# Folder Structure

```txt
src/
│
├── core/
│   ├── api/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── domain/
│   ├── auth/
│   └── scans/
│
├── application/
│   ├── auth/
│   └── scans/
│
├── infrastructure/
│   ├── http/
│   ├── services/
│   └── storage/
│
├── presentation/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── store/
│   └── styles/
│
├── App.tsx
└── main.tsx
```

---

# Layer Rules

## core/

Contains shared utilities and app-wide configuration.

Examples:

- constants
- hooks
- utility functions
- shared types
- configs

---

## domain/

Contains pure business logic.

Rules:

- No React
- No Axios
- No browser APIs
- No side effects

Contains:

- entities
- interfaces
- repository contracts
- business types

---

## application/

Contains business workflows and use cases.

Examples:

- loginUser
- createScan
- getScanHistory

---

## infrastructure/

Contains external implementations.

Examples:

- Axios
- localStorage
- websocket setup
- API services

---

## presentation/

Contains React UI logic.

Examples:

- pages
- components
- routes
- layouts
- styles
- stores

---

# Component Rules

- Reusable components must be separated properly.
- Shared reusable components must be placed inside:

```txt
presentation/components/common
presentation/components/ui
```

- Feature-specific components should stay near their feature.
- Keep components small and focused.
- Avoid monolithic components.
- Prefer composition over prop drilling.

---

# API Rules

All API calls MUST use:

```ts
withCredentials: true;
```

Example:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

Rules:

- Never call APIs directly inside React components.
- Keep API logic centralized.
- Use service or infrastructure layers.

---

# TypeScript Rules

- Use strict typing.
- Avoid `any`.
- Define proper interfaces/types for:
  - API responses
  - DTOs
  - component props
  - state objects

---

# Styling Rules

- Do NOT modify previously generated styles unless explicitly requested.
- Preserve existing design patterns.
- Maintain UI consistency.
- Avoid unnecessary redesigns.

---

# Existing Code Rules

- Do NOT rewrite previously generated code unnecessarily.
- Do NOT refactor stable code without instruction.
- Preserve API contracts.
- Preserve existing functionality.
- Extend existing patterns instead of replacing them.

---

# Human Readable Code Rules

- Write code that feels human-written and easy to review.
- Keep implementations simple and understandable.
- Avoid overly complex abstractions unless necessary.
- Prefer clarity over cleverness.
- Avoid AI-generated style patterns that feel robotic or overengineered.
- Use meaningful variable and function names.
- Keep logic easy for team members to follow during code review.
- Write code in a way that developers can quickly approve and maintain.
- Avoid unnecessary AI-generated comments.
- Keep functions focused and readable.
- Prefer explicit logic over confusing one-liners.
- Maintain consistency with existing project coding style.

Goals:

- Easy to debug
- Easy to review
- Easy to extend
- Easy to maintain

---

# State Management

- Keep state local when possible.
- Avoid unnecessary global state.
- Prevent unnecessary re-renders.

---

# Error Handling

- Handle API failures gracefully.
- Show meaningful error states.
- Avoid silent failures.

---

# Performance Rules

- Lazy load routes when appropriate.
- Avoid unnecessary API requests.
- Memoize expensive computations when needed.

---

# Code Quality

- Prefer readable code over clever code.
- Use meaningful naming.
- Avoid duplicated logic.
- Extract reusable hooks/utilities when necessary.

---

# Important Rules

- Follow existing project structure first.
- Maintain architectural consistency.
- Do not introduce new libraries unless necessary.
- Preserve backward compatibility.
