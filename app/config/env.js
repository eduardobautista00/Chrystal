import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyAr9kfNHZVPuF9UelpQ-Vnu6F4jyCbuzYY',
    oneSignalAppId: 'your_dev_onesignal_app_id',
  },
  staging: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyAr9kfNHZVPuF9UelpQ-Vnu6F4jyCbuzYY',
    oneSignalAppId: 'your_staging_onesignal_app_id',
  },
  prod: {
    apiUrl: 'https://chrystal.seqinstitute.com/api',
    googleMapsApiKey: 'AIzaSyAr9kfNHZVPuF9UelpQ-Vnu6F4jyCbuzYY',
    oneSignalAppId: 'your_prod_onesignal_app_id',
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