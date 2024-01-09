const asyncHandler = (cb) => async (req, res, next) => {
  try {
    await cb(req, res, next);
  } catch (error) {
    res.status(error.code || 500);
    next(error);
  }
};

export { asyncHandler };
// const notFound = (requestHandler) => {
//   (req, res, next) => {
//     Promise.resolve(
//       requestHandler(req, res, next).catch((error) => next(error)),
//     );
//   };
// };
