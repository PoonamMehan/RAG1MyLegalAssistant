import { Mistral } from "@mistralai/mistralai";




export const mistralChatCompletion = async (msgs)=>{
    const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});
    try{
        const resultStream = await client.chat.stream({
            model: "mistral-small-latest",
            messages: msgs,
        });
    
        return resultStream; 
    }catch(err){
        console.log("Something went wrong while generating response from Mistral AI.")
        throw err;
    }
}
 // for   await (const chunk of result) {
    //     const streamText = chunk.data.choices[0].delta.content;
    //     process.stdout.write(streamText);
    // }

export const createEmbeddingMistral = async (msg) => {
    try{
        const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

        const msgEmbedding = await client.embeddings.create({
            model:"mistral-embed",
            inputs: msg,
    })
    
        return msgEmbedding;

    }catch(err){

        console.log("Something went wrong while generating response from Mistral AI.")
        throw err;
        
    }
}