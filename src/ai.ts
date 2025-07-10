export async function getParsedReminder(todoText: string) {
  // const myHeaders = new Headers();
  // myHeaders.append('Content-Type', 'application/json');
  // myHeaders.append('X-goog-api-key', 'AIzaSyChPO2LsRWdTbg7Sq_dsGz5GZxs2m9DBMc');

  // const raw = JSON.stringify({
  //   contents: [
  //     {
  //       parts: [
  //         {
  //           text: 'Convert this to JSON with "text" and "dueDate" (ISO 8601 or null if not specified). DO not give an explanation, just correct JSON that is parseable: Remind me to check logs at 5pm today'
  //         }
  //       ]
  //     }
  //   ]
  // });

  // const requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw,
  //   redirect: 'follow'
  // };

  // fetch(
  //   'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  //   requestOptions
  // )
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));

  const finalPrompt = `
    You are a reminder parser.

    Convert natural language reminders into structured JSON with the following format:
    {
      "text": string,               // What the reminder is about
      "dueDate": ISO 8601 string    // UTC date and time for the reminder
    }

    The "dueDate" must be in ISO 8601 format (e.g. "2025-07-10T17:00:00Z").

    If the input does not include a time or date, return "dueDate": null.

    DO not give an explanation, just correct JSON that is parseable. Remove the \`json\` tag from the output.Respond only with JSON

    Now parse this:

    "${todoText}"
  `;

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': 'AIzaSyChPO2LsRWdTbg7Sq_dsGz5GZxs2m9DBMc'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }]
      })
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to parse reminder: ${res.statusText}`);
  }
  const data = await res.json();
  const content = data.candidates?.[0]?.content.parts?.[0]?.text;
  if (!content) {
    throw new Error('No content returned from AI');
  }
  try {
    const parsed = extractJsonFromGemini(content);
    if (typeof parsed.text !== 'string' || (parsed.dueDate && typeof parsed.dueDate !== 'string')) {
      throw new Error('Parsed content is not in the expected format');
    }
    return parsed as {
      text: string;
      dueDate?: string;
    };
  } catch (error) {
    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function extractJsonFromGemini(raw: string): any {
  // Remove code block markers if present
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse Gemini response:', e);
    throw new Error('Invalid JSON from Gemini');
  }
}
