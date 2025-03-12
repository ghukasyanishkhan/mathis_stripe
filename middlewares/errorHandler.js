// errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      success: false,
      message,
      // Optionally include the stack trace in development mode
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  
  export default errorHandler;
  