// components/QRTab.tsx
import { Camera, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const QRTab = () => {
  const [scannedData, setScannedData] = useState<string>("");

  // RN에서 QR 스캔 결과 받기
  useEffect(() => {
    const handleMessage = (event: Event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data = JSON.parse(messageEvent.data);

        if (data.type === "QR_SCAN_RESULT") {
          const qrValue = data.data;
          setScannedData(qrValue);

          // URL이면 자동 이동
          if (qrValue.startsWith("http://") || qrValue.startsWith("https://")) {
            window.location.href = qrValue;
          }
        }
      } catch (e) {
        console.error("메시지 파싱 에러:", e);
      }
    };

    window.addEventListener("message", handleMessage as EventListener);
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage as EventListener);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  // RN에 QR 스캔 요청
  const handleQRScan = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_QR_SCANNER" }),
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* QR 스캔 버튼 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-gray-900 font-bold text-xl mb-2">QR 코드 스캔</h3>
        <p className="text-gray-500 text-sm mb-6">
          카메라로 QR 코드를 스캔해보세요
        </p>
        <button
          onClick={handleQRScan}
          className="w-full bg-blue-500 text-white rounded-xl p-4 font-semibold active:scale-95 transition-transform">
          스캔 시작
        </button>
      </div>

      {/* 스캔 결과 - URL이면 자동 이동, 아니면 표시 */}
      {scannedData && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-gray-900 font-bold">스캔 완료!</h3>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl mb-3">
            <p className="text-gray-900 font-medium break-all">{scannedData}</p>
          </div>

          <button
            onClick={() => setScannedData("")}
            className="w-full mt-3 text-gray-500 text-sm py-2 hover:text-gray-700">
            다시 스캔하기
          </button>
        </div>
      )}
    </div>
  );
};

export default QRTab;
