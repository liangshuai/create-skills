# create-skills

A scaffolding tool for quickly creating [Agent Skills](https://agentskills.io) with the proper structure and templates.

## What are Agent Skills?

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows. A skill is a folder containing a `SKILL.md` file with metadata and instructions, plus optional scripts, templates, and reference materials.

## Installation

```bash
npm init skills <skill-name>
```

## Usage

### Basic Usage

Create a new skill with a default template:

```bash
npm init skills my-skill
```

### Interactive Mode

If you don't provide a skill name or description, you'll be prompted interactively:

```bash
npm init skills
```

### With Description

Provide a custom description for your skill:

```bash
npm init skills pdf-processor --description "Process and extract data from PDF files"
```

### With Optional Metadata

Include additional metadata like author, version, tags, and license:

```bash
npm init skills pdf-processor \
  --description "Process and extract data from PDF files" \
  --author "John Doe" \
  --version-flag "1.0.0" \
  --tags "pdf,processing,documents" \
  --license "MIT"
```

### Options

- `-d, --description <desc>` - Add a description for the skill (optional, will prompt if not provided)
- `--author <name>` - Author name (optional)
- `--version-flag <ver>` - Version number (optional)
- `--tags <tags>` - Comma-separated tags (optional)
- `--license <license>` - License type (optional)
- `-h, --help` - Show help information
- `-v, --version` - Show version number

## Generated Structure

The tool creates a complete skill structure:

```
my-skill/
├── SKILL.md          # Required: Main skill instructions and metadata
├── scripts/          # Optional: Executable scripts
├── references/       # Optional: Documentation and references
├── assets/           # Optional: Templates and resources
└── README.md         # Usage information
```

### SKILL.md Format

The generated `SKILL.md` includes proper YAML frontmatter with required and optional metadata:

```markdown
---
name: my-skill
description: A skill for my-skill functionality.
author: John Doe
version: 1.0.0
tags:
  - pdf
  - processing
license: MIT
---

# My-skill Skill

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
```

## Examples

### Create a PDF Processing Skill

```bash
npm init skills pdf-processor --description "Extract text and tables from PDF files"
```

### Create a Data Analysis Skill with Metadata

```bash
npm init skills data-analyzer \
  --description "Analyze datasets and generate reports" \
  --author "Jane Doe" \
  --tags "data,analysis,reports" \
  --license "Apache-2.0"
```

## Next Steps After Creation

1. Navigate to your skill directory: `cd my-skill`
2. Edit `SKILL.md` to add your skill's specific instructions
3. Add executable scripts to the `scripts/` directory
4. Include reference materials in `references/`
5. Add templates or other assets in `assets/`

## Skill Validation

After creating your skill, you can validate it using the [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) library:

```bash
skills-ref validate ./my-skill
```

## Features

- **Interactive Mode**: Prompts for required and optional metadata when not provided
- **Proper Structure**: Automatically creates the correct directory layout
- **YAML Frontmatter**: Generates valid SKILL.md with required metadata
- **Optional Metadata**: Supports author, version, tags, and license fields
- **Smart Filtering**: Only includes metadata fields that have actual values
- **Optional Directories**: Includes scripts, references, and assets folders
- **Validation**: Validates skill names and checks for existing directories
- **Helpful Messages**: Provides clear next steps and usage information

## Agent Skills Specification

This tool follows the [Agent Skills specification](https://agentskills.io/specification). Skills created with this tool are compatible with agents that support the Agent Skills format.

### Required Elements

- `SKILL.md` file with YAML frontmatter containing:
  - `name`: A short identifier
  - `description`: When to use this skill

### Optional Elements

- `scripts/` directory for executable code
- `references/` directory for documentation
- `assets/` directory for templates and resources

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [Agent Skills Documentation](https://agentskills.io)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Example Skills](https://github.com/anthropics/skills)
- [Skills Reference Library](https://github.com/agentskills/agentskills/tree/main/skills-ref)
