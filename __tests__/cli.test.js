const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cliPath = path.join(__dirname, '..', 'bin', 'create-skills.js');

describe('CLI Integration Tests', () => {
  const testDir = path.join(__dirname, 'temp-cli-test');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  const runCli = (args, cwd = testDir) => {
    try {
      const output = execSync(`node ${cliPath} ${args}`, {
        cwd,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return { success: true, output };
    } catch (error) {
      return { success: false, error: error.message, output: error.stdout || '' };
    }
  };

  test('creates basic skill structure', () => {
    const result = runCli('test-skill');
    expect(result.success).toBe(true);
    expect(result.output).toContain('Successfully created skill "test-skill"');

    const skillPath = path.join(testDir, 'test-skill');
    expect(fs.existsSync(skillPath)).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'scripts'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'references'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'assets'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'README.md'))).toBe(true);
  });

  test('creates skill with custom description', () => {
    const result = runCli('my-skill --description "Custom skill description"');
    expect(result.success).toBe(true);

    const skillMdPath = path.join(testDir, 'my-skill', 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');
    expect(content).toContain('description: Custom skill description');
  });

  test('validates skill name', () => {
    const result = runCli('"invalid name"');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid skill name');
  });

  test('prevents overwriting existing directory', () => {
    // Create initial skill
    const firstResult = runCli('existing-skill');
    expect(firstResult.success).toBe(true);

    // Try to create again
    const secondResult = runCli('existing-skill');
    expect(secondResult.success).toBe(false);
    expect(secondResult.error).toContain('already exists');
  });

  test('shows help with --help flag', () => {
    const result = runCli('--help');
    expect(result.success).toBe(true);
    expect(result.output).toContain('create-skills');
    expect(result.output).toContain('USAGE:');
    expect(result.output).toContain('OPTIONS:');
  });

  test('shows help with -h flag', () => {
    const result = runCli('-h');
    expect(result.success).toBe(true);
    expect(result.output).toContain('create-skills');
  });

  test('shows version with --version flag', () => {
    const result = runCli('--version');
    expect(result.success).toBe(true);
    expect(result.output).toContain('create-skills v');
  });

  test('shows version with -v flag', () => {
    const result = runCli('-v');
    expect(result.success).toBe(true);
    expect(result.output).toContain('create-skills v');
  });

  test('errors when no skill name provided', () => {
    const result = runCli('');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Please provide a skill name');
  });

  test('creates .gitkeep files in optional directories', () => {
    runCli('gitkeep-test');
    const skillPath = path.join(testDir, 'gitkeep-test');

    expect(fs.existsSync(path.join(skillPath, 'scripts', '.gitkeep'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'references', '.gitkeep'))).toBe(true);
    expect(fs.existsSync(path.join(skillPath, 'assets', '.gitkeep'))).toBe(true);
  });

  test('generates valid YAML frontmatter in SKILL.md', () => {
    runCli('yaml-test');
    const skillMdPath = path.join(testDir, 'yaml-test', 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');

    expect(content).toMatch(/^---\nname:/);
    expect(content).toMatch(/description:/);
    expect(content).toMatch(/---\s*\n#/);
  });

  test('capitalizes skill name in title', () => {
    runCli('lowercase-skill');
    const skillMdPath = path.join(testDir, 'lowercase-skill', 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');
    expect(content).toContain('# Lowercase-skill Skill');
  });

  test('includes comprehensive README', () => {
    runCli('readme-test');
    const readmePath = path.join(testDir, 'readme-test', 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');

    expect(content).toContain('# readme-test Skill');
    expect(content).toContain('## Structure');
    expect(content).toContain('## Usage');
    expect(content).toContain('## Next Steps');
    expect(content).toContain('https://agentskills.io');
  });
});
