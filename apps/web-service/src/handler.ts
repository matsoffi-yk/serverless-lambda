import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";

export const hello: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context,
) => {
  const requestOrigin = event.headers.origin || event.headers.Origin;
  const originEnv = process.env.ORIGIN ? JSON.parse(process.env.ORIGIN) : null; // ['http://localhost:3000', 'http://localhost:4000']
  if (!requestOrigin || (originEnv && !originEnv.includes(requestOrigin))) {
    return { statusCode: 403, body: "Forbidden: Access denied" };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "Hello with Types!",
    }),
  };
};
