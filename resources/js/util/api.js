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

export default Api;
