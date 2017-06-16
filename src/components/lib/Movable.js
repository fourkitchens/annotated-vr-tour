'use strict';

import React, { Component } from 'react';
import { Animated, View, VrButton, VrHeadModel } from 'react-vr';

// @TODO This should not be needed. Investigate new VrHeadModel API.
const X_ROTATION_ADJUSTMENT = 60;

/**
 * On enter the Hovertip fades in the WrappedComponent, and then fades it out
 * when the cursor leaves both the Tooltip and the WrappedComponent. If there is
 * no WrappedComponent, then just play the component sound.
 */
const Movable = WrappedComponent =>
  class extends Component {
    static defaultProps = {
      pickupDelay: 400,
      dragging: false,
      enabled: true,
    };

    state = {
      pickedUp: false,
      rotateY: this.props.rotateY,
      rotateX: this.props.rotateX,
    };

    componentWillReceiveProps(nextProp) {
      if (this.props.dragging && this.state.pickedUp) {
        const rotation = VrHeadModel.rotationOfHeadMatrix();
        this.setState(() => ({
          rotateY: rotation[1] * 180 / Math.PI,
          rotateX: rotation[0] * 180 / Math.PI,
        }));
      }
    }

    pickup = () => {
      this.setState(prevState => ({ pickedUp: true }));
    };

    drop = () => {
      if (this.state.pickedUp) {
        clearTimeout(this.dropTimeoutId);
        this.setState(prevState => ({ pickedUp: false }));
        clearTimeout(this.pickupTimeoutId);
        // Save new location
        if (this.props.persist) {
          return this.props.persist(
            this.props.content.id,
            this.state.rotateX,
            this.state.rotateY
          );
        }
      }
    };

    startPickUp = () => {
      if (!this.state.pickedUp) {
        this.pickupTimeoutId = setTimeout(() => {
          this.pickup();
        }, this.props.pickupDelay);
      }
    };

    stopPickup = () => {
      if (!this.state.pickedUp) {
        clearTimeout(this.pickupTimeoutId);
      }
    };

    render() {
      const { dragging, dropDelay, pickupDelay, ...props } = this.props;
      const transparent = 'rgba(255, 255, 255, 0.0)';
      const ringColor = 'rgba(18, 114, 24, 0.4)';
      const wrappedComponent = (
        <WrappedComponent
          {...props}
          rotateY={this.state.rotateY}
          rotateX={this.state.rotateX}
          ringColor={this.state.pickedUp ? ringColor : transparent}
        />
      );
      return this.props.enabled
        ? wrappedComponent
        : <VrButton
            onButtonPress={this.startPickUp}
            onButtonRelease={this.stopPickup}
            onClick={this.drop}
            ignoreLongClick={true}
            style={{
              layoutOrigin: [0.5, 0.5],
            }}
          >
            {wrappedComponent}
          </VrButton>;
    }
  };

export default Movable;
