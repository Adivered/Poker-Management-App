// ApiRequest.js
import PropTypes from "prop-types";
import { REACT_APP_SERVER } from "@env";

/**
 * Makes a server request and executes a callback function on the server response.
 *
 * @param {string} path - Server API path.
 * @param {string} method - Request method.
 * @param {string} accessToken - JWT accessToken for server authorization.
 * @param {Function} callback - Callback function to handle the response.
 * @param {Object} options - Optional parameters.
 * @param {Object} options.payload - Payload to put in the request body.
 * @param {Array} options.successCodes - Array of accepted codes for running callback on response.
 * @param {string} options.errorMsgTitle - Error message title to be displayed on failure.
 */
const makeApiRequest = (path, method, accessToken, callback, options = {}) => {
  const {
    payload = {},
    successCodes = [200, 201],
    errorMsgTitle = "Error fetching data",
  } = options;

  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      // JWT Authentication
      Authorization: `Bearer ${accessToken}`,
    },
  };

  if (method !== "GET" && method !== "HEAD") {
    requestOptions.body = JSON.stringify(payload);
  }

  fetch(`${REACT_APP_SERVER}/${path}`, requestOptions)
    .then((response) => {
      // Check if the response status is in the list of success codes
      if (successCodes.includes(response.status)) {
        response.json().then((data) => {
          callback(data);
        });
      } else {
        response.json().then((responseData) => {
          console.error("Error:", errorMsgTitle, responseData.msg);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", errorMsgTitle, error.msg || error);
    });
};

makeApiRequest.propTypes = {
  path: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  options: PropTypes.shape({
    payload: PropTypes.object,
    successCodes: PropTypes.arrayOf(PropTypes.number),
    errorMsgTitle: PropTypes.string,
  }),
};

export default makeApiRequest;
