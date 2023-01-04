export default {
  async fetch(request, env) {
    return await handleRequest(request)
  }
}

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  const b23 = 'https://b23.tv' + pathname;

  const paramsToReserve = [
    'p', 'page', 't', 'itemsId', 'tab', 'topic_id', 'vote_id'
  ];

  let strippedUrl;
  let text;

  await fetch(b23, {
    redirect: "manual",
  })
    .then((response) => {
      let headers = new Headers(response.headers);
      let url = new URL(headers.get('Location'));
      strippedUrl = new URL(url.origin + url.pathname);
      for (const k of paramsToReserve) {
        let v = url.searchParams.get(k);
        if (v) {
          strippedUrl.searchParams.append(k, v);
        }
      }
      return response.text();
    })
    .then((t) => {
      text = t;
    });

  return new Response(text, {
    status: 302,
    headers: {
      'Location': strippedUrl.toString(),
    }
  });
}
