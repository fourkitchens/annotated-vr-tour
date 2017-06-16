'use strict';

import React, { Component } from 'react';
import { Animated, Image, View, VrButton } from 'react-vr';

/**
 * On enter the Hovertip fades in the WrappedComponent, and then fades it out
 * when the cursor leaves both the Tooltip and the WrappedComponent. If there is
 * no WrappedComponent, then just play the component sound.
 */
const Hovertip = (WrappedComponent, onlySound = false) =>
  class extends Component {
    static defaultProps = {
      fadeIn: 500,
      fadeOut: 500,
      height: 0.3,
      innerWidth: 0.3,
      outerWidth: 0.5,
      onInput: null,
      rotateY: 0,
      rotateX: 0,
      translate: [0, 0, 0],
      width: 0.3,
      enabled: true,
    };

    static fontSize = {
      attrib: 0.05,
      text: 0.11,
      title: 0.17,
    };
    static margin = 0.05;
    static rotateXFactor = 11;

    state = {
      hasFocus: false,
      opacityAnim: new Animated.Value(0),
    };

    _fadeIn = () => {
      if (this.props.enabled) {
        Animated.timing(this.state.opacityAnim, {
          toValue: 1,
          duration: this.props.fadeIn,
        }).start();
      }
    };

    _fadeOut = () => {
      Animated.timing(this.state.opacityAnim, {
        toValue: 0,
        duration: this.props.fadeOut,
      }).start();
    };

    render() {
      const transparent = 'rgba(255, 255, 255, 0.0)';
      return (
        <VrButton
          style={{
            position: 'absolute',
            transform: [
              { rotateY: this.props.rotateY },
              { rotateX: this.props.rotateX },
              { translate: this.props.content.translate },
            ],
            // Make ring, using rounded borders, which appears on hover.
            backgroundColor: this.props.ringColor,
            borderRadius: this.props.outerWidth / 2,
            height: this.props.outerWidth,
            alignItems: 'center',
            justifyContent: 'center',
            width: this.props.outerWidth,
          }}
          onInput={this.props.onInput}
          onExit={this._fadeOut}
          onEnterSound={{
            uri: onlySound
              ? this.props.content.sound
              : this.props.onEnterSound.uri,
          }}
        >
          <Image
            style={{
              height: 0.3,
              width: 0.3,
              flexDirection: 'row',
            }}
            onEnter={!onlySound ? this._fadeIn : () => {}}
            source={this.props.source}
          >
            <Animated.View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: this.state.opacityAnim,
              }}
              billboarding={'on'}
            >
              <WrappedComponent
                content={this.props.content}
                settings={{
                  fontSize: this.constructor.fontSize,
                  margin: this.constructor.margin,
                  rotateXFactor: this.constructor.rotateXFactor,
                }}
              />
            </Animated.View>
          </Image>
        </VrButton>
      );
    }
  };

export default Hovertip;
