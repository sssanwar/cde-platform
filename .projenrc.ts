import { awscdk, typescript } from 'projen'
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk'
import { ArrowParens, NodePackageManager, TypeScriptModuleResolution } from 'projen/lib/javascript'
import { TypeScriptProject } from 'projen/lib/typescript'
import { configureRoot } from './projenrc/root'
import { configureWeb } from './projenrc/web'

const cdkVersion = '2.172.0'

const baseOptions = {
  cdkVersion,
  minNodeVersion: '22',
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '9.15.0',
  defaultReleaseBranch: 'main',
  requireApproval: awscdk.ApprovalLevel.NEVER,
  depsUpgrade: false,
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 130,
      singleQuote: true,
      semi: false,
      arrowParens: ArrowParens.AVOID,
    },
  },
}

const root = new typescript.TypeScriptProject({
  ...baseOptions,
  defaultReleaseBranch: 'main',
  name: '@cde-platform/root',
  projenrcTs: true,
  jest: false,
  gitignore: ['.DS_Store'],
  sampleCode: false,
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert'],
      },
    },
  },
})

new TypeScriptProject({
  ...baseOptions,
  parent: root,
  name: '@cde-platform/api',
  outdir: './packages/api',
  eslint: false,
  tsconfig: {
    // This config enables ESM output
    compilerOptions: {
      module: 'ESNext',
      moduleResolution: TypeScriptModuleResolution.BUNDLER,
      target: 'ESNext',
      isolatedModules: true,
      esModuleInterop: true,
      lib: ['esnext'],
      types: ['node', 'jest'],
    },
  },
  devDeps: ['@types/lodash@^4.17.13', 'jest-mock-extended@^3.0.7'],
  deps: ['zod@^3', 'lodash@^4.17.21', '@types/aws-lambda@^8'],
})

const web = new TypeScriptProject({
  ...baseOptions,
  parent: root,
  name: '@cde-platform/web',
  outdir: './packages/web',
  eslint: false,
  jestOptions: { jestConfig: { testEnvironment: 'jsdom' } },
  devDeps: [
    '@eslint/js@^9.15.0',
    '@testing-library/dom',
    '@testing-library/jest-dom',
    '@testing-library/react@^16',
    '@testing-library/user-event',
    '@types/react-dom@^18.3.1',
    '@types/react@^18.3.12',
    '@vitejs/plugin-react-swc@^3.5.0',
    'autoprefixer',
    'eslint-plugin-react-hooks@^5.0.0',
    'eslint-plugin-react-refresh@^0.4.14',
    'globals@^15.12.0',
    'jest-environment-jsdom@^29',
    'postcss@^8',
    'tailwindcss@^3',
    'typescript@^5.7.2',
    'vite@^6',
  ],
  deps: [
    '@cde-platform/api@workspace:*',
    '@reduxjs/toolkit@^2.4.0',
    '@tanstack/react-table',
    'react-dom@^18',
    'react-redux@^9',
    'react@^18',
    'redux@^5',
  ],
})

new AwsCdkTypeScriptApp({
  ...baseOptions,
  parent: root,
  name: '@cde-platform/infra',
  outdir: './packages/infra',
  deps: ['@cde-platform/api@workspace:*'],
})

configureRoot(root)
configureWeb(web)

root.synth()
