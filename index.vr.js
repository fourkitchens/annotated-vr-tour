'use strict';

import React, { Component } from 'react';
import { AppRegistry, asset, Image, Pano, Text, Sound, View } from 'react-vr';

import _ from 'lodash';
import Router from 'react-router/MemoryRouter';
import Route from 'react-router/Route';
import Redirect from 'react-router/Redirect';
import Waterwheel from 'waterwheel';
import relate from 'jsonapi-relate';

import hovertipDictionary from './src/components/lib/HovertipDictionary';
import NavButton from './src/components/NavButton';
import LoadingSpinner from './src/components/LoadingSpinner';

const config = {
  baseUrl: 'https://dev-vr-editor.pantheonsite.io',
  previewMode: false,
};

const waterwheel = new Waterwheel({
  base: config.baseUrl,
  accessCheck: false,
});

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends Component {
  state = {
    data: null,
    locationId: null,
    rotation: null,
  };

  componentDidMount() {
    this.getInitialData().then(this.init).then(() => {
      if (config.previewMode) {
        setInterval(this.getInitialData, 3000);
      }
    });
  }

  getInitialData = () => {
    return waterwheel.jsonapi
      .get('node/experience', {
        include: [
          'field_ambient',
          'field_button_onclick_sound',
          'field_button_onenter_sound',
          'field_ambient',
          'field_scenes',
          'field_initial_scene',
          'field_info_button',
          'field_navigation_button',
          'field_scenes.field_components',
          'field_scenes.field_components.field_scene_link',
          'field_scenes.field_components.field_image',
          'field_scenes.field_components.field_component_sound',
          'field_scenes.field_photosphere',
        ].join(','),
      })
      .then(this.normalizeExperience);
  };

  normalizeExperience = data => {
    const experience = data.data[0];
    const onEnter = relate.getRelationship(
      data,
      experience,
      'field_button_onenter_sound'
    );
    const onClick = relate.getRelationship(
      data,
      experience,
      'field_button_onclick_sound'
    );
    const ambientSound = relate.getRelationship(
      data,
      experience,
      'field_ambient'
    );
    const initialScene = relate.getRelationship(
      data,
      experience,
      'field_initial_scene'
    );
    const navButtonIcon = relate.getRelationship(
      data,
      experience,
      'field_navigation_button'
    );
    const infoButtonIcon = relate.getRelationship(
      data,
      experience,
      'field_info_button'
    );
    const scenes = relate.getRelationship(data, experience, 'field_scenes');
    return {
      nav_icon: `${config.baseUrl}${navButtonIcon.attributes.url}`,
      info_icon: `${config.baseUrl}${infoButtonIcon.attributes.url}`,
      firstPhotoId: initialScene.attributes.field_slug,
      firstPhotoRotation: 150,
      soundEffects: {
        navButton: {
          onEnter: {
            uri: `${config.baseUrl}${onEnter.attributes.url}`,
          },
          onClick: {
            uri: `${config.baseUrl}${onClick.attributes.url}`,
          },
        },
        infoButton: {
          onEnter: {
            uri: `${config.baseUrl}${onEnter.attributes.url}`,
          },
        },
        ambient: {
          uri: `${config.baseUrl}${ambientSound.attributes.url}`,
          loop: true,
          volume: 0.50,
        },
      },
      photos: scenes.reduce((acc, scene) => {
        const sceneImage = relate.getRelationship(
          data,
          scene,
          'field_photosphere'
        );
        const components = relate.getRelationship(
          data,
          scene,
          'field_components'
        );
        acc[scene.attributes.field_slug] = {
          rotationOffset: scene.attributes.field_rotation_offset || 0,
          uri: `${config.baseUrl}${sceneImage.attributes.url}`,
          tooltips: components.map(component => {
            const componentImage = relate.getRelationship(
              data,
              component,
              'field_image'
            );
            const source = componentImage
              ? `${config.baseUrl}${componentImage.attributes.url}`
              : null;
            const componentSound = relate.getRelationship(
              data,
              component,
              'field_component_sound'
            );
            const sound = componentSound
              ? `${config.baseUrl}${componentSound.attributes.url}`
              : null;
            const componentLink = relate.getRelationship(
              data,
              component,
              'field_scene_link'
            );
            const linkedPhotoId = componentLink
              ? componentLink.attributes.field_slug
              : null;
            return {
              id: component.id,
              type: component.attributes.field_component_type,
              width: 2,
              height: 2,
              rotationY: component.attributes.field_rotation || 0,
              translate: [
                component.attributes.field_x || 0,
                component.attributes.field_y || 0,
                component.attributes.field_z || 0,
              ],
              title: component.attributes.title,
              text: component.attributes.field_body,
              source,
              sound,
              linkedPhotoId,
            };
          }),
        };
        return acc;
      }, {}),
    };
  };

  init = tourConfig => {
    // Initialize the tour based on data file.
    this.setState({
      data: tourConfig,
      locationId: tourConfig.firstPhotoId,
      rotation: tourConfig.firstPhotoRotation +
        (tourConfig.photos[tourConfig.firstPhotoId].rotationOffset || 0),
    });
  };

  render() {
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData =
      (locationId && this.state.data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation =
      this.state.data.firstPhotoRotation +
      ((photoData && photoData.rotationOffset) || 0);
    const soundEffects = this.state.data.soundEffects;
    const ambient = this.state.data.soundEffects.ambient;

    return (
      <Router>
        <View>
          <Route
            path="/"
            exactly={true}
            render={() => <Redirect to={`/${this.state.data.firstPhotoId}`} />}
          />
          <Route
            path="/:id"
            render={({ match: { params }, history }) => {
              const isLoading = params.id !== locationId;
              return (
                <View>
                  {isLoading &&
                    <View
                      style={{
                        transform: [{ translateZ: -3 }],
                        layoutOrigin: [0, 0, 0],
                      }}
                      height={0.5}
                      width={0.5}
                    >
                      <LoadingSpinner />
                    </View>}
                  <View style={{ transform: [{ rotateY: rotation }] }}>
                    {ambient &&
                      <Sound
                        source={{ uri: ambient.uri }}
                        autoPlay={true}
                        loop={ambient.loop}
                        volume={ambient.volume}
                      />}
                    <Pano
                      style={{
                        position: 'absolute',
                        backgroundColor: isLoading ? 'grey' : 'white',
                      }}
                      onLoad={() => {
                        this.setState({
                          locationId: params.id,
                        });
                      }}
                      source={{ uri: this.state.data.photos[params.id].uri }}
                    />
                    {tooltips &&
                      tooltips.map((tooltip, index) => {
                        if (tooltip.type === 'link') {
                          return (
                            <NavButton
                              key={tooltip.linkedPhotoId}
                              isLoading={isLoading}
                              onClickSound={{
                                uri: soundEffects.navButton.onClick.uri,
                              }}
                              onEnterSound={{
                                uri: soundEffects.navButton.onEnter.uri,
                              }}
                              to={`/${tooltip.linkedPhotoId}`}
                              history={history}
                              translate={tooltip.translate}
                              rotateY={tooltip.rotationY}
                              source={{ uri: this.state.data.nav_icon }}
                              textLabel={tooltip.title}
                            />
                          );
                        }
                        const Hovertip = hovertipDictionary[tooltip.type];
                        return (
                          <Hovertip
                            key={tooltip.id}
                            onEnterSound={{
                              uri: soundEffects.infoButton.onEnter.uri,
                            }}
                            rotateY={tooltip.rotationY}
                            source={{ uri: this.state.data.info_icon }}
                            content={tooltip}
                          />
                        );
                      })}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </Router>
    );
  }
}

AppRegistry.registerComponent('AnnotatedVRTour', () => TourSample);
module.exports = TourSample;
