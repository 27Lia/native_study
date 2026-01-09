import React, { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import type { RecommendedPlace } from "./index";

interface Props {
  onComplete: (places: RecommendedPlace[]) => void;
  onBack: () => void;
}

const FatigueCheck: React.FC<Props> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<"ready" | "capturing" | "analyzing">(
    "ready",
  );
  const [photo, setPhoto] = useState<string | null>(null);

  // RN에서 카메라 결과 받기
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "CAMERA_RESULT") {
          setPhoto(data.data);
          setStep("analyzing");

          // 외주사 API 호출 시뮬레이션 (나중에 실제 API로 교체)
          setTimeout(() => {
            const mockPlaces: RecommendedPlace[] = [
              {
                id: "place_01",
                name: "힐링 가든",
                latitude: 36.7458,
                longitude: 126.2986,
                markerImage: "https://via.placeholder.com/100",
                fatigueLevel: "high",
                description: "피로도가 높아 휴식이 필요한 공간",
              },
              {
                id: "place_02",
                name: "명상의 숲",
                latitude: 36.7468,
                longitude: 126.2996,
                markerImage: "https://via.placeholder.com/100",
                fatigueLevel: "high",
                description: "조용한 산책로와 명상 공간",
              },
            ];

            onComplete(mockPlaces);
          }, 2000);
        }
      } catch (error) {
        console.error("메시지 파싱 에러:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  const handleStartCamera = () => {
    setStep("capturing");

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_CAMERA" }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <button onClick={onBack} className="text-blue-600 font-semibold mb-4">
        ← 돌아가기
      </button>

      <div className="max-w-md mx-auto">
        {/* Ready */}
        {step === "ready" && (
          <div className="text-center space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                피로도 측정
              </h2>
              <p className="text-gray-600 mb-6">
                얼굴을 인식하여 피로도를 측정하고
                <br />
                맞춤 힐링 장소를 추천해드립니다
              </p>

              <button
                onClick={handleStartCamera}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                카메라 실행
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800 font-semibold mb-2">
                📸 촬영 가이드
              </p>
              <ul className="text-xs text-yellow-700 space-y-1 text-left">
                <li>• 밝은 곳에서 촬영해주세요</li>
                <li>• 얼굴이 정면으로 보이도록 해주세요</li>
                <li>• 안경이나 마스크는 벗어주세요</li>
              </ul>
            </div>
          </div>
        )}

        {/* Capturing */}
        {step === "capturing" && (
          <div className="text-center space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                카메라 실행 중...
              </h3>
              <p className="text-gray-600">사진을 촬영해주세요</p>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <div className="text-center space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              {photo && (
                <img
                  src={photo}
                  alt="촬영된 사진"
                  className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6"
                />
              )}

              <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                피로도 분석 중...
              </h3>
              <p className="text-gray-600">
                AI가 당신의 피로도를 분석하고 있습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FatigueCheck;
