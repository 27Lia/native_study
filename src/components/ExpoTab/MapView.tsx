import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Award } from "lucide-react";
import type { RecommendedPlace, Stamp } from "./index";

interface Props {
  places: RecommendedPlace[];
  stamps: Stamp[];
  onStampAdded: (stamp: Stamp) => void;
  onBack: () => void;
}

const MapView: React.FC<Props> = ({ places, stamps, onStampAdded, onBack }) => {
  const [selectedPlace, setSelectedPlace] = useState<RecommendedPlace | null>(
    null,
  );

  // QR 스캔 결과 받기
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "QR_SCAN_RESULT") {
          // QR 코드 데이터로 장소 찾기
          const place = places.find((p) => p.id === data.data);

          if (place) {
            // 이미 스탬프 찍었는지 확인
            const alreadyStamped = stamps.some((s) => s.id === place.id);

            if (alreadyStamped) {
              alert("이미 방문한 장소입니다!");
              return;
            }

            // 스탬프 추가
            const newStamp: Stamp = {
              id: place.id,
              name: place.name,
              timestamp: new Date().toISOString(),
              qrData: data.data,
              latitude: place.latitude,
              longitude: place.longitude,
            };

            onStampAdded(newStamp);
            alert(`🎉 ${place.name} 스탬프를 획득했습니다!`);
          } else {
            alert("올바른 장소의 QR 코드가 아닙니다.");
          }
        }
      } catch (error) {
        console.error("메시지 파싱 에러:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [places, stamps, onStampAdded]);

  // QR 스캔 시작
  const handleQRScan = (place: RecommendedPlace) => {
    setSelectedPlace(place);

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_QR_SCANNER" }),
      );
    }
  };

  // 스탬프 찍었는지 확인
  const isStamped = (placeId: string) => {
    return stamps.some((s) => s.id === placeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <button onClick={onBack} className="text-blue-600 font-semibold mb-4">
        ← 돌아가기
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">추천 힐링 스팟</h2>

      {places.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">추천 장소가 없습니다</p>
          <p className="text-sm text-gray-400 mt-2">
            먼저 피로도 측정을 진행해주세요
          </p>
        </div>
      ) : (
        <>
          {/* 지도 영역 (네이버 지도 들어갈 자리) */}
          <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
              <div className="text-center">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">
                  네이버 지도가 여기 표시됩니다
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {places.length}개의 추천 장소
                </p>
              </div>

              {/* 임시 마커들 */}
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className="absolute bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{
                    top: `${30 + index * 20}%`,
                    left: `${40 + index * 15}%`,
                  }}>
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* 장소 리스트 */}
          <div className="space-y-3">
            {places.map((place, index) => {
              const stamped = isStamped(place.id);

              return (
                <div
                  key={place.id}
                  className={`bg-white rounded-2xl p-5 shadow-md transition-all ${
                    stamped
                      ? "border-2 border-green-400"
                      : "border border-gray-200"
                  }`}>
                  {/* 헤더 */}
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        stamped
                          ? "bg-green-500"
                          : "bg-gradient-to-br from-green-400 to-blue-500"
                      }`}>
                      {stamped ? <Award className="w-6 h-6" /> : index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {place.name}
                        </h3>
                        {stamped && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            완료
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {place.description}
                      </p>
                    </div>
                  </div>

                  {/* 위치 정보 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>
                      위도: {place.latitude.toFixed(4)}, 경도:{" "}
                      {place.longitude.toFixed(4)}
                    </span>
                  </div>

                  {/* QR 스캔 버튼 */}
                  <button
                    onClick={() => handleQRScan(place)}
                    disabled={stamped}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      stamped
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                    }`}>
                    {stamped ? "✓ 스탬프 획득 완료" : "QR 코드 스캔하기"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 하단 안내 */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-blue-900 font-semibold mb-2">
              💡 스탬프 획득 방법
            </p>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. 추천 장소를 방문하세요</li>
              <li>2. 장소에 있는 QR 코드를 찾으세요</li>
              <li>3. "QR 코드 스캔하기" 버튼을 눌러 스캔하세요</li>
              <li>4. 스탬프를 모아 특별한 혜택을 받으세요!</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
