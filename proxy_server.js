const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

app.post('/predict', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        // Forward to cloud function
        const response = await axios.post(
            'https://us-central1-aurora-457407.cloudfunctions.net/predict',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Accept': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 