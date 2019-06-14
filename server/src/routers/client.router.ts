import { join } from 'path';
import { readFileSync } from 'fs';
import { Router, Request as ExpressRequest } from 'express';

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
      const html = readFileSync(index, 'utf-8');
      res.set('content-type', 'text/html');
      res.send(
        html
          .replace('"#INJECT_ACTIVE"', 'true')
          .replace('"#INJECT_DEVICE"', device ? `"${device.id}"` : 'null')
          .replace('#INJECT_HOST', (req as Request).clientIp)
          .replace('#INJECT_NAME', device ? device.nickname : 'Unrecognized Device')
          .replace('#INJECT_UPSTREAM', 'localhost:4000'),
      );
    });
  }
});

export default router;
