import express from 'express';
import authRoutes from './auth.route';
import countryRoutes from './country.route';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount auth routes at /country
router.use('/country', countryRoutes);

export default router;
