import { awscdk, typescript } from 'projen'
import { ArrowParens, NodePackageManager } from 'projen/lib/javascript'

const baseOptions = {
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

const project = new typescript.TypeScriptProject({
  ...baseOptions,
  defaultReleaseBranch: 'main',
  name: 'cde-platform',
  projenrcTs: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
})

project.synth()
