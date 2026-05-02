import { statusCodes } from "../registry/status-code.registry.js";
import { sendResponse } from "../utils/response.js";

export const validateApiKey = (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (key !== process.env.API_KEY) {
    return sendResponse(res, statusCodes.FORBIDDEN, "error", "Invalid key");
  }
  next();
};
