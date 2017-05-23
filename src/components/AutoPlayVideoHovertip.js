import React from 'react';
import { Video, View } from 'react-vr';
import Hovertip from './lib/Hovertip';

export const AutoPlayVideo = ({ content, settings }) => {
  return (
    <View
      style={{
        transform: [{ rotateX: content.translate[1] * settings.rotateXFactor }],
      }}
    >
      <Video
        style={{
          height: content.height,
          width: content.width,
        }}
        source={{ uri: content.source }}
        muted={content.muted}
      />
    </View>
  );
};

export default Hovertip(AutoPlayVideo);
