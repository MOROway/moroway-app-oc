package de.moroway.oc;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class SysTools extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("exitApp")) {
            this.exitApp(action, callbackContext);
            return true;
        }
        return false;
    }

    private void exitApp(String action, CallbackContext callbackContext) {
        try {
            cordova.getActivity().finishAffinity();
            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(0);
        } catch (Exception exception) {
            StringWriter stringWriter = new StringWriter();
            exception.printStackTrace(new PrintWriter(stringWriter));
            callbackContext.error(stringWriter.toString());
        }
    }
}
