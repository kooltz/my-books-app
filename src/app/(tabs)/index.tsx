import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  ScanningResult,
  ScanningOptions,
} from "expo-camera";

export default function HomeScreen() {
  const [lastScannedCode, setLastScannedCoode] = useState("");
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<ScanningResult | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  useEffect(() => {
    const subscription = CameraView.onModernBarcodeScanned((event) => {
      setResult(event);
      console.log("!!!!!!!!!!");
      console.log(result);
      setLastScannedCoode(event.data);

      if (CameraView.isModernBarcodeScannerAvailable) {
        CameraView.dismissScanner();
      }
    });

    return () => subscription.remove();
  }, []);

  async function launchScanner() {
    var options: ScanningOptions = {
      barcodeTypes: ["qr", "ean13", "ean8", "code39", "code128"],
      isPinchToZoomEnabled: true,
      isGuidanceEnabled: true,
      isHighlightingEnabled: true,
    };
    if (CameraView.isModernBarcodeScannerAvailable) {
      await CameraView.launchScanner(options);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>바코드 스캐너 앱</Text>

      {lastScannedCode && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>최근 스캔 결과 :</Text>
          <Text style={styles.resultText}>{lastScannedCode}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          console.log("스캔 버튼 클릭");
          launchScanner();
        }}
      >
        <Text style={styles.floatingButtonText}>스캔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  resultContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 18,
  },
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    // justifyContent: "center",
    // alignItems: "center",
    right: 20,
    bottom: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 60,
  },
});
