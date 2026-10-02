export const errorHandler = (err, _req, res, _next) => {
  console.error('[Error Handler]', err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Internal Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
