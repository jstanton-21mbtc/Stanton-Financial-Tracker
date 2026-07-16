exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let path, apiKey;
  try {
    const body = JSON.parse(event.body || '{}');
    path   = body.path;
    apiKey = body.apiKey;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!path || !apiKey) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path or apiKey' }) };
  }

  const url = 'https://api.foreman.mn' + path;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy fetch failed: ' + err.message })
    };
  }
};
