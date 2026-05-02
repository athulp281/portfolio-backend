import { statusCodes } from "../registry/status-code.registry.js";
import { chatService } from "../services/chat.service.js";
import { sendResponse } from "../utils/response.js";

export const askQuestion = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return sendResponse(
        res,
        statusCodes.BAD_REQUEST,
        "error",
        "Query is required",
      );
    }
    const response = await chatService(query);
    return sendResponse(res, statusCodes.OK, "success", "OK", response);
  } catch (err) {
    next(err);
  }
};
