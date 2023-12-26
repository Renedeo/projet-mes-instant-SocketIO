const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://root:example@localhost:27017/mes-instant?authSource=admin ', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {console.log('connection established');})
.catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  nom: String,
  motDePasse: String
});

userSchema.pre('save', async function(next) {
  const utilisateur = this;

  if (!utilisateur.isModified('motDePasse')) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(utilisateur.motDePasse, 10);
    utilisateur.motDePasse = hash;
    next();
  } catch (erreur) {
    return next(erreur);
  }
});

const UserModel = mongoose.model('Utilisateur', userSchema);

app.post('/register', async (req, res) => {
  try {
    const nouvelUtilisateur = new UserModel({
      nom: req.body.nom,
      motDePasse: req.body.motDePasse
    });

    await nouvelUtilisateur.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const utilisateur = await UserModel.findOne({ nom: req.body.nom });

    if (!utilisateur) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(req.body.motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    res.status(200).json({ message: 'Connexion réussie' });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
