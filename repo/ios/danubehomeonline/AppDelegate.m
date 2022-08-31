#import "AppDelegate.h"


#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <CodePush/CodePush.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTI18nUtil.h> 
#import <Smartech/Smartech.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotificationsUI/UserNotificationsUI.h>
#import <GoogleMaps/GoogleMaps.h>
#import <RNCAsyncStorage/RNCAsyncStorage.h>
#import <React/RCTBridge.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <React/RCTLinkingManager.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate {
//  __weak RCTBridge *_bridge;
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//  NSURL *jsCodeLocation;
  NSString *objLANGUAGE = [[NSUserDefaults standardUserDefaults]
      stringForKey:@"LANGUAGE"];
  
  NSString *language = [[NSLocale preferredLanguages] objectAtIndex:0];
  
  if(objLANGUAGE != nil){

    if ([objLANGUAGE isEqualToString:@"ar"])
    {
      [[RCTI18nUtil sharedInstance] allowRTL:YES];
      [[RCTI18nUtil sharedInstance] forceRTL:YES];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:YES];
      
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 11 %@", objLANGUAGE);
    }
    else
    {
      [[RCTI18nUtil sharedInstance] allowRTL:NO];
      [[RCTI18nUtil sharedInstance] forceRTL:NO];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:NO];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 22 %@", objLANGUAGE);
    }
  }
  else
  {
    if ([language rangeOfString:@"ar"].location == NSNotFound) {
      [[RCTI18nUtil sharedInstance] allowRTL:NO];
      [[RCTI18nUtil sharedInstance] forceRTL:NO];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:NO];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 33 %@", language);
    } else {
      
      [[RCTI18nUtil sharedInstance] allowRTL:YES];
      [[RCTI18nUtil sharedInstance] forceRTL:YES];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:YES];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 44 %@", language);
    }
  }
  
  [GMSServices provideAPIKey:@"AIzaSyAJpb9bzOPTpz2oCW6buXlLgbe94FqHa2A"];
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"danubehomeonline" initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }
  
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  if (@available(iOS 13.0, *)) {
        rootView.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
    }
  
  
  [FIRApp configure];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                         didFinishLaunchingWithOptions:launchOptions];
  
  [[Smartech sharedInstance] initSDKWithDelegate:(id)self withLaunchOptions:launchOptions];
  [[Smartech sharedInstance] registerForPushNotificationWithDefaultAuthorizationOptions];
  // [[Smartech sharedInstance] registerForPushNotificationWithAuthorizationOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound)];
  [[Smartech sharedInstance] setDebugLevel:SMTLogLevelVerbose];
  [[Smartech sharedInstance] trackAppInstallUpdateBySmartech];


  // NSString *deviceType = [UIDevice currentDevice].model;
  // UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectZero];
  // NSString *oldAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
  // NSString *newAgent = [oldAgent stringByAppendingString:@" MYAPPNAME - iOS - "];
  // newAgent = [newAgent stringByAppendingString:deviceType];
  // NSDictionary *dictionnary = [[NSDictionary alloc] initWithObjectsAndKeys:newAgent, @"UserAgent", nil];
  // [[NSUserDefaults standardUserDefaults] registerDefaults:dictionnary];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [[Smartech sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [[Smartech sharedInstance] didFailToRegisterForRemoteNotificationsWithError:error];
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

#pragma mark - UNUserNotificationCenterDelegate Methods
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [[Smartech sharedInstance] willPresentForegroundNotification:notification];
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  [[Smartech sharedInstance] didReceiveNotificationResponse:response];
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

@end
