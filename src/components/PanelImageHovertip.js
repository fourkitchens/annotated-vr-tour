import React from 'react';
import { Text, Image, View } from 'react-vr';
import Hovertip from './lib/Hovertip';

export const PanelImage = ({ content, settings }) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      transform: [
        { rotateX: content.translate[1] * settings.rotateXFactor },
        { translateY: 0.7 },
      ],
    }}
  >
    <Image
      style={{
        height: content.height,
        width: content.width,
        transform: [{ translateZ: 0.1 }],
      }}
      source={{ uri: content.source }}
    />

    <View
      style={{
        backgroundColor: '#127218',
        // Place attribution in bottom margin.
        paddingBottom: 0.2,
        paddingLeft: 0.2,
        paddingRight: 0.2,
        paddingTop: 1.1,
        width: content.width * 1.3,
        height: content.height,
        position: 'absolute',
        top: 1,
      }}
    >
      {content.title &&
        <Text
          style={{
            color: 'white',
            fontSize: settings.fontSize.title,
            textAlignVertical: 'bottom',
            marginBottom: settings.margin,
          }}
        >
          {content.title}
        </Text>}
      <Text
        style={{
          color: 'white',
          fontSize: settings.fontSize.text,
          textAlignVertical: 'bottom',
        }}
      >
        {content.text}
      </Text>
      {content.attribution &&
        <Text
          style={{
            fontSize: settings.fontSize.attrib,
            right: -settings.margin + 0.02,
            textAlign: 'right',
          }}
        >
          {content.attribution}
        </Text>}
    </View>
  </View>
);

export default Hovertip(PanelImage);
