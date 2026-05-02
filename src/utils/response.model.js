/**
 * format response object
 * @author Akhil E M
 * @createdAt 11-11-2022
 * @updates 11-11-2022(Akhil EM),
 * @type function
 * @param {string} status
 * @param {number} code
 * @param {boolean} statusKey
 * @param {string} message
 * @param {object} data
 * @returns {object}
 */
export const response = (
  status = "success",
  message = "OK",
  data = {},
  meta = {},
) => ({
  status,
  message,
  data: data.data ? data.data : data,
  meta: data.meta ? data.meta : meta,
});
