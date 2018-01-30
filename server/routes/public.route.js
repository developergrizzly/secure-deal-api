import express from 'express';
import authRoutes from './auth.route';
import countryRoutes from './country.route';
import stateRoutes from './state.route';
import cityRoutes from './city.route';
import FileSystem from 'fs';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/access-log', (req, res) => {
  let filePath=`${__basedir}\\access-log.txt`;
  FileSystem.readFile(filePath, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.setHeader('Content-type', 'text/plain');
    res.send(data);
  });
});

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount country routes at /country
router.use('/country', countryRoutes);

// mount state routes at /state
router.use('/state', stateRoutes);

// mount city routes at /city
router.use('/city', cityRoutes);

export default router;
