import { Pinecone } from '@pinecone-database/pinecone';
import { lawsDataSet } from '../dataset.js';
import asyncHandler from './asyncHandler.js';
import { createEmbeddingMistral } from './mistral.js';

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

// const model = 'multilingual-e5-large';

// const embeddings = await pc.inference.embed(
//     model,
//     lawsDataSet.map(d => d.example),
//     { inputType: 'passage', truncate: 'END' }
// );


const model = 'mistral-embed';
const embeddings = await createEmbeddingMistral(lawsDataSet.map(d => d.example))
console.log("Embeddings from mistral of the dataset:", embeddings)


let embeddedRecord=[];
lawsDataSet.map( (d, idx) => {embeddedRecord.push({id: String(idx), values: embeddings.data[idx].embedding, metadata: {"date_of_creation": d.date_of_creation, "law": d.law}})})

const index = pc.index("rag1-my-legal-assistant", "https://rag1-my-legal-assistant-dejxwt3.svc.aped-4627-b74a.pinecone.io")

await index.upsert(embeddedRecord)

}


export const queryPinecone = async (embeddedUserQuery)=>{
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
    const index = pc.index("rag1-my-legal-assistant", "https://rag1-my-legal-assistant-dejxwt3.svc.aped-4627-b74a.pinecone.io")
    const results = await index.query({
        topK: 2,
        includeMetadata: true,
        vector: embeddedUserQuery,
    })
    
    return results;
}