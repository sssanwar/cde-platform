import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { CdeStack } from '../src/main'

it('builds template', () => {
  const app = new App()
  const stack = new CdeStack(app, 'test')
  const template = Template.fromStack(stack)

  expect(template).toEqual({
    template: {
      Mappings: expect.anything(),
      Outputs: expect.anything(),
      Resources: expect.anything(),
      Parameters: expect.anything(),
      Rules: expect.anything(),
    },
  })
})
