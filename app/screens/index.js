/* export { default as StartScreen } from "./StartScreen";
export { default as LoginScreen } from "./LoginScreen";
export { default as RegisterScreen } from "./RegisterScreen";
export { default as ResetPasswordScreen } from "./ResetPasswordScreen";
export { default as HomeScreen } from "./HomeScreen";
export { default as AboutScreen } from "./AboutScreen";
export { default as DashboardScreen } from "./DashboardScreen";
 */
 const screens = {};

const importScreens = (context) => {
  context.keys().forEach((key) => {
    if (key.includes('index.js')) return;
    
    const screenName = key
      .replace(/^\.\//, '')
      .replace(/\.(js|jsx)$/, '')
      .replace(/\//g, '_');
      
    screens[screenName] = context(key).default;
  });
};
// Dynamically import all screens from all subdirectories
const requireScreen = require.context('./', true, /\.(js|jsx)$/);
importScreens(requireScreen);

export const getScreens = () => {
  return Object.entries(screens).map(([name, Component]) => ({
    name,
    component: Component,
  }));
};

export default screens;

/* 

import React, { lazy } from 'react';
const screens = {};

const importScreens = (context) => {
  context.keys().forEach((key) => { 
    if (key.includes('index.js')) return;
    
    const screenName = key
      .replace(/^\.\//, '')
      .replace(/\.(js|jsx)$/, '')
      .replace(/\//g, '_');
    // console.log(context(key));
      screens[screenName] = lazy(() => {
        return context(key);
      });
  });
};
// Dynamically import all screens from all subdirectories
const requireScreen = require.context('./', true, /\.(js|jsx)$/);
importScreens(requireScreen);

export const getScreens = () => {
  return Object.entries(screens).map(([name, Component]) => ({
    name,
    component: Component,
  }));
};

export default screens;
 */