import path from "node:path"
import Generator, { type BaseOptions } from "yeoman-generator"
import { isKebabCase, randomString } from "./helpers"
import generator, { type AnswersGenerator, type TemplateValuesGenerator } from "./questions/generator"
import type { AnswersGithubActions, TemplateValuesGithubActions } from "./questions/github-actions"
import githubActions from "./questions/github-actions"

export interface GeneratorOptions {
  folder: string
  scope: string
  githubActions: boolean
}

type Answers = AnswersGenerator & AnswersGithubActions
type TemplateValues = TemplateValuesGenerator &
  TemplateValuesGithubActions & {
    randomString: (length: number) => string
  }

export default class GeneratorGenerator extends Generator<BaseOptions & GeneratorOptions> {
  private answers: Answers
  private templateValues: TemplateValues

  constructor(args, opts) {
    super(args, opts)
    const sourceRoot = path.join(this.sourceRoot(), "../../../templates")
    this.sourceRoot(sourceRoot)
    this.argument("folder", { type: String, required: true })
    this.option("scope", { type: String, required: false })
    this.option("github-actions", { type: Boolean, required: false, default: false })
    if (!isKebabCase(this.options.folder)) {
      throw new Error("Folder is not valid (should be kebab-case)")
    }
  }

  async prompting() {
    const answersGenerator = await generator.questions(this)
    const answersGithubActions = await githubActions.questions(this)

    this.answers = {
      ...answersGenerator,
      ...answersGithubActions,
    }

    this.templateValues = {
      ...generator.answersToTemplateValues(this, answersGenerator),
      ...githubActions.answersToTemplateValues(this, answersGithubActions),
      randomString,
    }
  }

  async writing() {
    this.fs.copyTpl(this.templatePath("generator/**/*"), this.destinationPath(this.answers.folder), this.templateValues)
    this.fs.copyTpl(this.templatePath("generator/.*"), this.destinationPath(this.answers.folder), this.templateValues)

    if (this.answers.githubActions) {
      this.fs.copyTpl(
        this.templatePath("github-actions/.github/**/*"),
        this.destinationPath(this.answers.folder, ".github"),
        this.templateValues,
      )
    }
  }

  async install() {
    this.spawnSync("bun", ["install"], { cwd: this.destinationPath(this.answers.folder) })
    this.spawnSync("bun", ["lint", "--write"], { cwd: this.destinationPath(this.answers.folder) })
    this.spawnSync("bun", ["format", "--write"], { cwd: this.destinationPath(this.answers.folder) })
  }
}
