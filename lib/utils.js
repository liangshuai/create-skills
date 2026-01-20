const fs = require('fs');
const path = require('path');

/**
 * Validates a skill name to ensure it's safe to use as a directory name
 * @param {string} name - The skill name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateSkillName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Check for empty string or just whitespace
  if (name.trim().length === 0) {
    return false;
  }

  // Check for invalid characters (only allow alphanumeric, hyphens, and underscores)
  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!validNameRegex.test(name)) {
    return false;
  }

  // Check if it starts with a dot or hyphen (hidden directory issues)
  if (name.startsWith('.') || name.startsWith('-')) {
    return false;
  }

  return true;
}

/**
 * Validates that a path doesn't already exist
 * @param {string} targetPath - The path to check
 * @returns {boolean} - True if path is available, false if it exists
 */
function validatePathAvailable(targetPath) {
  return !fs.existsSync(targetPath);
}

/**
 * Creates a directory structure for a skill
 * @param {string} skillPath - The base path for the skill
 * @param {Array<string>} directories - Array of directory names to create
 */
function createDirectoryStructure(skillPath, directories = []) {
  directories.forEach(dir => {
    const dirPath = path.join(skillPath, dir);
    fs.mkdirSync(dirPath, { recursive: true });

    // Create a .gitkeep file to ensure empty directories are tracked
    fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
  });
}

/**
 * Generates the content for SKILL.md file
 * @param {string} skillName - The name of the skill
 * @param {string} description - Optional description
 * @returns {string} - The content for SKILL.md
 */
function generateSkillMdContent(skillName, description = '') {
  const defaultDescription = description || `A skill for ${skillName} functionality.`;

  return `---
name: ${skillName}
description: ${defaultDescription}
---

# ${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Skill

## When to use this skill
Use this skill when you need to...

## How it works
1. First step...
2. Second step...
3. Third step...

## Examples
Provide examples of how to use this skill...

## Notes
Add any additional notes or considerations here...
`;
}

/**
 * Creates the SKILL.md file
 * @param {string} skillPath - The path to the skill directory
 * @param {string} skillName - The name of the skill
 * @param {string} description - Optional description
 */
function createSkillMd(skillPath, skillName, description = '') {
  const content = generateSkillMdContent(skillName, description);
  fs.writeFileSync(path.join(skillPath, 'SKILL.md'), content);
}

/**
 * Creates a README.md file for the skill with usage instructions
 * @param {string} skillPath - The path to the skill directory
 * @param {string} skillName - The name of the skill
 */
function createReadme(skillPath, skillName) {
  const content = `# ${skillName} Skill

This is an Agent Skill created with \`create-skills\`.

## Structure

\`\`\`
${skillName}/
├── SKILL.md          # Required: Main skill instructions and metadata
├── scripts/          # Optional: Executable scripts
├── references/       # Optional: Documentation and references
├── assets/           # Optional: Templates and resources
└── README.md         # This file
\`\`\`

## Usage

1. Edit \`SKILL.md\` to add your skill's instructions
2. Add any scripts to the \`scripts/\` directory
3. Add reference materials to \`references/\`
4. Add templates or other assets to \`assets/\`

## Next Steps

- Customize the \`description\` in SKILL.md frontmatter
- Add detailed instructions in the SKILL.md body
- Include examples and use cases
- Add any necessary scripts or resources

For more information about Agent Skills, visit:
https://agentskills.io
`;

  fs.writeFileSync(path.join(skillPath, 'README.md'), content);
}

module.exports = {
  validateSkillName,
  validatePathAvailable,
  createDirectoryStructure,
  createSkillMd,
  createReadme,
  generateSkillMdContent,
};
