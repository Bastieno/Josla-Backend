const handleResponse = (response, responseJson, statusCode, message) => {
  response.status(statusCode).json({
    data: responseJson,
    status: statusCode,
    message,
  });
};

export default handleResponse;
