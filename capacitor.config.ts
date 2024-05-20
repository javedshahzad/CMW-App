import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.covermywork.prod',
  appName: 'coverMyWork',
  webDir: 'www',
  plugins: {
	  SplashScreen: {
		showSpinner: false,
		launchShowDuration:7000,
		launchAutoHide: true,
		spinnerColor: "#f53d3d",
		splashFullScreen: true
	  },
	  PushNotifications: {
		presentationOptions: ["badge", "sound", "alert"]
	  }
	},
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      AndroidPersistentFileLocation: 'Compatibility',
    }
  }
};

export default config;
