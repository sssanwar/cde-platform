import { Cors, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { EndpointType } from 'aws-cdk-lib/aws-apigatewayv2'
import { Construct } from 'constructs'
import { CustomerHandler } from './handlers/customers'

export interface CdeApiProps {
  stackName: string
}

export class CdeApi extends Construct {
  api: RestApi

  constructor(scope: Construct, props: CdeApiProps) {
    super(scope, 'cde-api')

    this.api = new RestApi(this, 'rest-api', {
      restApiName: `${props.stackName}-rest-api`,
      endpointConfiguration: {
        types: [EndpointType.REGIONAL],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    })

    const v1Resource = this.api.root.addResource('v1')
    new CustomerHandler(this, { v1Resource })
  }
}
