import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CdeApi } from './cde-api'
import { CdeWeb } from './cde-web'

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

export class CdeStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props)
    new CdeApi(this, { stackName: this.stackName })
    new CdeWeb(this, { stackName: this.stackName })
  }
}

const app = new App()

new CdeStack(app, 'cde-platform', { env, description: 'CDE platform demo' })

app.synth()
