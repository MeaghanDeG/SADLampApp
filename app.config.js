export default ({ config }) => ({
  ...config,
  name: "SADLampApp",
  slug: "SADLampApp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app requires location access to provide accurate sunrise, sunset, and weather data."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    permissions: ["ACCESS_FINE_LOCATION"]
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
        "expo-sqlite",
       

    ]
    
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    weatherApiKey: "b9e24e87ee0051d4a02686595d4f5fe3" // OpenWeather API key
  }
});
