import type { BaseOptions } from "yeoman-generator"
import type Generator from "yeoman-generator"

export interface YoTemplate<Options, Answers, TemplateValues> {
  questions: (generator: Generator<BaseOptions & Options>) => Promise<Answers>
  answersToTemplateValues: (generator: Generator<BaseOptions & Options>, answers: Answers) => TemplateValues
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
