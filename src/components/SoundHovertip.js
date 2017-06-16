import React from 'react';
import { Text, View } from 'react-vr';
import Hovertip from './lib/Hovertip';
import Movable from './lib/Movable';

export const Sound = ({ content, settings }) => <View />;

export default Movable(Hovertip(Sound));
