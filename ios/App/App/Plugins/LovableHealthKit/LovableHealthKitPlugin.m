// LovableHealthKitPlugin.m
// Objective-C registration for Capacitor plugin
#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(LovableHealthKitPlugin, "LovableHealthKit",
           CAP_PLUGIN_METHOD(requestAuthorization, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getStepCountLast7Days, CAPPluginReturnPromise);
)
