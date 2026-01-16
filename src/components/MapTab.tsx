import { Navigation, Crosshair, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const MapTab = () => {
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  // 디버그 로그 추가 함수
  const addLog = (message: string) => {
    setDebugLog((prev) =>
      [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-10),
    ); // 최근 10개만
  };

  // RN에서 위치 정보 받기
  useEffect(() => {
    const handleMessage = (event: Event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data =
          typeof messageEvent.data === "string"
            ? JSON.parse(messageEvent.data) // 문자열이면 파싱
            : messageEvent.data; // 이미 객체면 그대로
        addLog(`메시지 받음: ${data.type}`);

        if (data.type === "LOCATION_RESULT") {
          addLog(`위치 성공: ${data.data.latitude}, ${data.data.longitude}`);

          setMyLocation({
            lat: data.data.latitude,
            lng: data.data.longitude,
          });
          setLoading(false);
        } else if (data.type === "LOCATION_ERROR") {
          addLog(`위치 에러: ${data.data}`);
          setLoading(false);
        }
      } catch (e) {
        console.error("메시지 파싱 에러:", e);
        addLog(`파싱 에러: ${e}`);
        setLoading(false);
      }
    };
    addLog("이벤트 리스너 등록");
    window.addEventListener("message", handleMessage as EventListener);
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage as EventListener);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  // RN에 위치 요청
  const getMyLocation = () => {
    setLoading(true);
    addLog("위치 요청 시작");

    if (window.ReactNativeWebView) {
      addLog("ReactNativeWebView 존재 - 메시지 전송");

      // RN에 위치 요청
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "GET_LOCATION" }),
      );
    } else {
      addLog("ReactNativeWebView 없음!");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 디버그 패널 - 개발용 */}
      <div className="bg-gray-900 text-green-400 rounded-2xl p-4 font-mono text-xs max-h-60 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-white">디버그 로그</p>
          <button
            onClick={() => setDebugLog([])}
            className="text-xs bg-gray-700 px-2 py-1 rounded">
            Clear
          </button>
        </div>
        {debugLog.length === 0 ? (
          <p className="text-gray-500">로그 없음</p>
        ) : (
          debugLog.map((log, i) => (
            <p key={i} className="border-b border-gray-800 py-1">
              {log}
            </p>
          ))
        )}
        {myLocation && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-yellow-400">현재 위치:</p>
            <p>Lat: {myLocation.lat}</p>
            <p>Lng: {myLocation.lng}</p>
          </div>
        )}
      </div>

      {/* 내 위치 버튼 */}
      <button
        onClick={getMyLocation}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-5 shadow-lg shadow-blue-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group">
        <div className="flex items-center justify-center gap-3">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Navigation className="w-6 h-6 group-active:scale-90 transition-transform" />
          )}
          <p className="font-bold text-lg">
            {loading ? "위치 찾는 중..." : "내 위치 찾기"}
          </p>
        </div>
      </button>

      {/* 지도 영역 - 구글맵 iframe */}
      {myLocation ? (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <iframe
            src={`https://maps.google.com/maps?q=${myLocation.lat},${myLocation.lng}&z=15&output=embed`}
            width="100%"
            title="map-view"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crosshair className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">위치를 찾아보세요</p>
          <p className="text-gray-500 text-sm">
            버튼을 눌러 현재 위치를
            <br />
            지도에서 확인할 수 있어요
          </p>
        </div> //
      )}
    </div>
  );
};

export default MapTab;
