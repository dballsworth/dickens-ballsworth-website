import { schedule } from '@netlify/functions';

// Run daily at 6 AM UTC (2 AM EST)
const handler = schedule('0 6 * * *', async () => {
  const { NETLIFY_BUILD_HOOK } = process.env;

  if (!NETLIFY_BUILD_HOOK) {
    console.error('NETLIFY_BUILD_HOOK not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Build hook not configured' })
    };
  }

  try {
    const response = await fetch(NETLIFY_BUILD_HOOK, {
      method: 'POST'
    });

    if (response.ok) {
      console.log('Rebuild triggered successfully');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Rebuild triggered' })
      };
    } else {
      throw new Error(`Build hook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error triggering rebuild:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
    };
  }
});

export { handler };
