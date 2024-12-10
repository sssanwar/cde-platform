import { LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, NodejsFunctionProps, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

export interface CustomerHandlerProps extends NodejsFunctionProps {
  readonly v1Resource: Resource
}

export class CustomerHandler extends Construct {
  constructor(scope: Construct, props: CustomerHandlerProps) {
    super(scope, 'cde-customer')

    const lambda = new NodejsFunction(this, 'cde-customer-handler', {
      ...props,
      description: 'API handler lambda',
      entry: 'src/handlers/customers/handler.ts',
      runtime: Runtime.NODEJS_22_X,
      memorySize: 256,
      bundling: { minify: true, format: OutputFormat.ESM, sourceMap: false },
    })

    const customerResource = props.v1Resource.addResource('customers')
    customerResource.addMethod('GET', new LambdaIntegration(lambda))
  }
}
