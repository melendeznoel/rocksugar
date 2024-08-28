from aws_cdk import (
    Stack,
    aws_dynamodb as dynamodb,
    aws_lambda as _lambda,
    RemovalPolicy,
    aws_apigatewayv2 as apiGatewayV2,
    aws_apigatewayv2_integrations as apiGatewayV2Integrations,
)
from constructs import Construct

class DevopsStack(Stack):
    # The code that defines your stack goes here
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        table_name = "pantry"

        pantry_table = dynamodb.Table(self, id=table_name, table_name=table_name,
            partition_key=dynamodb.Attribute(
                name="id",
                type=dynamodb.AttributeType.STRING
            ),
            removal_policy=RemovalPolicy.DESTROY
        )

        search_nutrition_product_lambda_function_name = "search-nutrition-product-function"

        search_nutrition_products_lambda_function = _lambda.Function(self, search_nutrition_product_lambda_function_name,
        search_nutrition_products_lambda_function = _lambda.Function(
            function_name=search_nutrition_product_lambda_function_name,
            runtime=_lambda.Runtime.NODEJS_20_X,
            handler="index.handler",
            code=_lambda.Code.from_asset("../src/lambda/searchNutritionProduct/dist"),
            description="Search operation for nutrition product",
        )

        pantry_table.grant_read_write_data(search_nutrition_products_lambda_function)

            self,
            "Pantry Api",
            api_name="Pantry HTTP API",
            description="This service serves the pantry items",
            default_authorizer=None,
        )

        search_nutrition_products_lambda_integration = apiGatewayV2Integrations.HttpLambdaIntegration("LambdaIntegration",
            handler=search_nutrition_products_lambda_function
        search_nutrition_products_lambda_integration = (
            apiGatewayV2Integrations.HttpLambdaIntegration(
                "LambdaIntegration", handler=search_nutrition_products_lambda_function
            )
        )

        http_api.add_routes(
            path="/_search",
            methods=[apiGatewayV2.HttpMethod.POST],
            integration=search_nutrition_products_lambda_integration,
        )
