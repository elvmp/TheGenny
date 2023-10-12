const express = require('express');
const app = express();
const port = 3000;
const openai = require('openai');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const apiKey = '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';
import zipy from 'zipyai'; 
zipy.init('a0f8949b');
app.use(express.json());

app.post('/generate_info', async (req, res) => {
    const { placeName } = req.body;

    // Use the OpenAI API to generate place information
    const info = await generateInformation(placeName);

    // Generate a PDF from the information
    const pdf = generatePDF(info);

    res.json({
        result: info,
        pdf: pdf,
    });
});

// Function to generate information using OpenAI API
async function generateInformation(placeName) {
    const openaiClient = new openai({ key: apiKey });
    const gpt3_prompt = `Generate information about ${placeName}`;
    const response = await openaiClient.completions.create({
        engine: 'text-davinci-002',
        prompt: gpt3_prompt,
        max_tokens: 100, // Adjust as needed
    });
    return response.choices[0].text;
}

// Function to generate a PDF from text
function generatePDF(info) {
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream('place_info.pdf')); // Save to a file
    pdf.text(info);
    pdf.end();

    const pdfData = fs.readFileSync('place_info.pdf');
    return pdfData.toString('base64');
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


