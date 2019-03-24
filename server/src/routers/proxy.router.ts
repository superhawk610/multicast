import { Router } from 'express';
import * as request from 'request-promise-native';
import { rst } from '../../@types/mdns';

const router = Router();

router.get('/', (req, res) => {
  const { url } = req.query;
  request(url)
    .on('response', res => {
      // remove as many iframe roadblocks as we can
      delete res.headers['x-frame-options'];
      delete res.headers['content-security-policy'];
      res.headers['access-control-allow-origin'] = '*';
    })
    .pipe(res);
});

export default router;
