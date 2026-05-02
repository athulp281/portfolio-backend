import { response } from "./response.model.js";

export const sendResponse = (
  res,
  statusCode,
  status,
  message,
  data = {},
  meta = {},
) => {
  return res.status(statusCode).json(response(status, message, data, meta));
};
