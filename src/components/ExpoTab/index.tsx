import React, { useState, useEffect } from "react";
import { Camera, MapPin, Sparkles } from "lucide-react";
import FatigueCheck from "./FatigueCheck";
import MapView from "./MapView";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    return <FatigueCheck onComplete={handleFatigueComplete} />;
  }

  if (currentView === "map") {
    return (
      <MapView
        places={places}
        stamps={stamps}
        onStampAdded={handleStampAdded}
      />
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
        </div>

        {/* 기능 버튼들 */}
        <div className="space-y-3">
          {/* 피로도 측정 */}
          <button
            onClick={() => navigate("/fatigueCheck")}
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
        </div>
      </div>
    </div>
  );
};

export default ExpoTab;
