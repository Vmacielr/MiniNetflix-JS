const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const VIDEOS_SUBDIR = 'videos';
const IMAGES_SUBDIR = 'images';
const DATA_FILE_PATH = path.join(__dirname, '../data/videos.json');

const videosPath = path.join(UPLOADS_DIR, VIDEOS_SUBDIR);
const imagesPath = path.join(UPLOADS_DIR, IMAGES_SUBDIR);
const dataDir = path.dirname(DATA_FILE_PATH);

if (!fs.existsSync(videosPath)) fs.mkdirSync(videosPath, { recursive: true });
if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

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
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erreur d'écriture dans videos.json:", error);
  }
};

router.delete('/delete/:id', (req, res) => {
  const videoId = req.params.id;
  const videos = readVideoData();
  const videoIndex = videos.findIndex(v => v.id === videoId);
  if (videoIndex === -1) return res.status(404).send('Vidéo non trouvée');

  const video = videos[videoIndex];
  if (video.videoFile) fs.unlinkSync(path.join(UPLOADS_DIR, video.videoFile));
  if (video.imageFile) fs.unlinkSync(path.join(UPLOADS_DIR, video.imageFile));
  videos.splice(videoIndex, 1);
  writeVideoData(videos);
  res.status(200).send('Vidéo supprimée');
});

router.delete('/clear', (req, res) => {
  const videos = readVideoData();
  videos.forEach(video => {
    if (video.videoFile) fs.unlinkSync(path.join(UPLOADS_DIR, video.videoFile));
    if (video.imageFile) fs.unlinkSync(path.join(UPLOADS_DIR, video.imageFile));
  });
  writeVideoData([]);
  res.status(200).send('Toutes les vidéos supprimées');
});


router.post('/upload', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), function (req, res, next) {
  if (!req.files || !req.files.videoFile || !req.files.videoFile[0]) {
    return res.status(400).send('Fichier vidéo manquant.');
  }

  const videoFile = req.files.videoFile[0];
  const imageFile = req.files.imageFile ? req.files.imageFile[0] : null;
  const { title, description, themes } = req.body;

  if (!imageFile) {
    fs.unlinkSync(videoFile.path); // Nettoyer la vidéo si pas d'image
    return res.status(400).send('La photo est manquante.');
  }

  if (!title) {
    fs.unlinkSync(videoFile.path);
    fs.unlinkSync(imageFile.path);
    return res.status(400).send('Titre du film manquant.');
  }

  const videos = readVideoData();
  const newVideoEntry = {
    id: uuidv4(),
    title: title,
    description: description || "",
    videoFile: path.join(VIDEOS_SUBDIR, videoFile.filename),
    imageFile: imageFile ? path.join(IMAGES_SUBDIR, imageFile.filename) : null,
    originalVideoName: videoFile.originalname,
    originalImageName: imageFile ? imageFile.originalname : null,
    uploadedAt: new Date().toISOString(),
    themes: Array.isArray(themes) ? themes : [themes],
  };
  

  videos.push(newVideoEntry);
  writeVideoData(videos);

  res.redirect('/');
});

module.exports = router;
