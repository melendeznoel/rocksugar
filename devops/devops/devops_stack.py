from aws_cdk import (
    Stack,
    aws_dynamodb as dynamodb,
    aws_lambda as _lambda,
    RemovalPolicy
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

        search_products_lambda_function = _lambda.Function(self, search_nutrition_product_lambda_function_name,
            function_name=search_nutrition_product_lambda_function_name,
            runtime=_lambda.Runtime.NODEJS_20_X,
            handler="index.handler",
            code=_lambda.Code.from_asset("../src/lambda/searchNutritionProduct/dist"),
            description="Search operation for nutrition product",
            environment={
                "PRODUCTS_TABLE_NAME": pantry_table.table_name
            }
        )

        pantry_table.grant_read_write_data(search_products_lambda_function)