import React, { useState, useEffect, useRef } from "react";
import { User, Phone } from "lucide-react";
import type { RecommendedPlace } from "./index";

interface Props {
  onComplete?: (places: RecommendedPlace[]) => void;
}

interface VitalSigns {
  heartRate: number;
  breathing: number;
  stress: number;
  scanProgress: number;
}

const FatigueCheck: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<"scanning" | "analyzing">("scanning");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: 0,
    breathing: 0,
    stress: 0,
    scanProgress: 0,
  });

  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 마운트 시 바로 카메라 시작
  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "START_CAMERA" }),
      );
    }

    // Mock 데이터 생성 (개발용 - 나중에 실제 API로 교체)
    startMockScanning();

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // RN에서 카메라 프레임 받기
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "CAMERA_FRAME") {
          // 외주사 API 호출
          await analyzeVitalSigns(data.image);
        }
      } catch (error) {
        console.error("메시지 파싱 에러:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 외주사 API 호출 함수
  const analyzeVitalSigns = async (base64Image: string) => {
    try {
      const response = await fetch("https://외주사-api.com/analyze-vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          timestamp: Date.now(),
        }),
      });

      const result = await response.json();

      const newVitalSigns: VitalSigns = {
        heartRate: result.heartRate || 0,
        breathing: result.respiratoryRate || 0,
        stress: result.stressLevel || 0,
        scanProgress: result.faceDetectionProgress || 0,
      };

      setVitalSigns(newVitalSigns);
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };

  // Mock 데이터 생성 (개발용)
  const startMockScanning = () => {
    let progress = 0;

    scanIntervalRef.current = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 15);

      const newVitalSigns: VitalSigns = {
        heartRate: Math.floor(Math.random() * 30) + 60, // 60-90 BPM
        breathing: Math.floor(Math.random() * 8) + 12, // 12-20 회/분
        stress: Math.floor(Math.random() * 40) + 30, // 30-70%
        scanProgress: Math.floor(progress),
      };

      setVitalSigns(newVitalSigns);

      // 100% 도달 시 중지
      if (progress >= 100 && scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    }, 1000);
  };

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("이름과 전화번호를 입력해주세요");
      return;
    }

    setStep("analyzing");

    // 스캔 중지
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    // 로컬스토리지에 저장
    const userData = {
      name,
      phone,
      timestamp: new Date().toISOString(),
      vitalSigns,
    };
    localStorage.setItem(`fatigue_${Date.now()}`, JSON.stringify(userData));

    // RN에 카메라 종료 신호
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "STOP_CAMERA",
          data: userData,
        }),
      );
    }

    // 외주사 API 호출 (Mock)
    setTimeout(() => {
      const mockPlaces: RecommendedPlace[] = [
        {
          id: "place_01",
          name: "컬처관",
          latitude: 36.7458,
          longitude: 126.2986,
          markerImage: "https://via.placeholder.com/100",
          fatigueLevel: "high",
          description: "설명",
        },
        {
          id: "place_02",
          name: "힐링스토어",
          latitude: 36.7468,
          longitude: 126.2996,
          markerImage: "https://via.placeholder.com/100",
          fatigueLevel: "medium",
          description: "설명2",
        },
      ];
      onComplete && onComplete(mockPlaces);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {step === "scanning" ? (
        <div className="flex flex-col h-screen">
          {/* 화면의 60% 높이 */}
          <div className="h-[60vh] bg-transparent relative"></div>

          {/* 하단: 생체신호 + 입력폼 */}
          <div className="flex-1 bg-white p-6 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 text-center">
              현재 당신의 기분에 맞는 꽃을 알려드릴게요
            </h2>

            {/* 이름 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* 전화번호 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                휴대폰 번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-xxxx-xxxx"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* 확인 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={vitalSigns.scanProgress < 50}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              확인
            </button>
          </div>
        </div>
      ) : (
        // 분석 완료 화면
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            분석 완료! 문자전송, 일정시간 후 다음화면 전환?
          </h3>
        </div>
      )}
    </div>
  );
};

export default FatigueCheck;
