# React Frontend & Bun Backend TypeScript Coding Guidelines

## Core Principle: Simplicity Before Complexity
- Be extremely concise. Sacrifice grammar for the sake of concision.
- Prefer built-in language features over external libraries when possible
- Choose readable code over clever code
- Favour explicit over implicit implementations

## Problem-Solving Hierarchy
1. Use standard library functions and methods first
2. Write straightforward, linear logic before considering abstractions
3. Only introduce patterns (factories, builders, etc.) when simple approaches fail
4. Avoid premature optimisation - make it work first, optimise later

## Code Style & Architecture
- Prefer clear variable and function names over comments
- Use early returns to reduce nesting instead of complex conditional chains
- Choose composition over inheritance when both are viable
- Write functions that do one thing well rather than multi-purpose utilities
- Start with flat structures before introducing hierarchies
- Use direct function calls before event systems or messaging patterns
- Implement features in the most straightforward location first
- Only extract abstractions when you see clear duplication (Rule of Three)

## Dependency Management
- Avoid adding new dependencies unless absolutely necessary
- Check if the problem can be solved with existing project dependencies first
- Consider the maintenance cost of each new dependency
- Prefer well-established, lightweight libraries over feature-heavy alternatives

## Error Handling & Performance
- Use simple if/else checks before try/catch blocks when appropriate
- Return error values/objects instead of throwing exceptions for expected errors
- Provide clear, actionable error messages
- Handle errors at the appropriate level of abstraction
- Write correct code first, then optimise bottlenecks if they exist
- Use profiling data rather than assumptions to guide optimisation decisions
- Remember that readable code is easier to optimise later

## Testing Strategy
- **Avoid meaningless tests** - never write tests that assert trivial truths like `expect(true).toBe(true)` or `expect(variable).toBeTruthy()` without verifying actual behaviour
- Tests must verify real behaviour or state changes, not just that code runs
- If a test only checks that a function was called or a component rendered without throwing, consider if it adds value
- Write simple, focused unit tests that test one behaviour
- Prefer testing public interfaces over internal implementation details
- Use descriptive test names that explain the expected behaviour
- Start with happy path tests, then add edge cases
- Structure tests with Arrange-Act-Assert pattern
- Mock external dependencies and API calls
- Create test files in the same directory as source with `*.test.ts` extension
- Use Bun's built-in test runner with Happy DOM for frontend tests

### Examples of Meaningless Tests to Avoid:
```typescript
// BAD - tests nothing
it("applies custom prop", () => {
  render(<Component customProp={true} />)
  expect(true).toBe(true)
})

// BAD - only tests it doesn't crash
it("accepts optional prop", () => {
  const result = render(<Component optional="value" />)
  expect(result).toBeTruthy()
})

// GOOD - tests actual behaviour
it("disables button when disabled prop is true", () => {
  const { getByRole } = render(<Button disabled={true} />)
  expect(getByRole("button")).toBeDisabled()
})
```

## Language & Formatting
**Important**: Use British spelling throughout as this is a UK project.

- We use Prettier for code formatting
- 2 spaces for indentation
- Maximum line length is 80 characters
- Use Bun as the runtime for both frontend and backend development

## Naming Conventions
- Use PascalCase for `type` names, `interface` names, and React components
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible
- Suffix component prop interfaces with `Props` (e.g., `ButtonProps`)

## Frontend Component Structure
- New components should be named Component.tsx and exported as named components
- New components do not need to live in their own folder
- Prefer functional components with React hooks over class components
- Keep components small and focused on a single responsibility
- Structure components as follows (note styles are declared directly, not with a StyleSheet):

```typescript
import React from "react"

interface ButtonProps {
  title: string
  onClick: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ title, onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  )
}
```

## Backend Service Structure
- Services should be in `backend/src/services/`
- Use TypeScript decorators for cross-cutting concerns
- Follow the existing pattern of handlers, services, and utilities
- Use Bun's built-in features for file operations and HTTP handling

## TypeScript
- Use explicit typing instead of inferring when the type is not obvious
- Do not export `types` or `functions` unless needed across multiple components
- Avoid using `any` type when possible
- Use type aliases for complex types
- Order imports: installed dependencies first, then local dependencies, finally theme imports

## Comments & Documentation
- Use JSDoc style comments for `functions`, `interfaces`, and components
- Use JSDoc comments for any existing or new props
- Keep comments concise and under 80 characters per line

## File Organisation & Best Practices
- Frontend: All components live in `frontend/src/components/`, containers in `frontend/src/containers/`
- Backend: All services live in `backend/src/services/`, handlers in `backend/src/handlers/`
- Use template literals for string interpolation
- All user-visible strings should be externalised for localisation
- Practice immutability with state updates
- Use destructuring for props and state
- Avoid direct DOM manipulation
- Extract business logic from components into custom hooks
- Optimise `useEffect` dependencies to prevent unnecessary renders
- Avoid anonymous functions in render methods where possible
- Use `useCallback` for functions passed to child components
- Use `useMemo` for expensive calculations

## Development Commands
- `just check` - run linting, code formatting, and type checking for both frontend and backend
- `just fix` - automatically fix linting and formatting issues for both frontend and backend
- `just test` - run all tests (frontend with Happy DOM, backend with Bun test runner)
- `just dev` - start both frontend and backend in development mode with hot reload
- `just fe <command>` - run frontend-specific commands (e.g., `just fe build`, `just fe test`)
- `just be <command>` - run backend-specific commands (e.g., `just be build`, `just be test`)
