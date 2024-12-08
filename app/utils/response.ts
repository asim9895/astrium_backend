/* eslint-disable @typescript-eslint/no-explicit-any */
export const SuccessResponse = (
  statusCode: number,
  message: string,
  body?: any,
) => {
  return {
    statusCode,
    message,
    body,
  };
};

export const ErrorResponse = (
  statusCode: number,
  message: string,
  body?: any,
) => {
  return {
    statusCode,
    errors: [{ msg: message }],
    body: body,
  };
};

export const InputErrorResponse = (statusCode: number, errors: any) => {
  return {
    statusCode,
    errors,
  };
};
