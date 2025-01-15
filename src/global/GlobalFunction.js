import axios from "axios";
// import { TOKEN } from "../global/Constant";

const apiFunctions = {
  GET_REQUEST: async function (url, request) {
    const token = localStorage.getItem("token");
    // const token = TOKEN;
    // let config = null;
    // if (token !== null && token !== undefined) {
     let config = {
        cancelToken: request?.token,
        headers: {
          "Content-type": "application/json",
          "Cache-Control": "no-cache",
          // "Content-type": "application/x-www-form-urlencoded",
          // Authorization: `Bearer ${token}`,
        },
      };
    // }
    const data = await axios
      .get(url, config)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });
    return data;
  },

  GET_REQUEST_BY_ID: async function (url, request) {
    //const token = TOKEN;

    const token = localStorage.getItem("token");
    let config = null;
    if (token !== null && token !== undefined) {
      config = {
        // cancelToken: request.token,
        headers: {
          "Content-type": "application/json",
          // "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      };
    }
    const data = await axios
      .get(url, config)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return data;
  },

  POST_REQUEST: async function (url, formData, isTrue) {
    const token = localStorage.getItem("token");
    //const token = TOKEN;

    let config = null;
    if (token !== null && token !== undefined) {
      if (isTrue) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
      } else
        config = {
          headers: {
            "Content-type": "application/json",
            // "Content-type": "application/x-www-form-urlencoded",

            Authorization: `Bearer ${token}`,
          },
        };
    }

    const data = await axios
      .post(url, formData, config)
      .then((res) => {
        // console.log(res);
        return res;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });

    // console.log(data);
    return data;
  },

  DELETE_REQUEST: async function (url) {
    const token = localStorage.getItem("token");
    let config = null;
    if (token !== null && token !== undefined) {
      config = {
        headers: {
          "Content-type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      };
    }
    const data = await axios
      .delete(url, config)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });

    return data;
  },

  PUT_REQUEST: async function (url, formData) {
    const token = localStorage.getItem("token");
    //const token = TOKEN;

    let config = null;
    if (token !== null && token !== undefined) {
      config = {
        headers: {
          "Content-type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      };
    }
    const data = await axios
      .put(url, formData, config)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });

    return data;
  },
};
export default apiFunctions;
