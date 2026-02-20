// Response Helper Functions for standardized API responses

// Success Response
const sendSuccess = (res, statusCode = 200, message = "Operation successful", data = null, meta = null) => {
  const response = {
    success: true,
    statusCode,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Error Response
const sendError = (res, statusCode = 400, message = "Something went wrong", errorCode = "ERROR", details = null) => {
  const response = {
    success: false,
    statusCode,
    message,
    error: {
      code: errorCode,
    },
  };

  if (details !== null) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
