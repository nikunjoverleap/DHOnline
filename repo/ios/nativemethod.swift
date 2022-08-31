//
//  openApplePayfort.swift
//  danubehomeonline
//
//  Created by iMac on 13/08/22.
//

import Foundation
import PayFortSDK

@objc(nativemethod)
class nativemethod: NSObject {
  
  @objc
  func openApplePayfort(_ indic: NSDictionary, withDoneCallback doneCallback: @escaping (RCTResponseSenderBlock), withCancelCallback cancelCallback: @escaping (RCTResponseSenderBlock)) {
    
    NSLog("Test")
    DispatchQueue.main.sync {
      

      let payFort = PayFortController.init(enviroment: .sandBox)
      
      let request = ["amount" : "1000",
                     "command" : "AUTHORIZATION",
                     "currency" : "AED",
                     "customer_email" : "rzghebrah@payfort.com",
                     "installments" : "",
                     "language" : "en",
                     "sdk_token" : "token"]
      
      
      if var topController = UIApplication.shared.keyWindow?.rootViewController {
        while let presentedViewController = topController.presentedViewController {
          topController = presentedViewController
          
          print("openApplePayfort 1")
        }
        
        // topController should now be your topmost view controller
        
        print("openApplePayfort 2")

        payFort.callPayFort(withRequest: request, currentViewController: topController,
                            success: { (requestDic, responeDic) in
          print("success")
          print("responeDic=\(responeDic)")
          print("responeDic=\(responeDic)")
          
        },
                            canceled: { (requestDic, responeDic) in
          print("canceled")
          print("responeDic=\(responeDic)")
          print("responeDic=\(responeDic)")
          
        },
                            faild: { (requestDic, responeDic, message) in
          print("faild")
          print("responeDic=\(responeDic)")
          print("responeDic=\(responeDic)")
        })
      }
    }
    
  }
  
}
