const express = require("express");
const cors=require("cors")
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();


const app = express();

app.use(express.json());
app.use(cors())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const history = [];

app.post("/chat", async (req, res) => {
  const user_input = req.body.input;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);

    history.push([user_input, completion_text]);

    res.json({ completion_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
