import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, NodejsFunctionProps, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

export interface BaseNodeFunctionProps extends NodejsFunctionProps {}

export class BaseNodeFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props: BaseNodeFunctionProps) {
    const functionName = `cde-${id}`

    super(scope, id, {
      ...props,
      functionName,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(28),
      logRetention: logs.RetentionDays.TWO_WEEKS,
      memorySize: props.memorySize || 256,
      bundling: {
        minify: true,
        format: OutputFormat.ESM,
      },
    })
  }
}
