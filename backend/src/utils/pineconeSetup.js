import { Pinecone } from '@pinecone-database/pinecone';
import { lawsDataSet } from '../dataset.js';

export const pineconeSetup = async () => {
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const indexName = 'rag1-my-legal-assistant';

// const pcIndex = await pc.createIndex({
//   name: indexName,
//   dimension: 1024, 
//   metric: 'cosine', 
//   spec: { 
//     serverless: { 
//       cloud: 'aws', 
//       region: 'us-east-1' 
//     }
//   } 
// });

const model = 'multilingual-e5-large';

const embeddings = await pc.inference.embed(
    model,
    lawsDataSet.map(d => d.example),
    { inputType: 'passage', truncate: 'END' }
);

let embeddedRecord=[];
lawsDataSet.map( (d, idx) => {embeddedRecord.push({id: String(idx), values: embeddings[idx].values, metadata: {"date_of_creation": d.date_of_creation, "law": d.law}})})

const index = pc.index("rag1-my-legal-assistant", "https://rag1-my-legal-assistant-dejxwt3.svc.aped-4627-b74a.pinecone.io")

await index.upsert(embeddedRecord)

}