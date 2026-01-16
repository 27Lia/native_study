import { Navigation, Crosshair, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const MapTab = () => {
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // RN에서 위치 정보 받기
  useEffect(() => {
    const handleMessage = (event: Event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data =
          typeof messageEvent.data === "string"
            ? JSON.parse(messageEvent.data) // 문자열이면 파싱
            : messageEvent.data; // 이미 객체면 그대로

        if (data.type === "LOCATION_RESULT") {
          setMyLocation({
            lat: data.data.latitude,
            lng: data.data.longitude,
          });
          setLoading(false);
        } else if (data.type === "LOCATION_ERROR") {
          setLoading(false);
        }
      } catch (e) {
        console.error("메시지 파싱 에러:", e);
        setLoading(false);
      }
    };
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

    if (window.ReactNativeWebView) {
      // RN에 위치 요청
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "GET_LOCATION" }),
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
