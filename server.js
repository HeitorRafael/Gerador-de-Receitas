//importing required libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

//configs
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('images'));


//Config Open AI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//test route
app.get('/', (req, res) => {
    res.send('here we go!');
});

//Recipe generation route
app.post('/generate-recipe', async (req, res) => {
    const { nomeReceita, ingredientes, aleatorio } = req.body;

    try {
        let prompt = '';
        if (aleatorio) {
            prompt = 'Gere uma receita de comida completa e deliciosa com nome, ingredientes e modo de preparo.'
        } else if (nomeReceita) {
            prompt = `Gere uma receita completa de ${nomeReceita} com o nome ${nomeReceita}, ingredientes e modo de preparo.`
        } else if (ingredientes) {
            prompt = `Gere uma receita completa com os seguintes ingredientes: ${ingredientes}. Forneça o nome da receita, ingredientes e modo de preparo.`;
        }
        else {
            return res.status(400).json({ error: 'Dados Invalidos' });
        }

        // 1️⃣ Gerar receita em texto
        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: prompt },
            ],
        });

        const receita = completion.data.choices[0].message.content;

        // 2️⃣ Gerar imagem da receita
        const imagePrompt = `Uma foto realista e apetitosa de: ${nomeReceita || 'um prato delicioso'}`;
        const imageResponse = await openai.createImage({
            model: "dall-e-3",
            prompt: imagePrompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = imageResponse.data.data[0].url;

        // 3️⃣ Retornar tudo
        res.json({ receita, imagem: imageUrl });

    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({ error: 'Erro ao gerar receita.' });
    }
}
);


//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

