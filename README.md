# create-skills

A scaffolding tool for quickly creating [Agent Skills](https://agentskills.io) with the proper structure and templates.

## What are Agent Skills?

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows. A skill is a folder containing a `SKILL.md` file with metadata and instructions, plus optional scripts, templates, and reference materials.

## Installation

```bash
npm create skills <skill-name>
```

Or using npx:

```bash
npx create-skills <skill-name>
```

## Usage

### Basic Usage

Create a new skill with a default template:

```bash
npm create skills my-skill
```

Or:

```bash
npx create-skills my-skill
```

### With Description

Provide a custom description for your skill:

```bash
npm create skills pdf-processor --description "Process and extract data from PDF files"
```

### Options

- `-d, --description <desc>` - Add a description for the skill
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

The generated `SKILL.md` includes proper YAML frontmatter:

```markdown
---
name: my-skill
description: A skill for my-skill functionality.
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
npm create skills pdf-processor --description "Extract text and tables from PDF files"
```

### Create a Data Analysis Skill

```bash
npx create-skills data-analyzer -d "Analyze datasets and generate reports"
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

- **Proper Structure**: Automatically creates the correct directory layout
- **YAML Frontmatter**: Generates valid SKILL.md with required metadata
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

MIT © [Your Name]

## Links

- [Agent Skills Documentation](https://agentskills.io)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Example Skills](https://github.com/anthropics/skills)
- [Skills Reference Library](https://github.com/agentskills/agentskills/tree/main/skills-ref)
