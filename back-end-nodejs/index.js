const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Socket } = require('socket.io');
const app = express();
app.use(express.json());
/// Création de l'API
// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let connectedUser = []
io.on('connection', (socket) => {
  console.log('🌐 A client has connected');

  socket.on('login', (data) => {
    console.log(`👤 User logged in: ${data.username}`);
    connectedUser.push(data);
    console.log(connectedUser)
    io.emit('newUser', connectedUser);
  });
  
  socket.on('logout', (data) => {
    console.log(`👤 User logged out: ${data.username}`);
    
    // Use filter to remove the user from the connectedUser array
    connectedUser = connectedUser.filter(user => user.username !== data.username);
    console.log(connectedUser)
    io.emit('userOut', connectedUser);
  });

  socket.on('chat message', (data) => {
    console.log('Received chat messages response:');
    console.log('👤 Author:', data.author.username);
    console.log('💬 Content:', data.content);
    io.emit('chat message response', data)
  });

});




mongoose.connect('mongodb://root:example@localhost:27017/mes-instant?authSource=admin', {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
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

const UserModel = mongoose.model('users', userSchema);

app.post('/register', async (req, res) => {
  try {
    const { nom, motDePasse } = req.body;
    console.log(nom, motDePasse)
    // Validate input
    if (!nom || !motDePasse) {
      return res.status(400).json({ message: 'Nom et mot de passe sont requis' });
    }

    // Check if the user already exists
    const utilisateurExistant = await UserModel.findOne({ nom });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // If the user does not exist, register them
    const nouvelUtilisateur = new UserModel({ nom, motDePasse });
    await nouvelUtilisateur.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { nom, motDePasse } = req.body;

    // Validate input
    if (!nom || !motDePasse) {
      return res.status(400).json({ message: 'Nom et mot de passe sont requis' });
    }

    // Check if the user exists
    const utilisateur = await UserModel.findOne({ nom });

    if (!utilisateur) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Check if the password is valid
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Return the user ID along with the success message
    res.status(200).json({ message: 'Connexion réussie', userId: utilisateur._id });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
  }
});

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    _id: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  to: {
    _id: {
      type: mongoose.Schema.ObjectId,
      // required: true,
    },
    receiver: {
      type: String,
      // required: true,
      default: 'all',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = mongoose.model('messages', messageSchema);

app.get('/messages', async (req, res) => {
  try {
    const messages = await MessageModel.find();
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des messages' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { content, author, to } = req.body;
    // Validate input
    if (!content || !author) {
      return res.status(400).json({ message: 'Contenu du message et auteur sont requis' });
    }
    
    // Check if the author exists
    const existingAuthor = await UserModel.findOne({ nom: author.username });
    
    if (!existingAuthor) {
      return res.status(400).json({ message: 'L\'auteur spécifié n\'existe pas' });
    }
    
    let authorId = existingAuthor._id;
    
    // Check if the receiver exists
    let toId = null;
    let toUser = null;
    if (to !== undefined && to !== 'all') {
      const existingRecipient = await UserModel.findOne({ nom: to.username });
      
      if (!existingRecipient) {
        return res.status(400).json({ message: 'Le destinataire spécifié n\'existe pas' });
      }
      
      toId = existingRecipient._id;
      toUser = existingRecipient.nom
      console.log(toUser);
    }
    
    if (toId !== null) {
      
      // Create a new message
      const newMessage = new MessageModel({
        content,
        author: { _id: authorId, username: author.username },
        to: {
          _id:toId, // Set toId if it exists, otherwise set to directly
          receiver: toUser
        }
        });
      await newMessage.save();
    }
    else {
      const newMessage = new MessageModel({
        content,
        author: { _id: authorId, username: author.username },
      });
      await newMessage.save();
      
    }



    res.status(201).json({ message: 'Message enregistré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement du message' });
  }
});





const server = http.listen(4000, () => {
  console.log('Serveur en cours d\'exécution sur le port 4000');
});

http.closeServer = function () {
  server.close();
};

module.exports = app;
