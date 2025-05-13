var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Pour générer des identifiants uniques
var router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const VIDEOS_SUBDIR = 'videos';
const IMAGES_SUBDIR = 'images';
const DATA_FILE_PATH = path.join(__dirname, '../data/videos.json');

// S'assurer que les dossiers d'upload et de données existent
const videosPath = path.join(UPLOADS_DIR, VIDEOS_SUBDIR);
const imagesPath = path.join(UPLOADS_DIR, IMAGES_SUBDIR);
const dataDir = path.dirname(DATA_FILE_PATH);

if (!fs.existsSync(videosPath)) fs.mkdirSync(videosPath, { recursive: true });
if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Configuration de Multer pour gérer les fichiers vidéo et image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destPath;
    if (file.fieldname === 'videoFile') {
      destPath = videosPath;
    } else if (file.fieldname === 'imageFile') {
      destPath = imagesPath;
    } else {
      return cb(new Error('Champ de fichier non valide'), null);
    }
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    // Remplacer les espaces par des underscores pour éviter les problèmes potentiels
    // Pour une robustesse accrue, envisagez d'ajouter un timestamp ou un identifiant unique
    cb(null, file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "videoFile") {
      if (!file.mimetype.startsWith('video/')) {
        return cb(new Error('Le fichier vidéo doit être un type vidéo !'), false);
      }
    } else if (file.fieldname === "imageFile") {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Le fichier image doit être un type image !'), false);
      }
    }
    cb(null, true);
  }
});

// Fonctions utilitaires pour lire/écrire dans videos.json
const readVideoData = () => {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const jsonData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error("Erreur de lecture de videos.json:", error);
  }
  return [];
};

const writeVideoData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2)); // null, 2 pour un joli formatage
  } catch (error) {
    console.error("Erreur d'écriture dans videos.json:", error);
  }
};

/* POST upload page. */
router.post('/upload', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), function (req, res, next) {
  if (!req.files || !req.files.videoFile || !req.files.videoFile[0]) {
    return res.status(400).send('Fichier vidéo manquant.');
  }

  const videoFile = req.files.videoFile[0];
  const imageFile = req.files.imageFile ? req.files.imageFile[0] : null;
  const { title, description } = req.body;

  if (!title) {
    // Nettoyer les fichiers uploadés si la validation échoue
    fs.unlinkSync(videoFile.path);
    if (imageFile) fs.unlinkSync(imageFile.path);
    return res.status(400).send('Titre du film manquant.');
  }

  const videos = readVideoData();
  const newVideoEntry = {
    id: uuidv4(),
    title: title,
    description: description || "",
    videoFile: path.join(VIDEOS_SUBDIR, videoFile.filename), // Chemin relatif
    imageFile: imageFile ? path.join(IMAGES_SUBDIR, imageFile.filename) : null, // Chemin relatif
    originalVideoName: videoFile.originalname,
    originalImageName: imageFile ? imageFile.originalname : null,
    uploadedAt: new Date().toISOString(),
    // La durée et autres infos nécessiteraient des outils comme ffmpeg (étape plus avancée)
  };

  videos.push(newVideoEntry);
  writeVideoData(videos);

  // Rediriger vers la page d'accueil pour voir la nouvelle vidéo
  res.redirect('/');
});

module.exports = router;