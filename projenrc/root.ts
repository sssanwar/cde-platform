import { Job } from 'projen/lib/github/workflows-model'
import { TypeScriptProject } from 'projen/lib/typescript'
import { PnpmWorkspace } from './pnpm'

const deployOnRelease = (root: TypeScriptProject) => {
  const releaseFlow = root.github?.tryFindWorkflow('release')
  if (!releaseFlow) throw new Error('Release workflow not found')

  const job = releaseFlow.getJob('release') as Job

  // Allow ID token request for AWS IAM
  Object.assign(job.permissions, { ...job.permissions, 'id-token': 'write' })

  job.steps.push(
    {
      name: 'Configure AWS credentials',
      uses: 'aws-actions/configure-aws-credentials@v4',
      with: {
        'role-to-assume': 'arn:aws:iam::540782982890:role/GitHubActions-sssanwar',
        'role-session-name': 'github-cdk-role',
        'aws-region': 'us-west-2',
      },
    },
    {
      name: 'CDK deploy',
      run: [`pnpm run deploy`, '--progress=events'].join(' '),
      env: {
        CDK_DEFAULT_ACCOUNT: '540782982890',
        CDK_DEFAULT_REGION: 'us-west-2',
      },
    },
  )
}

export const configureRoot = (root: TypeScriptProject) => {
  new PnpmWorkspace(root)
  root.addFields({ workspaces: ['packages/*'] })
  root.compileTask.updateStep(0, { exec: 'pnpm -r build' })

  root.addTask('deploy', {
    steps: [{ exec: 'npx aws-cdk deploy cde-platform', cwd: 'packages/infra', receiveArgs: true }],
  })

  root.addTask('synth', {
    steps: [{ exec: 'npx aws-cdk synth', cwd: 'packages/infra', receiveArgs: true }],
  })

  root.packageTask.reset() // No need to package root
  deployOnRelease(root)
  return root
}
