## Senior Full-Stack (Frontend-Focused) Technical Assessment

## Copyright: Front Row Labs LLC (C) 2024
## SECURE PRIVATE COMPANY PROPERTY. NOT FOR REDISTRIBUTION! 
## Maintainer: Jay A. Leon jayl@lifechef.com

### Overview

You will build a moderately complex Reviews Management System that evaluates your ability to produce well-architected, performant, and maintainable code. The goal is to balance breadth and depth: the scope is broad enough to demonstrate senior-level thinking but constrained enough to be achievable in about 15 hours.

**Use of AI:**  
- You may use AI-assisted coding tools (e.g., GitHub Copilot, ChatGPT) as a productivity aid.  
- **Requirement:** In your submission, include a brief `AI_USAGE.md` file describing how and where you used AI. Mention what tasks it helped with and what you did yourself. This ensures that while you leverage AI, you remain the primary decision-maker and coder.

**Time Limit:** Approximately 15 hours.

---

### Scenario

Create a **Reviews Management System**. It has two pages:

1. **Dashboard Page:** List and manage reviews.
2. **Details Page:** Create and edit a single review.

The system should be production-ready in terms of code quality, architecture, and at least basic testing.

---

### Requirements

**Frontend Stack (Primary Focus):**  
- **Next.js (TypeScript)**  
- **Tailwind CSS** for styling  
- **React Hook Form** for form handling  
- **State Management:** Your choice (Zustand, Context API, or a simple custom hook structure)  
- **Additional Patterns:**  
  - Code splitting for at least one part of the application.  
  - Custom hooks for data fetching and state manipulation.  
  - An error boundary component to handle unexpected UI errors.

**Backend Stack (Secondary Focus):**  
- **Node.js (TypeScript), Express.js**  
- **Prisma with SQLite** for persistence

---

### Data Model

Manage `Review` objects with the following structure:

```typescript
interface Review {
  id: number;
  title: string;  
  content: string;  
  rating: number;  // 1 to 5  
  author: string;  
  createdAt: string; // ISO date  
}
```

Seed the database with at least 20 varied reviews.

---

### Backend Requirements

1. **CRUD Endpoints:**  
   - `POST /reviews` to create
   - `GET /reviews` for a list (with pagination, `take` & `skip`)
   - `GET /reviews/:id` for a single review
   - `PUT /reviews/:id` to update a review
   - `DELETE /reviews/:id` to delete a review

2. **Validation & Error Handling:**  
   - `title` cannot be empty, `rating` must be between 1 and 5.  
   - Return proper HTTP status codes and error messages for invalid input.

3. **Filtering:**  
   - Allow filtering by `author` and `rating` using query parameters (exact matches).

4. **Basic Tests (Optional Bonus):**  
   - Add a couple of Jest-based unit tests for critical backend routes.

---

### Frontend Requirements

**Dashboard Page (`/`):**  
- Fetch and display reviews in a paginated manner.  
- Implement filtering by `author` and `rating`.  
- Add search by `title` with debounced input (e.g., wait a short period after typing before applying the search).  
- Show loading states and a basic skeleton UI while fetching data.  
- Allow deleting reviews. Show a confirmation prompt, and on success, optimistically remove from the UI.  
- Include a button or link to add a new review (navigating to the Details Page in "create" mode).

**Details Page (`/review/[id]` or `/review/new`):**  
- If accessing with an `id`, fetch and prefill the form with existing data.  
- Implement form validation using React Hook Form.  
- `title`, `content`, `author` are required; `rating` must be between 1 and 5.  
- On submission:
  - Show a loading state.
  - Use optimistic updates: immediately reflect the changes in the dashboard without requiring a full refetch.
- Provide a cancel button to go back to the dashboard.

**Advanced Patterns & Performance:**
- Use code splitting (dynamic imports) for at least one significant feature (e.g., the form component or a large dependency).
- Implement a custom hook for data fetching that handles loading, error states, and caching of review data in a state store.
- Introduce basic accessibility checks (e.g., keyboard navigation, proper ARIA attributes on interactive elements).
- Implement a simple error boundary component to handle unexpected front-end errors gracefully.

---

### State Management & Architecture

- Choose a state management approach that can handle filters, pagination, and caching review data.
- Consider using a global store (Zustand or Context) to manage UI state (filters, page number) and fetched data.
- Ensure the code is modular, well-structured, and adheres to best practices. Show that you’ve thought about scalability and maintainability.

---

### Testing & Documentation

- Write at least one frontend test (using React Testing Library) to ensure a critical component or flow works as intended.
- Add a `README.md` detailing:
  - Project setup and run instructions
  - Architectural decisions and trade-offs
  - Details on state management and performance optimizations
- Add an `AI_USAGE.md` explaining how AI tools were leveraged.

---

### Optional Bonuses

- Add animations for UI transitions.
- Implement a virtualized list for reviews if time permits (for performance with large data sets).
- Additional frontend tests for increased coverage.
- Integrate a simple logging solution in the backend.

---

### Evaluation Criteria

1. **Frontend Architecture & Code Quality:**  
   - Clear separation of concerns, reusable components, custom hooks.  
   - Code that’s easy to read, maintain, and scale.

2. **User Experience & Performance:**  
   - Responsive and accessible UI.  
   - Fast loading and snappy interactions.  
   - Thoughtful use of loading states, error boundaries, and optimism in updates.

3. **Correctness & Reliability:**  
   - Properly implemented CRUD operations, filtering, and pagination.  
   - Effective form validation and error handling.

4. **State Management & Advanced Patterns:**  
   - Skillful use of a global store or context.  
   - Demonstration of caching, debouncing, code splitting, or other patterns that signal senior-level thinking.

5. **Testing & Documentation:**  
   - At least one meaningful frontend test.
   - Clear documentation explaining your approach and reasoning.
   - Transparency in AI usage.

---

### Submission

- Provide a GitHub repository link or a compressed file with:
  - Frontend (Next.js) code
  - Backend (Express + Prisma) code
  - `README.md` and `AI_USAGE.md` files
- Be prepared to discuss your architectural choices, AI usage strategy, and any trade-offs made in a follow-up conversation.