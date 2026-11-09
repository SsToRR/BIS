'use strict';

const { handleApi } = require('../server');

module.exports = (request, response) => {
  const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const routedPath = request.query?.path ?? url.searchParams.get('path');

  if (routedPath) {
    const segments = (Array.isArray(routedPath) ? routedPath : [routedPath])
      .join('/')
      .split('/')
      .filter(Boolean);
    url.pathname = `/api/${segments.join('/')}`;
    url.searchParams.delete('path');
    request.url = `${url.pathname}${url.search}`;
  }

  return handleApi(request, response);
};
