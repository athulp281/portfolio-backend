import data from "../data/portfolio.json" with { type: "json" };
import { getEmbedding } from "./embedding.service.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

let embeddedData = [];

export const initRAG = async () => {
  console.log("🔄 Generating embeddings (one-time)...");

  for (const item of data) {
    const embedding = await getEmbedding(item.content);

    embeddedData.push({
      id: item.id,
      content: item.content,
      embedding,
    });
  }

  console.log("Embeddings:", embeddedData.length);
};

export const ragSearch = async (query) => {
  const queryEmbedding = await getEmbedding(query);

  const scored = embeddedData.map((item) => ({
    ...item,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  const topResults = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  console.log("TOP RESULTS:", topResults);

  return topResults;
};
