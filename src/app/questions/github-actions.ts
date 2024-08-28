import type { GeneratorOptions } from "../"
import type { YoTemplate } from "../types"

export interface AnswersGithubActions {
  githubActions: boolean
  githubActionsToken: string
}

export interface TemplateValuesGithubActions {
  githubActions: boolean
  githubActionsToken: string
}

const githubActions: YoTemplate<GeneratorOptions, AnswersGithubActions, TemplateValuesGithubActions> = {
  questions: async (generator) => {
    const answers = await generator.prompt<AnswersGithubActions>([
      {
        when: () => generator.options.githubActions,
        type: "input",
        name: "githubActionsToken",
        message: "GitHub token NAME that has write access to the repository for updating the release version",
        default: "FLOWCORE_MACHINE_GITHUB_TOKEN",
      },
    ])

    return {
      ...answers,
      githubActions: answers.githubActions ?? generator.options.githubActions,
    }
  },
  answersToTemplateValues: (generator, answers) => ({
    githubActions: generator.options.githubActions,
    githubActionsToken: answers.githubActionsToken,
  }),
}

export default githubActions
