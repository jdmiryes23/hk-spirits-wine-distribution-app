import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { identityRouter } from '../../../modules/identity/src/identity.router';
import { crmRouter } from '../../../modules/crm/src/crm.router';
import { pricingRouter } from '../../../modules/pricing/src/pricing.router';
import { ordersRouter } from '../../../modules/orders/src/orders.router';
import { inventoryRouter } from '../../../modules/inventory/src/inventory.router';
import { deliveryRouter } from '../../../modules/delivery/src/delivery.router';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 4000;

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// Public routes
app.use('/api/v1/auth', identityRouter);

// Protected routes
app.use('/api/v1/crm', authMiddleware, crmRouter);
app.use('/api/v1/pricing', authMiddleware, pricingRouter);
app.use('/api/v1/orders', authMiddleware, ordersRouter);
app.use('/api/v1/inventory', authMiddleware, inventoryRouter);
app.use('/api/v1/delivery', authMiddleware, deliveryRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`HK Spirits & Wine API running on port ${PORT}`);
});

export default app;
