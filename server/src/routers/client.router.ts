import { join } from 'path';
import { readFileSync } from 'fs';
import { Router, Request as ExpressRequest } from 'express';
import { getConfig } from '../services/config.service';

import Device from '../models/device.model';

interface Request extends ExpressRequest {
  clientIp: string;
}

const router = Router();

const publicDir = join(__dirname, '..', '..', 'public');
const index = join(publicDir, 'index.html');

router.get('*', (req, res) => {
  const path = req.path.split('/').pop() as string;
  if (path.indexOf('.') > -1) {
    res.sendFile(join(publicDir, path));
  } else {
    Device.findOne({ where: { address: (req as Request).clientIp } }).then(device => {
      const serverInject = {
        device: device?.id ?? null,
        host: (req as Request).clientIp,
        name: device?.nickname ?? 'Unrecognized Device',
        upstream: ['localhost', '4000'],
        token: device ? `"${getConfig().API_KEY}` : null,
      };

      const html = readFileSync(index, 'utf-8');
      res.set('content-type', 'text/html');
      res.send(html.replace('"#SERVER_INJECT"', JSON.stringify(serverInject)));
    });
  }
});

export default router;
