async function websearch(domain: string) {
  const apiKey = process.env.YOU_API;
  if (!apiKey) {
    throw new Error("YOU_API is not defined");
  }
  const headers = { "X-API-Key": apiKey };
  const params = new URLSearchParams({ domain: domain }).toString();

  const options = {
    method: "GET",
    headers: headers,
  };

  try {
    const response = await fetch(
      `https://api.ydc-index.io/search?${params}`,
      options,
    );
    if (response.status === 200) {
      return response.json();
    } else {
      return { error: "Request failed with status code " + response.status };
    }
  } catch (error) {
    console.error(error);
  }
}

function extractInformation(jsonData: any) {
  const extractedData: any[] = [];
  if ("hits" in jsonData) {
    for (const hit of jsonData["hits"]) {
      const title = hit["title"] || "No Title";
      const url = hit["url"] || "No URL";
      const snippets = hit["snippets"] || [];
      extractedData.push({ title: title, url: url, snippets: snippets });
    }
  }
  return extractedData;
}

export const getCompanyReport = async (domain: string) => {
  const results = await websearch(domain);
  if (!results) {
    throw new Error("Websearch returned no results");
  }
  const extractedInfo = extractInformation(results);

  let report = "";
  for (const info of extractedInfo) {
    report += `Title: ${info["title"]}\n`;
    report += `URL: ${info["url"]}\n`;
    report += "Snippets:\n";
    for (const snippet of info["snippets"]) {
      report += `- ${snippet}\n`;
    }
    report += "\n";
  }

  return report;
};
