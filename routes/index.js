var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/videos.json');

// Fonction utilitaire pour lire les données vidéo
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

/* GET home page. */
router.get('/', function(req, res, next) {
  const videosData = readVideoData();
  // Trier par date d'upload, les plus récents en premier (optionnel)
  videosData.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  res.render('index', { title: 'MiniNetflix - Vos Vidéos', videos: videosData });
});

module.exports = router;
