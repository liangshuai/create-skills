#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
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

  // Parse initial arguments
  let skillName = args[0];
  let description = '';
  let author = '';
  let version = '';
  let tags = [];
  let license = '';
  let targetDir = process.cwd();

  // Parse optional flags
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--description' || arg === '-d') {
      description = args[++i] || '';
    } else if (arg === '--author') {
      author = args[++i] || '';
    } else if (arg === '--version-flag') {
      version = args[++i] || '';
    } else if (arg === '--tags') {
      const tagsStr = args[++i] || '';
      tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
    } else if (arg === '--license') {
      license = args[++i] || '';
    }
  }

  // Check if running in interactive mode (TTY)
  const isInteractive = process.stdin.isTTY;

  // Interactive mode: prompt for missing required fields
  if (!skillName && isInteractive) {
    console.log('Welcome to create-skills! Let\'s create a new Agent Skill.\n');
    const response = await prompts({
      type: 'text',
      name: 'skillName',
      message: 'What is the name of your skill?',
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Skill name is required';
        }
        if (!validateSkillName(value)) {
          return 'Skill name must contain only alphanumeric characters, hyphens, and underscores';
        }
        return true;
      }
    });

    if (!response.skillName) {
      console.log('Cancelled.');
      process.exit(0);
    }

    skillName = response.skillName;
  }

  // Validate skill name if provided via command line
  if (skillName && !validateSkillName(skillName)) {
    console.error(`Error: Invalid skill name "${skillName}"`);
    console.error('Skill names must:');
    console.error('  - Contain only alphanumeric characters, hyphens, and underscores');
    console.error('  - Not start with a dot or hyphen');
    console.error('  - Not be empty');
    process.exit(1);
  }

  // If no skill name and not interactive, show error
  if (!skillName && !isInteractive) {
    console.error('Error: Please provide a skill name.');
    console.error('Usage: npm create skills <skill-name>');
    console.error('   or: npx create-skills <skill-name>');
    console.error('\nRun "npm create skills --help" for more information.');
    process.exit(1);
  }

  // Determine target path
  const targetPath = path.join(targetDir, skillName);

  // Check if path already exists
  if (!validatePathAvailable(targetPath)) {
    console.error(`Error: Directory "${skillName}" already exists in the current location.`);
    console.error('Please choose a different name or remove the existing directory.');
    process.exit(1);
  }

  // Interactive mode: prompt for description if not provided
  if (!description && isInteractive) {
    const response = await prompts({
      type: 'text',
      name: 'description',
      message: 'Provide a brief description for your skill:',
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Description is required';
        }
        return true;
      }
    });

    if (!response.description) {
      console.log('Cancelled.');
      process.exit(0);
    }

    description = response.description;
  }

  // If no description and not interactive, show error
  if (!description && !isInteractive) {
    console.error('Error: Please provide a description using --description flag.');
    console.error('Usage: npm create skills <skill-name> --description "Your description"');
    console.error('\nOr run interactively: npm create skills');
    process.exit(1);
  }

  // Interactive mode: prompt for optional fields only if not already provided and in interactive mode
  if (isInteractive) {
    const optionalFields = {};

    if (!author) {
      const authorResponse = await prompts({
        type: 'text',
        name: 'author',
        message: 'Author name (optional, press Enter to skip):',
      });
      optionalFields.author = authorResponse.author;
    }

    if (!version) {
      const versionResponse = await prompts({
        type: 'text',
        name: 'version',
        message: 'Version (optional, e.g., 1.0.0, press Enter to skip):',
      });
      optionalFields.version = versionResponse.version;
    }

    if (!tags || tags.length === 0) {
      const tagsResponse = await prompts({
        type: 'list',
        name: 'tags',
        message: 'Tags (optional, press Enter to skip):',
      });
      optionalFields.tags = tagsResponse.tags;
    }

    if (!license) {
      const licenseResponse = await prompts({
        type: 'text',
        name: 'license',
        message: 'License (optional, e.g., MIT, press Enter to skip):',
      });
      optionalFields.license = licenseResponse.license;
    }

    // Update with responses
    author = optionalFields.author || author;
    version = optionalFields.version || version;
    tags = optionalFields.tags || tags;
    license = optionalFields.license || license;
  }

  try {
    // Create the skill directory
    fs.mkdirSync(targetPath, { recursive: true });

    // Create directory structure
    const directories = ['scripts', 'references', 'assets'];
    createDirectoryStructure(targetPath, directories);

    // Create SKILL.md with metadata (only include fields that have values)
    const metadata = {
      name: skillName,
      description
    };

    // Only add optional fields if they have values
    if (author) metadata.author = author;
    if (version) metadata.version = version;
    if (tags && tags.length > 0) metadata.tags = tags;
    if (license) metadata.license = license;

    createSkillMd(targetPath, metadata);

    // Create README.md
    createReadme(targetPath, skillName);

    // Success message
    console.log(`\n✓ Successfully created skill "${skillName}"`);
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
  npm create skills [skill-name] [options]
  npx create-skills [skill-name] [options]

ARGUMENTS:
  [skill-name]              Name of the skill to create (optional, will prompt if not provided)

OPTIONS:
  -d, --description <desc>  Description for the skill (optional, will prompt if not provided)
  --author <name>          Author name (optional)
  --version-flag <ver>     Version number (optional)
  --tags <tags>            Comma-separated tags (optional)
  --license <license>      License type (optional)
  -h, --help               Show this help message
  -v, --version            Show version number

EXAMPLES:
  # Interactive mode (prompts for all required fields)
  npm create skills

  # Quick creation with name and description
  npm create skills my-first-skill --description "My first skill"

  # Complete example with all metadata
  npm create skills pdf-processor --description "Process PDF files" --author "John Doe" --version-flag "1.0.0" --tags "pdf,processing" --license "MIT"

  # Using npx
  npx create-skills data-analyzer -d "Analyze datasets"

DESCRIPTION:
  Creates a new Agent Skill with the following structure:

  my-skill/
  ├── SKILL.md          # Required: Main skill instructions and metadata
  ├── scripts/          # Optional: Executable scripts
  ├── references/       # Optional: Documentation and references
  ├── assets/           # Optional: Templates and resources
  └── README.md         # Usage information

  If you don't provide a skill name or description, you'll be prompted
  to enter them interactively. Optional metadata fields (author, version,
  tags, license) can also be provided via flags or will be prompted if omitted.

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
