const fs = require('fs');
const path = require('path');
const {
  validateSkillName,
  validatePathAvailable,
  createDirectoryStructure,
  generateSkillMdContent,
  createSkillMd,
  createReadme,
} = require('../lib/utils');

describe('validateSkillName', () => {
  test('accepts valid skill names', () => {
    expect(validateSkillName('my-skill')).toBe(true);
    expect(validateSkillName('my_skill')).toBe(true);
    expect(validateSkillName('mySkill')).toBe(true);
    expect(validateSkillName('my-skill-123')).toBe(true);
    expect(validateSkillName('skill')).toBe(true);
    expect(validateSkillName('123skill')).toBe(true);
  });

  test('rejects invalid skill names', () => {
    expect(validateSkillName('')).toBe(false);
    expect(validateSkillName('   ')).toBe(false);
    expect(validateSkillName('my skill')).toBe(false);
    expect(validateSkillName('my.skill')).toBe(false);
    expect(validateSkillName('.hidden')).toBe(false);
    expect(validateSkillName('-dashed')).toBe(false);
    expect(validateSkillName('my/skill')).toBe(false);
    expect(validateSkillName('my\\skill')).toBe(false);
  });

  test('rejects non-string values', () => {
    expect(validateSkillName(null)).toBe(false);
    expect(validateSkillName(undefined)).toBe(false);
    expect(validateSkillName(123)).toBe(false);
    expect(validateSkillName({})).toBe(false);
    expect(validateSkillName([])).toBe(false);
  });
});

describe('validatePathAvailable', () => {
  const testDir = path.join(__dirname, 'temp-test-dir');

  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('returns true when path does not exist', () => {
    expect(validatePathAvailable(testDir)).toBe(true);
  });

  test('returns false when path exists', () => {
    fs.mkdirSync(testDir, { recursive: true });
    expect(validatePathAvailable(testDir)).toBe(false);
  });
});

describe('createDirectoryStructure', () => {
  const testDir = path.join(__dirname, 'temp-test-structure');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('creates specified directories', () => {
    const directories = ['scripts', 'references', 'assets'];
    createDirectoryStructure(testDir, directories);

    directories.forEach(dir => {
      const dirPath = path.join(testDir, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
  });

  test('creates .gitkeep files in empty directories', () => {
    const directories = ['scripts', 'references'];
    createDirectoryStructure(testDir, directories);

    directories.forEach(dir => {
      const gitkeepPath = path.join(testDir, dir, '.gitkeep');
      expect(fs.existsSync(gitkeepPath)).toBe(true);
    });
  });

  test('handles empty directory list', () => {
    // The function only creates subdirectories, not the base directory
    // So we need to create the base directory first
    fs.mkdirSync(testDir, { recursive: true });
    createDirectoryStructure(testDir, []);
    expect(fs.existsSync(testDir)).toBe(true);
  });
});

describe('generateSkillMdContent', () => {
  test('generates content with default description', () => {
    const content = generateSkillMdContent({ name: 'my-skill' });
    expect(content).toContain('name: my-skill');
    expect(content).toContain('description: A skill for my-skill functionality.');
    expect(content).toContain('# My-skill Skill');
    expect(content).toContain('## When to use this skill');
    expect(content).toContain('## How it works');
  });

  test('generates content with custom description', () => {
    const customDesc = 'Custom skill description';
    const content = generateSkillMdContent({ name: 'my-skill', description: customDesc });
    expect(content).toContain('name: my-skill');
    expect(content).toContain(`description: ${customDesc}`);
  });

  test('generates content with optional fields', () => {
    const content = generateSkillMdContent({
      name: 'my-skill',
      description: 'Test description',
      author: 'Test Author',
      version: '1.0.0',
      tags: ['test', 'demo'],
      license: 'MIT'
    });
    expect(content).toContain('name: my-skill');
    expect(content).toContain('description: Test description');
    expect(content).toContain('author: Test Author');
    expect(content).toContain('version: 1.0.0');
    expect(content).toContain('tags:');
    expect(content).toContain('- test');
    expect(content).toContain('- demo');
    expect(content).toContain('license: MIT');
  });

  test('capitalizes first letter of skill name in title', () => {
    const content = generateSkillMdContent({ name: 'my-skill' });
    expect(content).toContain('# My-skill Skill');
  });

  test('includes proper YAML frontmatter', () => {
    const content = generateSkillMdContent({ name: 'test-skill', description: 'Test description' });
    expect(content).toMatch(/^---\nname: test-skill\ndescription: Test description\n---/);
  });
});

describe('createSkillMd', () => {
  const testDir = path.join(__dirname, 'temp-test-skillmd');

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

  test('creates SKILL.md file', () => {
    createSkillMd(testDir, { name: 'my-skill', description: 'Test' });
    const skillMdPath = path.join(testDir, 'SKILL.md');
    expect(fs.existsSync(skillMdPath)).toBe(true);
  });

  test('creates SKILL.md with correct content', () => {
    createSkillMd(testDir, { name: 'my-skill', description: 'Custom description' });
    const skillMdPath = path.join(testDir, 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');
    expect(content).toContain('name: my-skill');
    expect(content).toContain('description: Custom description');
    expect(content).toContain('# My-skill Skill');
  });

  test('creates SKILL.md with optional metadata', () => {
    createSkillMd(testDir, {
      name: 'my-skill',
      description: 'Test',
      author: 'Test Author',
      version: '1.0.0',
      tags: ['test'],
      license: 'MIT'
    });
    const skillMdPath = path.join(testDir, 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');
    expect(content).toContain('author: Test Author');
    expect(content).toContain('version: 1.0.0');
    expect(content).toContain('tags:');
    expect(content).toContain('license: MIT');
  });
});

describe('createReadme', () => {
  const testDir = path.join(__dirname, 'temp-test-readme');

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

  test('creates README.md file', () => {
    createReadme(testDir, 'my-skill');
    const readmePath = path.join(testDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  test('creates README.md with skill name', () => {
    createReadme(testDir, 'my-skill');
    const readmePath = path.join(testDir, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).toContain('# my-skill Skill');
    expect(content).toContain('my-skill/');
  });

  test('includes usage instructions', () => {
    createReadme(testDir, 'my-skill');
    const readmePath = path.join(testDir, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).toContain('## Usage');
    expect(content).toContain('## Structure');
    expect(content).toContain('## Next Steps');
  });

  test('includes link to agentskills.io', () => {
    createReadme(testDir, 'my-skill');
    const readmePath = path.join(testDir, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).toContain('https://agentskills.io');
  });
});
