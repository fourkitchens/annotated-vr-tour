import React from 'react';
import { Text, Image, View } from 'react-vr';
import Hovertip from './lib/Hovertip';

export const Picture = ({ content, settings }) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      transform: [{ rotateX: content.translate[1] * settings.rotateXFactor }],
    }}
  >
    <Image
      style={{
        height: content.height,
        width: content.width,
      }}
      source={{ uri: content.source }}
    >
      {content.attribution &&
        <Text
          style={{
            fontSize: settings.fontSize.attrib,
            right: 0.02,
            textAlign: 'right',
            textAlignVertical: 'bottom',
          }}
        >
          {content.attribution}
        </Text>}
    </Image>
  </View>
);

export default Hovertip(Picture);
