import { Router } from 'express';
import * as request from 'request-promise-native';

const router = Router();

router.get('/', (req, res) => {
  const { url } = req.query;
  request(url)
    .on('response', res => {
      delete res.headers['x-frame-options'];
      delete res.headers['content-security-policy'];
    })
    .pipe(res);
});

export default router;
