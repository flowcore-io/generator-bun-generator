import type { GeneratorOptions } from ".."
import { type TemplateString, isKebabCase, toTemplateString, validate } from "../helpers"
import type { YoTemplate } from "../types"

export interface AnswersGenerator {
  folder: string
  name: string
  scope: string
  description: string
  features: string[]
}

export interface TemplateValuesGenerator {
  folder: string
  name: TemplateString
  scope: TemplateString
  packageName: string
  description: string
  generatorName: string
}

const generator: YoTemplate<GeneratorOptions, AnswersGenerator, TemplateValuesGenerator> = {
  questions: async (generator) => {
    const folder = generator.options.folder
    const answers = await generator.prompt<AnswersGenerator>([
      {
        type: "input",
        name: "name",
        message: "Generator name (e.g. some-generator), generator will be applied to the package name",
        default: generator.options.folder,
        validate: validate("Generator name", isKebabCase),
      },
      {
        type: "input",
        name: "scope",
        message: "Generator npm scope (@[scope]/generator-name)",
        default: generator.options.scope,
        validate: validate("Generator npm scope", isKebabCase, true),
      },
      {
        type: "input",
        name: "description",
        message: "Generator description",
        default: "",
      },
      {
        type: "checkbox",
        name: "features",
        message: "Which features would you like to add?",
        choices: [{ name: "github-actions", value: "github-actions", checked: generator.options.githubActions }],
      },
    ])

    generator.options.githubActions = answers.features.includes("github-actions")

    return {
      ...answers,
      folder,
    }
  },
  answersToTemplateValues: (generator, answers) => ({
    folder: answers.folder,
    name: toTemplateString(answers.name),
    scope: toTemplateString(answers.scope),
    packageName: answers.scope ? `@${answers.scope}/generator-${answers.name}` : `generator-${answers.name}`,
    description: answers.description,
    generatorName: answers.scope ? `@${answers.scope}/${answers.name}` : `${answers.name}`,
  }),
}

export default generator
