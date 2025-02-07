import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});


export const mistralChatCompletion = async ()=>{
    try{
        const result = await client.chat.stream({
            model: "mistral-small-latest",
            messages: [{role: 'user', content: 'What is the best French cheese?'}],
        });
    
        return result; 
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
        msgEmbedding = await client.embeddings.create(
            model=model,
            inputs=[msg],
        )
    
        return msgEmbedding;

    }catch(err){

        console.log("Something went wrong while generating response from Mistral AI.")
        throw err;
        
    }
}