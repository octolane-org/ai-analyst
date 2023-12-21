import { configuration } from "@/constants/configs";
import Metaphor from "metaphor-node";

const metaphor = new Metaphor(configuration.metaphoreApiKey as string);

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
