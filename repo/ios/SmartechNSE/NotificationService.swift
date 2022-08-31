import UserNotifications
import Smartech

class NotificationService: UNNotificationServiceExtension {
  
  let smartechServiceExtension = SMTNotificationServiceExtension()
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    //...
    if Smartech.sharedInstance().isNotification(fromSmartech:request.content.userInfo) {
     smartechServiceExtension.didReceive(request, withContentHandler: contentHandler)
 }
    //...
  }
  
  override func serviceExtensionTimeWillExpire() {
    //...
    smartechServiceExtension.serviceExtensionTimeWillExpire()
    //...
  }
}
