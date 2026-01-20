# Testing Documentation

This document describes the testing setup for the `create-skills` package.

## Test Setup

The package uses **Jest** as the testing framework with the following configuration:

- **Test Environment**: Node.js
- **Test Files**: Located in `__tests__/` directory
- **Coverage**: Generated in `coverage/` directory

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Test Coverage

### Current Coverage
- **lib/utils.js**: 100% statements, 94.11% branches, 100% functions, 100% lines
- **bin/create-skills.js**: Covered via integration tests
- **Overall**: Excellent coverage of core functionality

### Test Suites

1. **Unit Tests** (`__tests__/utils.test.js`)
   - `validateSkillName()` - Input validation
   - `validatePathAvailable()` - Path checking
   - `createDirectoryStructure()` - Directory creation
   - `generateSkillMdContent()` - Content generation
   - `createSkillMd()` - File creation
   - `createReadme()` - README generation

2. **Integration Tests** (`__tests__/cli.test.js`)
   - Basic skill creation
   - Custom descriptions
   - Name validation
   - Overwrite protection
   - Help/version flags
   - Directory structure generation
   - YAML frontmatter validation

## Test Statistics

- **Total Tests**: 31
- **Status**: All passing ✓
- **Test Suites**: 2
- **Coverage**: Excellent (100% for utilities)

## Test Categories

### Validation Tests
- ✓ Valid skill names (alphanumeric, hyphens, underscores)
- ✗ Invalid skill names (spaces, special characters, etc.)
- ✓ Path availability checking
- ✓ Duplicate directory prevention

### File Generation Tests
- ✓ SKILL.md with proper YAML frontmatter
- ✓ README.md with usage instructions
- ✓ Optional directories (scripts, references, assets)
- ✓ .gitkeep files in empty directories

### CLI Tests
- ✓ Basic command execution
- ✓ Custom description flag
- ✓ Help flag (-h, --help)
- ✓ Version flag (-v, --version)
- ✓ Error messages for invalid input

## Writing New Tests

When adding new features, follow this pattern:

```javascript
describe('Feature Name', () => {
  // Setup and teardown
  beforeEach(() => {
    // Prepare test environment
  });

  afterEach(() => {
    // Clean up test environment
  });

  // Test cases
  test('does something specific', () => {
    // Arrange
    const input = // test data

    // Act
    const result = // function call

    // Assert
    expect(result).toBe(expected);
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up created files/directories
3. **Descriptive Names**: Test names should clearly describe what they test
4. **One Assertion Per Test**: Keep tests focused
5. **Mock External Dependencies**: Don't rely on external services

## Continuous Integration

For CI/CD pipelines, use:

```bash
pnpm test -- --ci --coverage --maxWorkers=2
```

This provides:
- Fast test execution
- Coverage reports
- CI-friendly output
