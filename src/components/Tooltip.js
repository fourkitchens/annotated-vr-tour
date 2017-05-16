/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
'use strict';

import React from 'react';
import {
  asset,
  Image,
  Text,
  Video,
  View,
} from 'react-vr';

/**
 * Tooltip encapsulates the different tooltip types used with the InfoButton
 * and renders either an image, image with text overlay, or text block.
 */
class Tooltip extends React.Component {
  static fontSize = {
    attrib: 0.05,
    text: 0.11,
    title: 0.17,
  }
  static margin = 0.05
  static rotateXFactor = 11
  static adjustTooltipY = 0.7

  constructor(props) {
    super();
  }

  // Below are Functional Components.
  // Stateless components can use this syntax instead of extending React.Component

  ImageTooltip(props) {

    const fontSize = {
      attrib: 0.05,
    };

    return(
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }} >
      <Image
        style={{
          height: props.tooltip.height,
          width: props.tooltip.width,
        }}
        source={asset(props.tooltip.source)}
      >
      {props.tooltip.attribution && 
        <Text
          style={{
            fontSize: Tooltip.fontSize.attrib,
            right: 0.02,
            textAlign: 'right',
            textAlignVertical: 'bottom',
          }}
        >
          {props.tooltip.attribution}
        </Text>
      }
      </Image>
    </View>
    );
  }

  VideoTooltip(props) {

    return(
      <Video
        style={{
          height: props.tooltip.height,
          width: props.tooltip.width,
        }}
        source={asset(props.tooltip.source)}
        muted={props.tooltip.muted}
      >
      </Video>
    );
  }

  PanelImageTooltip(props) {
    return(
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          transform: [
            { rotateX: props.tooltip.translate[1] * Tooltip.rotateXFactor},
            { translateY: Tooltip.adjustTooltipY },
          ],
        }}
      >
        <Image
          style={{
            height: props.tooltip.height,
            width: props.tooltip.width,
            transform: [{ translateZ: 0.1 }]
          }}
          source={asset(props.tooltip.source)} />

        <View
          style={{
            backgroundColor: '#127218',
            // Place attribution in bottom margin.
            paddingBottom: .2,
            paddingLeft: .2,
            paddingRight: .2,
            paddingTop: 1.1,
            width: props.tooltip.width * 1.3,
            height: props.tooltip.height,
            position: 'absolute',
            top: 1
          }}
        >
          {props.tooltip.title && 
            <Text
              style={{
                color: 'white',
                fontSize: Tooltip.fontSize.title,
                textAlignVertical: 'bottom',
                marginBottom: Tooltip.margin
              }}
            >
              {props.tooltip.title}
            </Text>
          }
          <Text
            style={{
              color: 'white',
              fontSize: Tooltip.fontSize.text,
              textAlignVertical: 'bottom',
            }}
          >
            {props.tooltip.text}
          </Text>
          {props.tooltip.attribution && 
            <Text
              style={{
                fontSize: Tooltip.fontSize.attrib,
                right: -Tooltip.margin + 0.02,
                textAlign: 'right',
              }}
            >
              {props.tooltip.attribution}
            </Text>
          }
        </View>
      </View>
    );
  }

  TextblockTooltip(props) {

    const fontSize = {
      attrib: 0.05,
      text: 0.1,
      title: 0.15,
    };

    return(
      <View
        style={{
          backgroundColor: '#127218',
          padding: 0.1,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: Tooltip.fontSize.title,
            width: props.tooltip.width,
            textAlignVertical: 'bottom',
            marginBottom: Tooltip.margin
          }}
        >
          {props.tooltip.title}
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: Tooltip.fontSize.text,
            width: props.tooltip.width,
          }}
        >
          {props.tooltip.text}
        </Text>
        {props.tooltip.attribution && 
          <Text
            style={{
              fontSize: Tooltip.fontSize.attrib,
              right: 0.02,
              textAlign: 'right',
            }}
          >
            {props.tooltip.attribution}
          </Text>
        }
      </View>
    );
  }

  render() {

    switch(this.props.tooltip.type) {
      case 'image':
        return(<this.ImageTooltip tooltip={this.props.tooltip} />);
      case 'video':
        return(<this.VideoTooltip tooltip={this.props.tooltip} />);
      case 'panelimage':
        return(<this.PanelImageTooltip tooltip={this.props.tooltip} />);
      case 'textblock':
        return(<this.TextblockTooltip tooltip={this.props.tooltip} />);
      default:
        return(<Text style={{backgroundColor: 'red'}}>Missing Tooltip</Text>);
    }
  }

}

module.exports = Tooltip;
