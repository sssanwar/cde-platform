import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib'
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'

export interface CdeWebProps {
  stackName: string
}

export class CdeWeb extends Construct {
  readonly assetsBucket: Bucket

  constructor(scope: Construct, props: CdeWebProps) {
    super(scope, `${props.stackName}-web`)

    this.assetsBucket = new Bucket(this, 'web-assets', {
      bucketName: `${props.stackName}-assets`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    })

    const distribution = new Distribution(this, 'distribution', {
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        origin: new S3StaticWebsiteOrigin(this.assetsBucket),
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    })

    new BucketDeployment(this, 'assets-deployment', {
      sources: [Source.asset('../web/dist')],
      destinationBucket: this.assetsBucket,
      distribution,
      distributionPaths: ['/*'],
      retainOnDelete: false,
    })

    new CfnOutput(this, 'distribution-out', {
      exportName: `${props.stackName}-distribution-name`,
      value: distribution.distributionDomainName,
    })
  }
}
