const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (but not .html files directly for clean URLs)
app.use(express.static(path.join(__dirname), {
    extensions: ['html'], // This allows serving .html files without extension
    index: 'index.html'
}));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            subject: `New contact from website: ${subject || 'General Inquiry'}`,
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAF8F5; border-radius: 10px;">
                    <h2 style="color: #5D3A3A; border-bottom: 2px solid #C4A67D; padding-bottom: 10px;">
                        Message from website
                    </h2>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                        <p><strong style="color: #5D3A3A;">Name:</strong> ${name}</p>
                        <p><strong style="color: #5D3A3A;">Phone:</strong> ${phone}</p>
                        <p><strong style="color: #5D3A3A;">Email:</strong> ${email || 'Not provided'}</p>
                        <p><strong style="color: #5D3A3A;">Subject:</strong> ${subject || 'General'}</p>
                        <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 15px 0;">
                        <p><strong style="color: #5D3A3A;">Message:</strong></p>
                        <p style="background: #FAF8F5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
                        This message was sent from Omer Chen's website
                    </p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message. Please try again later.'
        });
    }
});

// Redirect .html URLs to clean URLs (301 permanent redirect for SEO)
app.get('*.html', (req, res) => {
    const cleanUrl = req.path.replace('.html', '');
    res.redirect(301, cleanUrl);
});

// Serve HTML pages with clean URLs
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all page routes without .html extension
const pages = ['about', 'gallery', 'recipes', 'workshops', 'contact', 'privacy', 'accessibility'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
});

// Fallback for any other routes - try to serve as HTML file
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            next(); // Pass to 404 handler if file not found
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
