package de.moroway.oc;

import java.io.PrintWriter;
import java.io.StringWriter;

import android.content.res.Configuration;
import android.os.Build;
import android.view.RoundedCorner;
import android.view.WindowInsets;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class SysTools extends CordovaPlugin {
    private Insets unsafeArea = Insets.NONE;
    private Insets boardUnsafeArea = Insets.NONE;

    @Override
    protected void pluginInitialize() {
        // The web app tracks the window focus by blur and focus events, which the web view does
        // not fire when another app takes the focus in split-screen
        cordova.getActivity().getWindow().getDecorView().getViewTreeObserver()
                .addOnWindowFocusChangeListener(hasFocus -> {
                    String type = hasFocus ? "focus" : "blur";
                    webView.getEngine().evaluateJavascript(
                            "window.dispatchEvent(new FocusEvent(\"" + type + "\"))", null);
                });
        // Android draws the app edge-to-edge: the game draws under the system bars and cutouts and
        // keeps its controls clear of them
        ViewCompat.setOnApplyWindowInsetsListener(webView.getView(), (view, insets) -> {
            unsafeArea = Insets.max(
                    insets.getInsets(WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout()),
                    getRoundedCornerUnsafeArea(insets));
            boardUnsafeArea = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            injectUnsafeArea();
            return insets;
        });
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        injectUnsafeArea();
    }

    @Override
    public Object onMessage(String id, Object data) {
        if ("onPageFinished".equals(id)) {
            injectUnsafeArea();
        }
        return null;
    }

    // Rounded screen corners hide the outer corner of a control along an edge and make it hard to
    // reach: keep it clear sideways by half the larger radius of the side's two corners (at the top
    // and bottom that would only lift it off the edge)
    private Insets getRoundedCornerUnsafeArea(WindowInsetsCompat insets) {
        WindowInsets windowInsets = insets.toWindowInsets();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S || windowInsets == null) {
            return Insets.NONE;
        }
        int[] positions = {RoundedCorner.POSITION_TOP_LEFT, RoundedCorner.POSITION_TOP_RIGHT,
                RoundedCorner.POSITION_BOTTOM_RIGHT, RoundedCorner.POSITION_BOTTOM_LEFT};
        double[] radii = new double[positions.length];
        for (int i = 0; i < positions.length; i++) {
            RoundedCorner corner = windowInsets.getRoundedCorner(positions[i]);
            radii[i] = (corner == null ? 0 : corner.getRadius()) * 0.5;
        }
        return Insets.of((int) Math.max(radii[0], radii[3]), 0,
                (int) Math.max(radii[1], radii[2]), 0);
    }

    // Pass the hidden edges in CSS pixels to the game, which reads them like its safe-area insets;
    // the board ignores the camera cutout
    private void injectUnsafeArea() {
        float density = cordova.getActivity().getResources().getDisplayMetrics().density;
        StringBuilder script = new StringBuilder();
        String[] names = {"unsafe-area", "board-unsafe-area"};
        Insets[] areas = {unsafeArea, boardUnsafeArea};
        for (int i = 0; i < names.length; i++) {
            String[] sides = {"top", "right", "bottom", "left"};
            int[] values = {areas[i].top, areas[i].right, areas[i].bottom, areas[i].left};
            for (int j = 0; j < sides.length; j++) {
                script.append("document.documentElement.style.setProperty(\"--").append(names[i])
                        .append("-").append(sides[j]).append("\", \"").append(values[j] / density)
                        .append("px\");");
            }
        }
        script.append("window.dispatchEvent(new Event(\"resize\"));");
        webView.getEngine().evaluateJavascript(script.toString(), null);
    }

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
