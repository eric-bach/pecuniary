import { Construct } from 'constructs';
import { AppsyncFunction, FunctionRuntime, InlineCode, Resolver } from 'aws-cdk-lib/aws-appsync';
import { AppsyncResolverProps } from '../types/PecuniaryStackProps';

export class AppsyncResolver extends Construct {
  public function: AppsyncFunction;
  public resolver: Resolver;

  constructor(scope: Construct, id: string, props: AppsyncResolverProps) {
    super(scope, id);

    this.function = new AppsyncFunction(scope, `${props.name}Function`, {
      name: props.name,
      api: props.api,
      dataSource: props.dataSource,
      code: props.function.code,
      runtime: FunctionRuntime.JS_1_0_0,
    });

    const passthrough = InlineCode.fromInline(`
        // The before step
        export function request(...args) {
            console.log("📢 Pipeline Request: ", args);
            return {}
        }

        // The after step
        export function response(ctx) {
            console.log("✅ Pipeline Response: ", ctx.prev.result);
            return ctx.prev.result
        }
    `);

    if (!props.resolver) return;

    this.resolver = new Resolver(scope, `${props.name}Resolver`, {
      api: props.api,
      typeName: props.resolver.typeName,
      fieldName: props.name,
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [...(props.resolver.pipelineConfig?.pre ?? []), this.function, ...(props.resolver.pipelineConfig?.post ?? [])],
      code: passthrough,
    });
  }
}
