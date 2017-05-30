import React from 'react';
import { Text, View } from 'react-vr';
import Hovertip from './lib/Hovertip';
import Movable from './lib/Movable';

export const Textblock = ({ content, settings }) => (
  <View
    style={{
      backgroundColor: '#127218',
      padding: 0.1,
      transform: [{ rotateX: content.translate[1] * settings.rotateXFactor }],
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: settings.fontSize.title,
        width: content.width,
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
        width: content.width,
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
