export default {
  async fetch(request, env) {
    return await handleRequest(request)
  }
}

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.indexOf('.') >= 0) {
    return new Response("400 Bad Request.", {
      status: 400,
    });
  }

  const b23 = 'https://b23.tv' + pathname;

  const paramsToReserve = [
    'p', 'page', 't', 'itemsId', 'tab', 'topic_id', 'vote_id'
  ];

  let returned;

  await fetch(b23, {
    redirect: "manual",
  })
    .then((response) => {
      let headers = new Headers(response.headers);
      let s = headers.get('Location');
      if (s) {
        let url = new URL(s);
        let strippedUrl = new URL(url.origin + url.pathname);
        for (const k of paramsToReserve) {
          let v = url.searchParams.get(k);
          if (v) {
            strippedUrl.searchParams.append(k, v);
          }
        }
        returned = new Response(`<a href="${s}">Found.</a>`, {
          status: 302,
          headers: {
            'Content-Type': 'application/html; charset=utf-8',
            'Location': strippedUrl.toString(),
          },
        });
      } else {
        returned = new Response("400 Bad Request.", {
          status: 400,
        });
      }
    });

  return returned;
}
