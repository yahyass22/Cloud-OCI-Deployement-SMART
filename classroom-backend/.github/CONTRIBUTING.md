# 🤝 Contributing to Classroom Backend

Thank you for your interest in contributing to the Classroom Backend API! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- ✅ Use welcoming and inclusive language
- ✅ Be respectful of differing viewpoints
- ✅ Gracefully accept constructive criticism
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members

### Unacceptable Behavior

- ❌ Harassment or discrimination
- ❌ Trolling or insulting comments
- ❌ Publishing others' private information
- ❌ Other unethical or unprofessional conduct

---

## Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/classroom-backend.git
cd classroom-backend
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your development credentials
nano .env

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

```
feature/add-new-endpoint      # New features
bugfix/fix-auth-issue         # Bug fixes
docs/update-readme            # Documentation
refactor/improve-middleware   # Code refactoring
test/add-unit-tests           # Tests
chore/update-dependencies     # Maintenance
```

---

## Development Setup

### Required Tools

- **Node.js:** 20+
- **npm:** Latest
- **Git:** Latest
- **PostgreSQL:** Neon account (free tier)

### Recommended Extensions

- **VS Code:**
  - ESLint
  - Prettier
  - TypeScript Hero
  - REST Client (for API testing)

### Environment Variables

Create `.env` in the project root:

```bash
# Database
DATABASE_URL=postgresql://your-neon-connection

# Better Auth
BETTER_AUTH_SECRET=dev-secret-key-minimum-32-characters-long
BETTER_AUTH_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Arcjet (use DRY_RUN for development)
ARCJET_KEY=your-arcjet-key
ARCJET_ENV=development

# Application
NODE_ENV=development
PORT=8000

# Optional: Debug mode
DEBUG_AUTH=true
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed:full
```

---

## Making Changes

### 1. Make Your Changes

```bash
# Edit files
# Make your changes...

# Check TypeScript compilation
npm run build

# Run development server
npm run dev
```

### 2. Test Your Changes

```bash
# Test API endpoints manually or with REST client
curl http://localhost:8000/api/dashboard/stats

# Check for TypeScript errors
npx tsc --noEmit

# Check code style (if linting configured)
npm run lint
```

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new dashboard endpoint"
```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(dashboard): add enrollment trends endpoint"
git commit -m "fix(auth): resolve session caching issue"
git commit -m "docs: update API documentation"
git commit -m "refactor(middleware): simplify auth middleware"
```

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code compiles without errors (`npm run build`)
- [ ] All existing tests pass
- [ ] New code is tested (if applicable)
- [ ] Code follows project style guidelines
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages are clear and follow conventions

### PR Title Format

```
<type>(<scope>): <description>
```

**Examples:**
```
feat(dashboard): add student distribution endpoint
fix(discussions): resolve vote counting bug
docs: add deployment guide
```

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (would require version bump)
- [ ] Documentation update

## Testing
Describe how you tested the changes:
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Follows code style guidelines

## Screenshots (if applicable)
Add screenshots of API responses or changes.

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks:** CI/CD runs tests and linting
2. **Code Review:** Maintainer reviews code quality
3. **Testing:** Changes are tested in staging environment
4. **Merge:** PR is merged into main branch

### Review Time

- We aim to review PRs within **48 hours**
- Complex PRs may take longer
- Be patient and responsive to feedback

---

## Coding Standards

### TypeScript

```typescript
// ✅ DO: Use explicit types for function parameters
async function getUserById(id: number): Promise<User | null> {
  // ...
}

// ✅ DO: Use interfaces for complex types
interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
}

// ✅ DO: Use type aliases for unions
type UserRole = 'student' | 'teacher' | 'admin';

// ❌ DON'T: Use 'any' type
function processData(data: any) { // WRONG
  // ...
}

// ✅ DO: Use unknown instead of any
function processData(data: unknown) {
  if (typeof data === 'object') {
    // ...
  }
}
```

### Express Routes

```typescript
// ✅ DO: Use async/await with try-catch
router.get('/stats', async (_req, res) => {
  try {
    const stats = await db.select(...);
    res.json(stats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ✅ DO: Use proper HTTP status codes
res.status(200).json({ data });  // OK
res.status(201).json({ data });  // Created
res.status(400).json({ error }); // Bad Request
res.status(401).json({ error }); // Unauthorized
res.status(404).json({ error }); // Not Found
res.status(500).json({ error }); // Server Error

// ❌ DON'T: Forget to handle errors
router.get('/stats', async (_req, res) => {
  const stats = await db.select(...);
  res.json(stats); // WRONG: No error handling
});
```

### Database Queries

```typescript
// ✅ DO: Use Drizzle ORM's type-safe queries
const users = await db
  .select()
  .from(user)
  .where(eq(user.role, 'student'));

// ✅ DO: Use transactions for multiple operations
await db.transaction(async (tx) => {
  await tx.insert(enrollments).values({...});
  await tx.update(classes).set({...});
});

// ❌ DON'T: Use raw SQL without parameterization
const result = await db.execute(
  `SELECT * FROM user WHERE id = ${userId}` // WRONG: SQL injection risk
);

// ✅ DO: Use parameterized queries
const result = await db.execute(
  sql`SELECT * FROM user WHERE id = ${userId}`
);
```

### Error Handling

```typescript
// ✅ DO: Log errors with context
catch (error) {
  console.error('GET /api/classes error:', error);
  res.status(500).json({ error: 'Failed to fetch classes' });
}

// ✅ DO: Include error details in development
if (process.env.NODE_ENV === 'development') {
  res.status(500).json({
    error: 'Failed to fetch classes',
    details: error instanceof Error ? error.message : String(error)
  });
}

// ❌ DON'T: Swallow errors silently
catch (error) {
  // WRONG: No logging, no response
}
```

### Security

```typescript
// ✅ DO: Validate user input
if (!title || !content) {
  return res.status(400).json({ error: 'Title and content are required' });
}

// ✅ DO: Use authentication middleware
router.post('/discussions', authMiddleware, async (req, res) => {
  // ...
});

// ✅ DO: Check permissions
if (req.user?.role !== 'teacher') {
  return res.status(403).json({ error: 'Forbidden - teachers only' });
}

// ❌ DON'T: Trust user input without validation
router.post('/discussions', async (req, res) => {
  const { title, content } = req.body; // WRONG: No validation
  // ...
});
```

---

## Testing

### Manual Testing

```bash
# Start development server
npm run dev

# Test endpoints with curl
curl http://localhost:8000/api/dashboard/stats
curl http://localhost:8000/api/classes
curl http://localhost:8000/api/subjects

# Test with authentication
curl -b cookies.txt http://localhost:8000/api/classes
```

### Using REST Client

Create `test.http` file:

```http
### Get Dashboard Stats
GET http://localhost:8000/api/dashboard/stats
Accept: application/json

### Get Classes
GET http://localhost:8000/api/classes?page=1&limit=10
Accept: application/json

### Create Discussion
POST http://localhost:8000/api/classes/1/discussions
Content-Type: application/json
Cookie: better-auth.session_token=your-token

{
  "title": "Test Discussion",
  "content": "This is a test",
  "type": "general"
}
```

### Database Testing

```bash
# Seed test data
npm run db:seed:full

# Verify data
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM classes;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM enrollments;"
```

---

## Documentation

### Code Comments

```typescript
// ✅ DO: Add JSDoc comments for exported functions
/**
 * Fetches dashboard statistics
 * @returns Promise containing aggregated stats
 */
async function getDashboardStats() {
  // ...
}

// ✅ DO: Comment complex logic
// Calculate enrollment saturation percentage
const saturation = (enrollmentCount / capacity) * 100;

// ❌ DON'T: State the obvious
const count = users.length; // get the count // WRONG
```

### README Updates

When adding new features, update relevant documentation:

- **New endpoint:** Update `docs/API_DOCUMENTATION.md`
- **Schema change:** Update `docs/DATABASE_SCHEMA.md`
- **Architecture change:** Update `docs/SYSTEM_DESIGN.md`
- **Deployment change:** Update `docs/DEPLOYMENT.md`

---

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug.

## To Reproduce
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Node.js version: 20.x.x
- OS: Windows/Mac/Linux
- Database: Neon PostgreSQL

## Logs
```
Error logs here
```

## Screenshots
If applicable.
```

### Feature Requests

```markdown
## Feature Description
What feature do you want?

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Any alternative solutions?

## Additional Context
Any other information.
```

---

## Development Workflow

### 1. Sync with Main

```bash
# Fetch latest changes
git fetch origin

# Rebase your branch
git checkout feature/your-feature
git rebase origin/main
```

### 2. Resolve Conflicts

```bash
# If conflicts occur during rebase
# Edit conflicted files
git add <resolved-files>
git rebase --continue
```

### 3. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature

# If rebased, force push
git push origin feature/your-feature --force
```

### 4. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Requests" → "New Pull Request"
3. Select base branch: `main`
4. Select compare branch: `feature/your-feature`
5. Fill in PR description
6. Submit

---

## Release Process

### Version Bumping

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR:** Breaking changes (1.0.0 → 2.0.0)
- **MINOR:** New features (1.0.0 → 1.1.0)
- **PATCH:** Bug fixes (1.0.0 → 1.0.1)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes published

---

## Questions?

- **General Questions:** Open a GitHub Discussion
- **Bug Reports:** Open an Issue
- **Feature Requests:** Open an Issue with "enhancement" label
- **Security Issues:** Email security@classroom.example.com

---

## Thank You!

Your contributions make the Classroom Backend better for everyone. We appreciate your time and effort!

🎓 Happy Coding!
