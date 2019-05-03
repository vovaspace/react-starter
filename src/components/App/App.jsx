import React from 'react';
import { cn as makeClassName } from '@bem-react/classname';

import './App.sass';

import Icon from '../Icon/Icon';
import imgLeopard from './img/leopard.jpg';

const cn = makeClassName('App');

export default function App() {
  return (
    <div className={cn()}>
      <Icon className={cn('Icon')} icon="react" />
      <h1 className={cn('Title')}>React App</h1>
      <h2 className={cn('Subtitle')}>It Works!</h2>
      <img
        src={imgLeopard}
        alt="Leopard"
        className={cn('Image')}
      />
    </div>
  );
}
