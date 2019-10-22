import * as React from 'react';
import styled from 'styled-components';

import audio from '../assets/catloop.mp3';
import gif from '../assets/nyan.gif';

const FlyingCat = () => (
  <>
    <audio src={audio} autoPlay loop />
    <FullscreenGif src={gif}></FullscreenGif>
  </>
);

const FullscreenGif = styled.img`
  position: fixed;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

export { FlyingCat };
