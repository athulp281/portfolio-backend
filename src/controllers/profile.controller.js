import { SocialData, PersonalData } from "../data/PersonalData.js";
import { statusCodes } from "../registry/status-code.registry.js";
import { sendResponse } from "../utils/response.js";

export const getPersonalData = async (req, res) => {
  return sendResponse(res, statusCodes.OK, "success", "OK", PersonalData);
};

export const getSocialData = async (req, res) => {
  return sendResponse(res, statusCodes.OK, "success", "OK", SocialData);
};
