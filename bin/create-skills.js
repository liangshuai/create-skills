#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  validateSkillName,
  validatePathAvailable,
  createDirectoryStructure,
  createSkillMd,
  createReadme,
} = require('../lib/utils');

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);

  // Check for help and version flags first
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    printVersion();
    process.exit(0);
  }

  // Parse arguments
  const skillName = args[0];
  const options = {
    description: '',
    targetDir: process.cwd(),
  };

  // Parse optional flags
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--description' || arg === '-d') {
      options.description = args[++i] || '';
    }
  }

  // Validate skill name
  if (!skillName) {
    console.error('Error: Please provide a skill name.');
    console.error('Usage: npm create skills <skill-name>');
    console.error('   or: npx create-skills <skill-name>');
    console.error('\nRun "npm create skills --help" for more information.');
    process.exit(1);
  }

  if (!validateSkillName(skillName)) {
    console.error(`Error: Invalid skill name "${skillName}"`);
    console.error('Skill names must:');
    console.error('  - Contain only alphanumeric characters, hyphens, and underscores');
    console.error('  - Not start with a dot or hyphen');
    console.error('  - Not be empty');
    process.exit(1);
  }

  // Determine target path
  const targetPath = path.join(options.targetDir, skillName);

  // Check if path already exists
  if (!validatePathAvailable(targetPath)) {
    console.error(`Error: Directory "${skillName}" already exists in the current location.`);
    console.error('Please choose a different name or remove the existing directory.');
    process.exit(1);
  }

  try {
    // Create the skill directory
    fs.mkdirSync(targetPath, { recursive: true });

    // Create directory structure
    const directories = ['scripts', 'references', 'assets'];
    createDirectoryStructure(targetPath, directories);

    // Create SKILL.md
    createSkillMd(targetPath, skillName, options.description);

    // Create README.md
    createReadme(targetPath, skillName);

    // Success message
    console.log(`✓ Successfully created skill "${skillName}"`);
    console.log(`\nLocation: ${targetPath}`);
    console.log('\nNext steps:');
    console.log(`  1. cd ${skillName}`);
    console.log('  2. Edit SKILL.md to add your skill instructions');
    console.log('  3. Add scripts, references, and assets as needed');
    console.log('\nFor more information, visit: https://agentskills.io');

  } catch (error) {
    console.error('Error creating skill:', error.message);
    process.exit(1);
  }
}

/**
 * Prints help information
 */
function printHelp() {
  console.log(`
create-skills - Scaffolding tool for Agent Skills

USAGE:
  npm create skills <skill-name> [options]
  npx create-skills <skill-name> [options]

ARGUMENTS:
  <skill-name>              Name of the skill to create (required)

OPTIONS:
  -d, --description <desc>  Description for the skill (optional)
  -h, --help               Show this help message
  -v, --version            Show version number

EXAMPLES:
  npm create skills my-first-skill
  npm create skills pdf-processor --description "Process PDF files"
  npx create-skills data-analyzer -d "Analyze datasets"

DESCRIPTION:
  Creates a new Agent Skill with the following structure:

  my-skill/
  ├── SKILL.md          # Required: Main skill instructions and metadata
  ├── scripts/          # Optional: Executable scripts
  ├── references/       # Optional: Documentation and references
  ├── assets/           # Optional: Templates and resources
  └── README.md         # Usage information

For more information about Agent Skills, visit: https://agentskills.io
`);
}

/**
 * Prints version information
 */
function printVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`create-skills v${packageJson.version}`);
}

// Run the CLI
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
