import {
  TypeScriptCompilerOptions,
  TypeScriptJsxMode,
  TypeScriptModuleDetection,
  TypeScriptModuleResolution,
} from 'projen/lib/javascript'
import { TypeScriptProject } from 'projen/lib/typescript'

const compilerOptions: TypeScriptCompilerOptions = {
  target: 'ES2022',
  lib: ['ES2023', 'DOM', 'DOM.Iterable'],
  module: 'ESNext',
  skipLibCheck: true,

  /* Bundler mode */
  moduleResolution: TypeScriptModuleResolution.BUNDLER,
  allowImportingTsExtensions: true,
  isolatedModules: true,
  moduleDetection: TypeScriptModuleDetection.FORCE,
  noEmit: true,
  jsx: TypeScriptJsxMode.REACT_JSX,
  types: ['jest', 'node', 'react', 'react-dom'],
}

export const configureWeb = (project: TypeScriptProject) => {
  project.compileTask.updateStep(0, { exec: 'npx vite build' })
  project.addTask('dev', { exec: 'npx vite' })
  project.addFields({ type: 'module' })

  project.tsconfig?.addInclude('src/**/*.tsx')
  project.tsconfig?.addInclude('test/**/*.tsx')

  project.tsconfigDev.addInclude('src/**/*.tsx')
  project.tsconfigDev.addInclude('test/**/*.tsx')
  project.tsconfigDev.addInclude('vite.config.ts')

  Object.assign(project.tsconfigDev.compilerOptions ?? {}, compilerOptions)
  Object.assign(project.tsconfig?.compilerOptions ?? {}, compilerOptions)

  return project
}
