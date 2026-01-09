import React, { useState, useEffect } from "react";
import { Camera, MapPin, Award, Sparkles } from "lucide-react";
import FatigueCheck from "./FatigueCheck";
import StampCollection from "./StampCollection";
import MapView from "./MapView";

// 타입 정의
export interface Stamp {
  id: string;
  name: string;
  timestamp: string;
  qrData: string;
  latitude: number;
  longitude: number;
}

export interface RecommendedPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  markerImage: string;
  fatigueLevel: "low" | "medium" | "high";
  description?: string;
}

const ExpoTab = () => {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [places, setPlaces] = useState<RecommendedPlace[]>([]);
  const [currentView, setCurrentView] = useState<
    "home" | "fatigue" | "map" | "stamps"
  >("home");

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStamps = localStorage.getItem("expo_stamps");
    const storedPlaces = localStorage.getItem("expo_places");

    if (storedStamps) setStamps(JSON.parse(storedStamps));
    if (storedPlaces) setPlaces(JSON.parse(storedPlaces));
  };

  // 피로도 측정 완료 후 호출
  const handleFatigueComplete = (newPlaces: RecommendedPlace[]) => {
    setPlaces(newPlaces);
    localStorage.setItem("expo_places", JSON.stringify(newPlaces));
    setCurrentView("map");
  };

  // QR 스캔 완료 후 호출
  const handleStampAdded = (newStamp: Stamp) => {
    const updatedStamps = [...stamps, newStamp];
    setStamps(updatedStamps);
    localStorage.setItem("expo_stamps", JSON.stringify(updatedStamps));
  };

  // 뷰 전환
  if (currentView === "fatigue") {
    return (
      <FatigueCheck
        onComplete={handleFatigueComplete}
        onBack={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "map") {
    return (
      <MapView
        places={places}
        stamps={stamps}
        onStampAdded={handleStampAdded}
        onBack={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "stamps") {
    return (
      <StampCollection stamps={stamps} onBack={() => setCurrentView("home")} />
    );
  }

  // 홈 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="space-y-4">
        {/* 메인 헤더 */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">
              태안국제원예 치유박람회
            </h2>
          </div>
          <p className="text-white/90 text-sm">
            나만의 힐링 스탬프 투어를 시작하세요
          </p>
        </div>

        {/* 스탬프 현황 카드 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">획득한 스탬프</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stamps.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">총 장소</p>
              <p className="text-lg font-semibold text-blue-600">
                {places.length}
              </p>
            </div>
          </div>
        </div>

        {/* 기능 버튼들 */}
        <div className="space-y-3">
          {/* 피로도 측정 */}
          <button
            onClick={() => setCurrentView("fatigue")}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-blue-100 active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  피로도 측정하기
                </h3>
                <p className="text-sm text-gray-500">
                  얼굴 인식으로 맞춤 장소를 추천받아보세요
                </p>
              </div>
            </div>
          </button>

          {/* 추천 장소 보기 */}
          <button
            onClick={() => setCurrentView("map")}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-green-100 active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  추천 장소 보기
                </h3>
                <p className="text-sm text-gray-500">
                  {places.length > 0
                    ? `${places.length}개의 힐링 스팟`
                    : "피로도 측정 후 확인하세요"}
                </p>
              </div>
            </div>
          </button>

          {/* 스탬프 컬렉션 */}
          <button
            onClick={() => setCurrentView("stamps")}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-yellow-100 active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  스탬프 컬렉션
                </h3>
                <p className="text-sm text-gray-500">
                  {stamps.length > 0
                    ? `${stamps.length}개 수집 완료`
                    : "아직 수집한 스탬프가 없어요"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mt-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                이용 방법
              </p>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. 피로도 측정으로 나에게 맞는 장소를 추천받으세요</li>
                <li>2. 지도에서 추천 장소를 확인하세요</li>
                <li>3. 장소를 방문해서 QR 코드를 스캔하세요</li>
                <li>4. 스탬프를 모아 특별한 혜택을 받으세요!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpoTab;
