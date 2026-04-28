# Contributing to Grawizah

Thank you for your interest in contributing to Grawizah!

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/grawizah/platform.git
cd platform
```

2. Install dependencies
```bash
npm install
cd backend && go mod download
```

3. Setup environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Run development servers
```bash
# Frontend
npm run dev

# Backend
cd backend && go run cmd/main.go
```

## Code Style

### TypeScript/React
- Use TypeScript strict mode
- Follow OOP principles (see docs/OOP_ARCHITECTURE.md)
- Use functional components with hooks
- Implement proper error handling

### Golang
- Follow Go conventions
- Use struct embedding for inheritance
- Implement interfaces for polymorphism
- Write unit tests for all services

### Database
- Use migrations for schema changes
- Always include RLS policies
- Document stored functions
- Create indexes for performance

## Pull Request Process

1. Create feature branch from `main`
2. Implement changes following OOP principles
3. Write/update tests
4. Update documentation
5. Submit PR with clear description

## OOP Guidelines

All code must follow the 4 OOP pillars:

1. **Encapsulation** - Use private fields with getters/setters
2. **Inheritance** - Extend base classes/structs
3. **Polymorphism** - Implement interfaces
4. **Abstraction** - Hide implementation details

See `docs/OOP_ARCHITECTURE.md` for examples.

## Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend && go test ./...
```

## Questions?

Open an issue or contact the team at dev@grawizah.com
