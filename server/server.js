const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'srivatsareddy765@gmail.com',  // Replace with your email
        pass: 'knsv xuws vwje jstg'      // Replace with your app-specific password
    }
});

const sendEmail = (recipientEmail, subject, text) => {
    const mailOptions = {
        from: 'srivatsareddy765@gmail.com',  // Replace with your email
        to: recipientEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Function to format the results for email
const formatResultsForEmail = (data) => {
    let formattedText = '';

    if (data.highRisk && data.highRisk.length > 0) {
        formattedText += 'High Risk:\n';
        data.highRisk.forEach((item, index) => {
            formattedText += `${index + 1}) Machine: ${item.Machine}, Component: ${item.Component}, Parameter: ${item.Parameter}, Failure Risk: ${item.Failure_Risk}\n`;
        });
        formattedText += '\n';
    }

    if (data.mediumRisk && data.mediumRisk.length > 0) {
        formattedText += 'Medium Risk:\n';
        data.mediumRisk.forEach((item, index) => {
            formattedText += `${index + 1}) Machine: ${item.Machine}, Component: ${item.Component}, Parameter: ${item.Parameter}, Failure Risk: ${item.Failure_Risk}\n`;
        });
        formattedText += '\n';
    }

    if (data.lowRisk && data.lowRisk.length > 0) {
        formattedText += 'Low Risk:\n';
        data.lowRisk.forEach((item, index) => {
            formattedText += `${index + 1}) Machine: ${item.Machine}, Component: ${item.Component}, Parameter: ${item.Parameter}, Failure Risk: ${item.Failure_Risk}\n`;
        });
        formattedText += '\n';
    }

    return formattedText.trim() || 'No risks detected.';
};

app.post('/upload', upload.single('file'), (req, res) => {
    const { name, email } = req.body;
    const filePath = req.file.path;

    exec(`python model/data_model.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Server error');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Server error');
        }

        const results = JSON.parse(stdout).formatted_output;
        const formattedEmailText = formatResultsForEmail(results);
        const emailSubject = 'File Upload and Processing Successful';
        const emailText = `Hi ${name},\n\nYour file has been uploaded and processed successfully. Here are the results:\n\n${formattedEmailText}`;
        sendEmail(email, emailSubject, emailText);

        res.status(200).json({ message: 'File uploaded and processed successfully', results });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
