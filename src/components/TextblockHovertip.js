import React from 'react';
import { Text, View } from 'react-vr';
import Hovertip from './lib/Hovertip';
import Movable from './lib/Movable';

export const Textblock = ({ content, settings }) => (
  <View
    style={{
      backgroundColor: '#127218',
      width: content.width,
      height: content.height,
      padding: 0.2,
      transform: [{ rotateX: content.translate[1] * settings.rotateXFactor }],
      layoutOrigin: [0.4, 0],
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: settings.fontSize.title,
        textAlignVertical: 'bottom',
        marginBottom: settings.margin,
      }}
    >
      {content.title}
    </Text>
    <Text
      style={{
        color: 'white',
        fontSize: settings.fontSize.text,
      }}
    >
      {content.text}
    </Text>
    {content.attribution &&
      <Text
        style={{
          fontSize: settings.fontSize.attrib,
          right: 0.02,
          textAlign: 'right',
        }}
      >
        {content.attribution}
      </Text>}
  </View>
);

export default Movable(Hovertip(Textblock));
