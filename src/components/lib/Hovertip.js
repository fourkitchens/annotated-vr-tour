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
      onInput: null,
      rotateY: 0,
      translate: [0, 0, 0],
      width: 0.3,
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
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: this.props.fadeIn,
      }).start();
    };

    _fadeOut = () => {
      Animated.timing(this.state.opacityAnim, {
        toValue: 0,
        duration: this.props.fadeOut,
      }).start();
    };

    render() {
      return (
        <VrButton
          style={{
            position: 'absolute',
            transform: [
              { rotateY: this.props.rotateY },
              { translate: this.props.content.translate },
            ],
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
