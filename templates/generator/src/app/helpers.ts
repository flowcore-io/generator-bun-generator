import crypto from "node:crypto"

export interface TemplateString {
  value: string
  kebabCase: string
  snakeCase: string
  pascalCase: string
  camelCase: string
  capitalized: string
}

// Formatters

export function toKebabCase(str: string): string {
  return str.replace(/[\s\._-]+/g, "-").toLowerCase()
}

export function kebabCaseToSnakeCase(str: string): string {
  return str.replace(/-/g, "_")
}

export function kebabCaseToCapitalized(str: string): string {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export function kebabCaseToPascalCase(str: string): string {
  return kebabCaseToCapitalized(str).replace(/\s/g, "")
}

export function kebabCaseToCamelCase(str: string): string {
  return kebabCaseToPascalCase(str).replace(/\b\w/g, (char) => char.toLowerCase())
}

// Validators

export function isKebabCase(str: string): boolean {
  return /^(?!-)(?!\d)(?!.*--)[a-z0-9]+(-[a-z0-9]+)*$/.test(str)
}

export function validate(name: string, validateMethod: (input: string) => boolean, optional = false) {
  return (input: string) => {
    if (!input && optional) {
      return true
    }
    if (!input) {
      return `${name} is required`
    }
    if (!validateMethod(input)) {
      return `${name} is invalid: (${input})`
    }
    return true
  }
}

export function isValidFlowcoreName(input: string) {
  return /^[a-z0-9-.]+$/.test(input)
}

export function isValidNpmName(name: string): boolean {
  return /^((@[a-z0-9-]+)\/)?([a-z0-9-]+)$/.test(name)
}

export function removeNumberSuffix(str: string): string {
  return str.replace(/\.\d+$/, "")
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString("hex").slice(0, length)
}

export function toTemplateString(str?: string): TemplateString {
  if (!str) {
    return {
      value: "",
      kebabCase: "",
      snakeCase: "",
      pascalCase: "",
      camelCase: "",
      capitalized: "",
    }
  }
  const kebabCase = toKebabCase(removeNumberSuffix(str))
  const snakeCase = kebabCaseToSnakeCase(kebabCase)
  const pascalCase = kebabCaseToPascalCase(kebabCase)
  const camelCase = kebabCaseToCamelCase(kebabCase)
  const capitalized = kebabCaseToCapitalized(kebabCase)
  return {
    value: str,
    kebabCase,
    snakeCase,
    pascalCase,
    camelCase,
    capitalized,
  }
}
