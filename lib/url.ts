import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const cleanParams = params.split("#")[0]; // safety strip
  const queryString = qs.parse(cleanParams);

  queryString[key] = value;

  const baseUrl = qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });

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
