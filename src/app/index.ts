import path from "node:path"
import Generator, { type BaseOptions } from "yeoman-generator"
import { isKebabCase, randomString } from "./helpers"
import app, { type AnswersGenerator, type TemplateValuesGenerator } from "./questions/generator"

export interface GeneratorOptions {
  folder: string
  scope: string
}

type Answers = AnswersGenerator
type TemplateValues = TemplateValuesGenerator & {
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
    if (!isKebabCase(this.options.folder)) {
      throw new Error("Folder is not valid (should be kebab-case)")
    }
  }

  async prompting() {
    const answersGenerator = await app.questions(this)

    this.answers = {
      ...answersGenerator,
    }

    this.templateValues = {
      ...app.answersToTemplateValues(this, answersGenerator),
      randomString,
    }
  }

  async writing() {
    console.log(this.templateValues)

    this.fs.copyTpl(this.templatePath("generator/**/*"), this.destinationPath(this.answers.folder), this.templateValues)
    this.fs.copyTpl(this.templatePath("generator/.*"), this.destinationPath(this.answers.folder), this.templateValues)

    // this.fs.copy(
    //   this.destinationPath(this.answers.folder, ".env.example"),
    //   this.destinationPath(this.answers.folder, ".env"),
    // )

    // if (this.answers.postgres) {
    //   this.fs.copyTpl(
    //     this.templatePath("postgres/**/*"),
    //     this.destinationPath(this.answers.folder),
    //     this.templateValues,
    //   )
    // }
  }

  async install() {
    this.spawnSync("bun", ["install"], { cwd: this.destinationPath(this.answers.folder) })
    this.spawnSync("bun", ["lint", "--write"], { cwd: this.destinationPath(this.answers.folder) })
    this.spawnSync("bun", ["format", "--write"], { cwd: this.destinationPath(this.answers.folder) })
  }
}
