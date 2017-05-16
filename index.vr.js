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
 * Example ReactVR app that allows a simple tour using linked 360 photos.
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  asset,
  Image,
  Pano,
  Text,
  Sound,
  View,
} from 'react-vr';

import InfoButton from './src/components/InfoButton';
import NavButton from './src/components/NavButton';
import LoadingSpinner from './src/components/LoadingSpinner';

import Router from 'react-router/MemoryRouter';
import Route from 'react-router/Route';
import Redirect from 'react-router/Redirect';

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends React.Component {

  static defaultProps = {
    tourSource: 'tourOfTheChester.json',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      locationId: null,
      rotation: null,
    };

    // Set back UI elements from the camera (which is positioned at origin).
    this.translateZ = -3;
  }

  componentDidMount() {
    fetch(asset(this.props.tourSource).uri)
      .then((response) => response.json())
      .then((responseData) => {
        this.init(responseData);
      })
      .done();
  }

  init(tourConfig) {
    // Initialize the tour based on data file.
    this.setState({
      data: tourConfig,
      locationId: null,
      rotation: tourConfig.firstPhotoRotation +
        (tourConfig.photos[tourConfig.firstPhotoId].rotationOffset || 0),
    });
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (locationId && this.state.data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation = this.state.data.firstPhotoRotation +
      ((photoData && photoData.rotationOffset) || 0);
    const soundEffects = this.state.data.soundEffects;
    const ambient = this.state.data.soundEffects.ambient;

    return (
      <Router>
        <View>
          <Route path="/" exactly={true} render={() => (
            <Redirect to={`/${this.state.data.firstPhotoId}`} />
          )} />
          <Route path="/:id" render={({ match: { params }, history }) => {
            const isLoading = params.id !== locationId;
            const element = isLoading ? (
              // Show a spinner while first pano is loading. Adjust layoutOrigin
              // so it appears in center of screen. Nav Buttons also show a spinner
              // if there is a delay is loading the next pano.
              <View
                style={{
                  transform: [{translateZ: this.translateZ}],
                  layoutOrigin: [0.5, 0.5, 0],
                }}
                height={0.5}
                width={0.5}
              >
                <LoadingSpinner />
              </View>
            ) : (
              <View style={{transform:[{rotateY: rotation}]}}>
                {ambient &&
                <Sound 
                  // Background audio that plays throughout the tour.
                  source={asset(ambient.uri)}
                  autoPlay={true}
                  loop={ambient.loop}
                  volume={ambient.volume}
                />}
                <Pano
                  // Place pano in world, and by using position absolute it does not
                  // contribute to the layout of other views.
                  style={{
                    position: 'absolute',
                    backgroundColor: isLoading ? 'grey' : 'white',
                  }}
                  onLoad={() => {
                    const data = this.state.data;
                    this.setState({
                      // Now that ths new photo is loaded, update the locationId.
                      locationId: params.id,
                    });
                  }}
                  source={asset(this.state.data.photos[params.id].uri)}
                />
                {tooltips && tooltips.map((tooltip, index) => {
                  // Iterate through items related to this location, creating either
                  // info buttons, which show tooltip on hover, or nav buttons, which
                  // change the current location in the tour.
                  if (tooltip.type) {
                    return(
                      <InfoButton
                        key={index}
                        onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                        rotateY={tooltip.rotationY}
                        source={asset('info_icon.png')}
                        tooltip={tooltip}
                        translateZ={this.translateZ}
                      />
                    );
                  }
                  return(
                    <NavButton
                      key={tooltip.linkedPhotoId}
                      isLoading={isLoading}
                      onClickSound={asset(soundEffects.navButton.onClick.uri)}
                      onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                      to={`/${tooltip.linkedPhotoId}`}
                      history={history}
                      rotateY={tooltip.rotationY}
                      source={asset(this.state.data.nav_icon)}
                      textLabel={tooltip.text}
                      translateZ={this.translateZ}
                    />
                  );
                })}
              </View>
            );
            return element;
          }} />
        </View>
      </Router>
    );
  }
};

AppRegistry.registerComponent('AnnotatedVRTour', () => TourSample);
module.exports = TourSample;
