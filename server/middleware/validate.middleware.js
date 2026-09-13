import { ApiError } from "../utils/apiError.js";

export function validate(validatorFn) {
  return (req, _res, next) => {
    try {
      const error = validatorFn(req);
      if (error) {
        throw ApiError.badRequest(error);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
