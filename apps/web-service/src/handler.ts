import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

export const hello: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context) => {
  
  console.log(event.queryStringParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello with Types!",
    }),
  };
};