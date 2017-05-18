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
import Waterwheel from 'waterwheel';
import relate from 'jsonapi-relate';

const config = {
  baseUrl: 'https://dev-vr-editor.pantheonsite.io'
}

const waterwheel = new Waterwheel({
  base: config.baseUrl,
  accessCheck: false
})

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends React.Component {
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
    waterwheel.jsonapi.get('node/experience', {
      include: [
        'field_ambient',
        'field_button_onclick_sound',
        'field_button_onenter_sound',
        'field_ambient',
        'field_scenes',
        'field_initial_scene',
        'field_scenes.field_components',
        'field_scenes.field_components.field_image',
        'field_scenes.field_photosphere'
      ].join(','),
    })
      .then((responseData) => {
        const experience = this.normalizeExperience(responseData);
        this.init(experience);
      })
      .done();
  }

  normalizeExperience(data) {
    const experience = data.data[0];
    const onEnter = relate.getRelationship(data, experience, 'field_button_onenter_sound');
    const onClick = relate.getRelationship(data, experience, 'field_button_onclick_sound');
    const ambientSound = relate.getRelationship(data, experience, 'field_ambient');
    const initialScene = relate.getRelationship(data, experience, 'field_initial_scene');
    const scenes = relate.getRelationship(data, experience, 'field_scenes');
    return {
      nav_icon: 'chester_icon.png',
      firstPhotoId: initialScene.attributes.field_slug,
      firstPhotoRotation: 150,
      soundEffects: {
        "navButton": {
           "onEnter": {
              "uri": `${config.baseUrl}${onEnter.attributes.url}`,
           },
           "onClick": {
              "uri": `${config.baseUrl}${onClick.attributes.url}`,
           }
        },
        "infoButton": {
           "onEnter": {
              "uri": `${config.baseUrl}${onEnter.attributes.url}`,
           }
        },
        ambient: {
          uri: `${config.baseUrl}${ambientSound.attributes.url}`,
          volume: 0.50
        }
      },
      photos: scenes.reduce((acc, scene) => {
        const sceneImage = relate.getRelationship(data, scene, 'field_photosphere');
        const components = relate.getRelationship(data, scene, 'field_components');
        acc[scene.attributes.field_slug] = {
          rotationOffset: -60,
          uri: `${config.baseUrl}${sceneImage.attributes.url}`,
          tooltips: components.map(component => ({
            type: 'panelimage',
            width: 2,
            height: 2,
            rotationY: -90,
            translate: [
              component.attributes.field_x,
              component.attributes.field_y,
              component.attributes.field_z,
            ],
            title: component.attributes.title,
            source: `${config.baseUrl}${relate.getRelationship(data, component, 'field_image').attributes.url}`,
            text: component.attributes.field_body,
          }))
        };
        return acc;
      }, {}),
    }
  }

  init(tourConfig) {
    // Initialize the tour based on data file.
    this.setState({
      data: tourConfig,
      locationId: tourConfig.firstPhotoId,
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
                  source={{ uri: ambient.uri }}
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
                  source={{ uri: this.state.data.photos[params.id].uri }}
                />
                {tooltips && tooltips.map((tooltip, index) => {
                  // Iterate through items related to this location, creating either
                  // info buttons, which show tooltip on hover, or nav buttons, which
                  // change the current location in the tour.
                  if (tooltip.type) {
                    return(
                      <InfoButton
                        key={index}
                        onEnterSound={{ uri: soundEffects.infoButton.onEnter.uri }}
                        rotateY={tooltip.rotationY}
                        source={asset('info_icon.png')}
                        tooltip={tooltip}
                      />
                    );
                  }
                  return(
                    <NavButton
                      key={tooltip.linkedPhotoId}
                      isLoading={isLoading}
                      onClickSound={{ uri: soundEffects.navButton.onClick.uri }}
                      onEnterSound={{ uri: soundEffects.navButton.onEnter.uri }}
                      to={`/${tooltip.linkedPhotoId}`}
                      history={history}
                      rotateY={tooltip.rotationY}
                      source={asset(this.state.data.nav_icon)}
                      textLabel={tooltip.text}
                      translate={tooltip.translate}
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
