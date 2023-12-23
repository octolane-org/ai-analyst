import { configuration } from "@/constants/configs";
import Metaphor from "metaphor-node";

const metaphor = new Metaphor(configuration.metaphoreApiKey as string);

/**
 * Analyzes a company by searching for the top 10 new articles related to the company's domain using the Metaphor API.
 * It then retrieves the contents of these articles and returns the extracted content.
 *
 * @param {string} companyDomain - The domain of the company to analyze.
 * @returns A promise that resolves to an array of extracted content from the top articles related to the company's domain.
 * @throws {Error} - Throws an error if the Metaphor API call fails.
 *
 * @example
 * const contents = await analyzeCompanyWithMetaPhore('example.com')
 */
export const analyzeCompanyWithMetaPhore = async (companyDomain: string) => {
  const response = await metaphor.search(
    `Find top 10 new article ${companyDomain}`,
    {
      numResults: 5,
    },
  );

  const contentResponse = await metaphor.getContents(
    response.results.map(result => result.id),
  );

  return contentResponse.contents.map(content => content.extract);
};
