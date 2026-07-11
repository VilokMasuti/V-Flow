import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value?: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const cleanParams = params.split("#")[0]; // safety strip
  const queryString = qs.parse(cleanParams);

  // Passing null, undefined, or an empty string should remove the key entirely.
  if (!value) {
    delete queryString[key];
  } else {
    queryString[key] = value;
  }

  const baseUrl = qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipEmptyString: true, skipNull: true }
  );

  return `${baseUrl}${window.location.hash}`;
};

export const removeKeysFromUrlQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  const baseUrl = qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  );

  return `${baseUrl}${window.location.hash}`;
};
