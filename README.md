#  MOROway App OC

The MOROway App OC ("Open Cordova") wrapper app brings the MOROway App to Android. MOROway App directory (moroway-app-oc/) and fastlane-changelogs (fastlane/metadata/android/*/changelogs/) are auto updated from the MOROway App [build tools](https://github.com/MOROway/moroway-app-dev).

## Download

Available at [F-Droid](https://f-droid.org/de/packages/de.moroway.oc/).

## Licenses

### MOROway App

* MOROway App OC: [Apache License 2.0](./LICENSE)
* MOROway App: [Apache License 2.0](https://github.com/MOROway/moroway-app-dev/blob/master/LICENSE)

### MOROway App: Included Open Source Projects

See [here](./moroway-app-oc/src/lib/README.md).

### MOROway App OC: Cordova Android development framework

Apache Cordova: [Apache License 2.0](https://github.com/apache/cordova-android/blob/master/LICENSE)

### MOROway App OC: Cordova Plugins

* cordova-plugin-dialogs: [Apache License 2.0](https://github.com/apache/cordova-plugin-dialogs/blob/master/LICENSE)
* cordova-plugin-insomnia: [MIT License](https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin/blob/master/README.md)
* cordova-plugin-splashscreen: [Apache License 2.0](https://github.com/apache/cordova-plugin-splashscreen/blob/master/LICENSE)
* cordova-plugin-whitelist: [Apache License 2.0](https://github.com/apache/cordova-plugin-whitelist/blob/master/LICENSE)
* cordova-webintent: [MIT License](https://github.com/cordova-misc/cordova-webintent/blob/master/README.md)

## Build

* Use Cordova-generated files located at platforms/android/ and build with gradle or
* Install Cordova, add platform Android and build with Cordova (requires Linux-based OS and Bash)