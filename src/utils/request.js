export const request = (url, options) => {
  return fetch(url, options).then(checkStatus).then(parseJSON);
};

export const post = (url, options = {}, data = {}) => {
  options.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  options.body = JSON.stringify(data);
  if (!options.method) options.method = 'POST';
  return request(url, options);
};

export const put = (url, options = {}, data = {}) => {
  options.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  options.body = JSON.stringify(data);
  if (!options.method) options.method = 'put';
  return request(url, options);
};

const parseJSON = async response => await response.json();

const checkStatus = response => {
  if ((response.status >= 200 && response.status < 300) || (response.status >= 400 && response.status < 500)) return response;

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

export const objectToFormData = (obj, form, namespace) => {
  let fd = form || new FormData();
  let formKey;
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }
      // if the property is an object, but not a File,
      // use recursivity.
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, formKey);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};
