export interface SkillFrontmatter {
  name: string;
  description: string;
  tools?: string[];
  context: 'inline' | 'fork';
  disable_model_invocation?: boolean;
}

export interface ParsedSkillDefinition {
  frontmatter: SkillFrontmatter;
  body: string;
  rawContent: string;
  filePath: string;
}
