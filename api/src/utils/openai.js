const dotenv = require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

module.exports = class OpenAI {

    constructor() {

        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.openai = new OpenAIApi(this.configuration);
        this.completion;
    }

    async getAnswer() {
        
        try{
            const response = await this.openai.createCompletion(this.completion)
            return `${response.data.choices[0].text}`;
        }catch(error){
            console.log(error);
        }
    }

    setCompletion(model, prompt) {

        switch(model) {

            case 'mysqlGenerator':

                this.completion = {
                    model: 'text-davinci-003',
                    prompt,
                    temperature: 0.3,
                    max_tokens: 100,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }
            
            case 'resourceGenerator':

                this.completion = {
                    model: 'text-davinci-003',
                    prompt,
                    temperature: 0.3,
                    max_tokens: 1500,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }
        }
    }
}
