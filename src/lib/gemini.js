/**
 * Client-side proxy for the Vercel Backend.
 * All AI generation is now handled securely on the server.
 */

export async function generateIdeaMap(phrase) {
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'generate',
      payload: { phrase }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate idea map');
  }

  return response.json();
}

export async function fetchTopicDescription(topic, mainPhrase) {
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'describe',
      payload: { topic, mainPhrase }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to explain topic');
  }

  return response.json();
}

export async function fetchTopicScript(topic, mainPhrase) {
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'script',
      payload: { topic, mainPhrase }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate script');
  }

  return response.json();
}
