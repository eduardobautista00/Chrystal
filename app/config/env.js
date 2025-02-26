import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyBs7Kfc_ulsMGoNn30Ty6eepRg8oshQoAg',
    oneSignalAppId: 'your_dev_onesignal_app_id',
    firebaseConfig: {
      apiKey: "AIzaSyB5L2U53ETPXvJvTkXFxnqu69Kz7P5y--k",
      authDomain: "chrystal-notif.firebaseapp.com",
      projectId: "chrystal-notif",
      storageBucket: "chrystal-notif.firebasestorage.app",
      messagingSenderId: "920742407565",
      appId: "1:920742407565:android:2ecdb166da8f3dd3ad21c4"
    }
  },
  staging: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyBs7Kfc_ulsMGoNn30Ty6eepRg8oshQoAg',
    oneSignalAppId: 'your_staging_onesignal_app_id',
    firebaseConfig: {
      apiKey: "AIzaSyB5L2U53ETPXvJvTkXFxnqu69Kz7P5y--k",
      authDomain: "chrystal-notif.firebaseapp.com",
      projectId: "chrystal-notif",
      storageBucket: "chrystal-notif.firebasestorage.app",
      messagingSenderId: "920742407565",
      appId: "1:920742407565:android:2ecdb166da8f3dd3ad21c4"
    }
  },
  prod: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyBs7Kfc_ulsMGoNn30Ty6eepRg8oshQoAg',
    oneSignalAppId: 'your_prod_onesignal_app_id',
    firebaseConfig: {
      apiKey: "AIzaSyB5L2U53ETPXvJvTkXFxnqu69Kz7P5y--k",
      authDomain: "chrystal-notif.firebaseapp.com",
      projectId: "chrystal-notif",
      storageBucket: "chrystal-notif.firebasestorage.app",
      messagingSenderId: "920742407565",
      appId: "1:920742407565:android:2ecdb166da8f3dd3ad21c4"
    }
  },
  
};

const getEnvVars = (env = "staging") => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;