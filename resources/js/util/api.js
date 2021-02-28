import store from "../state/store";

const Api = {
    token: null,
    getConfig: function () {
        if (store.getState().user?.info?.access_token)
            this.token = store.getState().user?.info?.access_token;
        return {
            ...(this.token !== null
                ? {
                      headers: {
                          Authorization: `Bearer ${this.token}`,
                          "Content-Type": "application/json",
                          Accept: "application/json",
                      },
                      cancelToken: new axios.CancelToken(function executor(c) {
                          let url = window.location.pathname;
                          Api.onCancel = c;
                      }),
                  }
                : {}),
        };
    },
    cancelRequest: function () {
        if (typeof this.onCancel === "function") this.onCancel();
    },
    removeCancelToken: function () {
        if (this.onCancel) delete this.onCancel;
    },
    get: (endpoint) => {
        return axios
            .get(endpoint, Api.getConfig())
            .then((resp) => resp)
            .then((resp) => resp)
            .catch((error) => {
                if (error.response) {
                    return error.response.data;
                } else if (error.request) {
                    return error.request;
                } else {
                    return error.message;
                }
            });
    },
    getPromise: (endpoint) => {
        return axios.get(endpoint, Api.getConfig());
    },
    post: (endpoint, data) => {
        return axios
            .post(endpoint, data, Api.getConfig())
            .then((resp) => resp)
            .catch((error) => {
                if (error.response) {
                    return error.response.data;
                } else if (error.request) {
                    return error.request;
                } else {
                    return error.message;
                }
            });
    },
    delete: (endpoint, data) => {
        return axios
            .delete(endpoint, Api.getConfig(), data)
            .then((resp) => resp)
            .catch((error) => {
                if (error.response) {
                    return error.response.data;
                } else if (error.request) {
                    return error.request;
                } else {
                    return error.message;
                }
            });
    },
};

export function hasErrors(
    fetchResponse = {},
    callback = (errorMessage) => {},
    displayUnknownError = true
) {
    const { errors, message, error } = fetchResponse;
    const options = {
        variant: "error",
    };
    if (errors) {
        Object.keys(errors).map((key) => {
            if (errors[key]?.map) {
                if (typeof errors[key][0] === "string")
                    callback(errors[key][0], options);
            }
        });
    } else if (message) {
        if (typeof message === "string") callback(message, options);
    } else if (typeof fetchResponse === "string") {
        callback(fetchResponse, options);
    } else if (error) {
        switch (typeof error) {
            case "object":
                Object.keys(error).map((key) => {
                    if (error[key]?.map) {
                        if (typeof error[key][0] === "string")
                            callback(error[key][0], options);
                    } else if (typeof error[key] === "string") {
                        callback(error[key], options);
                    }
                });
                break;
            case "string":
                callback(error, options);
                break;
        }
    } else if (displayUnknownError) {
        callback("Something went wrong. Please try again.", options);
    }
}

export default Api;
