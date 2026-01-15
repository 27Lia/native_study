import React, { useState, useEffect, useRef } from "react";
import { Loader2, User, Phone } from "lucide-react";
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
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([]);
  const [breathingHistory, setBreathingHistory] = useState<number[]>([]);
  const [stressHistory, setStressHistory] = useState<number[]>([]);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraAreaRef = useRef<HTMLDivElement>(null);

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

      // 그래프 히스토리 업데이트
      setHeartRateHistory((prev) =>
        [...prev, newVitalSigns.heartRate].slice(-20),
      );
      setBreathingHistory((prev) =>
        [...prev, newVitalSigns.breathing].slice(-20),
      );
      setStressHistory((prev) => [...prev, newVitalSigns.stress].slice(-20));
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

      // 그래프 히스토리 업데이트
      setHeartRateHistory((prev) =>
        [...prev, newVitalSigns.heartRate].slice(-20),
      );
      setBreathingHistory((prev) =>
        [...prev, newVitalSigns.breathing].slice(-20),
      );
      setStressHistory((prev) => [...prev, newVitalSigns.stress].slice(-20));

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
          fatigueLevel: "medium",
          description: "조용한 산책로와 명상 공간",
        },
      ];
      onComplete && onComplete(mockPlaces);
    }, 2000);
  };

  // 그래프 그리기
  const drawGraph = (data: number[], color: string) => {
    if (data.length < 2) return null;

    const max = Math.max(...data, 1);
    const width = 100;
    const height = 60;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / max) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {step === "scanning" ? (
        <div className="flex flex-col h-screen">
          {/* 상단: 카메라 영역 - 크기 조절 */}
          <div className="h-[60vh] bg-black relative">
            {" "}
            {/* 화면의 60% 높이 */}
            {/* 카메라 플레이스홀더 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">카메라가 여기 표시됩니다</p>
            </div>
            {/* 스캔 진행률 오버레이 */}
            {vitalSigns.scanProgress > 0 && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex justify-between text-white text-xs mb-2">
                    <span>스캔 진행률</span>
                    <span className="font-bold">
                      {vitalSigns.scanProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${vitalSigns.scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* 안내 메시지 (스캔 50% 미만) */}
            {vitalSigns.scanProgress < 50 && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-center text-gray-800 font-medium">
                    📸 얼굴을 카메라에 맞춰주세요
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 하단: 생체신호 + 입력폼 */}
          <div className="flex-1 bg-white p-6 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 text-center">
              현재 당신의 기분에 맞는 꽃을 알려드릴게요
            </h2>

            {/* 생체신호 표시 (50% 이상) */}
            {vitalSigns.scanProgress >= 50 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* 맥박수 */}
                <div className="bg-red-50 rounded-xl p-3">
                  <div className="text-xs text-red-600 mb-1">심박</div>
                  <div className="h-12 mb-2">
                    {drawGraph(heartRateHistory, "#ef4444")}
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    {vitalSigns.heartRate}
                  </div>
                  <div className="text-xs text-gray-500">BPM</div>
                </div>

                {/* 호흡수 */}
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="text-xs text-blue-600 mb-1">호흡</div>
                  <div className="h-12 mb-2">
                    {drawGraph(breathingHistory, "#3b82f6")}
                  </div>
                  <div className="text-2xl font-bold text-blue-500">
                    {vitalSigns.breathing}
                  </div>
                  <div className="text-xs text-gray-500">회/분</div>
                </div>

                {/* 스트레스 */}
                <div className="bg-purple-50 rounded-xl p-3">
                  <div className="text-xs text-purple-600 mb-1">BPM</div>
                  <div className="h-12 mb-2">
                    {drawGraph(stressHistory, "#a855f7")}
                  </div>
                  <div className="text-2xl font-bold text-purple-500">
                    {vitalSigns.stress}
                  </div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
              </div>
            )}

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

            {/* 안내 문구 */}
            <p className="text-xs text-center text-gray-500">
              ※ 확인 클릭 시 개인정보 수집 및 이용에 동의하는 것으로 간주합니다
            </p>
          </div>
        </div>
      ) : (
        // 분석 완료 화면
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">분석 완료!</h3>
            <p className="text-gray-600">맞춤형 장소를 추천하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FatigueCheck;
