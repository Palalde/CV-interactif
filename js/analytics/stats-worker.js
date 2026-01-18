// importer stats-processor
import { StatsProcessor } from "./stats-processor.js";
// thread séparé pour le traitement des stats

// Écouter les messages du main thread
self.onmessage = async function (event) {
  const competences = event.data;

  const processor = new StatsProcessor(competences);
  const report = await processor.generateFullReport();

  self.postMessage(report);
};
