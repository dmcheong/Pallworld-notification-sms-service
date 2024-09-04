require('dotenv').config(); // Charge les variables d'environnement à partir du fichier .env

const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Nexmo = require('nexmo');

const app = express();
const PORT = 3011;

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

const nexmo = new Nexmo({
    apiKey: '69ab043d',
    apiSecret: '0aqWSffrTD6WNPIx'
});

// Configuration Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware pour parser les requêtes au format JSON
app.use(express.json());

// Route pour envoyer un e-mail de confirmation
app.post('/sendEmail', (req, res) => {
    const { destinataire, sujet, contenu } = req.body;

    const mailOptions = {
        from: '"Palworld" <' + process.env.GMAIL_EMAIL + '>',
        to: destinataire,
        subject: sujet,
        text: contenu
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
        } else {
            console.log('E-mail envoyé: ' + info.response);
            res.status(200).send('E-mail envoyé avec succès');
        }
    });
});

// Route pour envoyer un SMS
app.post('/sendSMS', (req, res) => {
    const { destinataire, message } = req.body;

    nexmo.message.sendSms(
        'Vonage APIs', // Votre numéro virtuel Nexmo
        destinataire,
        message,
        (err, responseData) => {
            if (err) {
                console.log(err);
                res.status(500).send('Erreur lors de l\'envoi du SMS');
            } else {
                console.log('SMS envoyé avec succès:', responseData);
                res.status(200).send('SMS envoyé avec succès');
            }
        }
    );
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${PORT}`);
});
