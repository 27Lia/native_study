import React from "react";
import { Award, Calendar, MapPin, Sparkles } from "lucide-react";
import type { Stamp } from "./index";

interface Props {
  stamps: Stamp[];
  onBack: () => void;
}

const StampCollection: React.FC<Props> = ({ stamps, onBack }) => {
  // 날짜별로 그룹화
  const groupedStamps = stamps.reduce(
    (acc, stamp) => {
      const date = new Date(stamp.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(stamp);
      return acc;
    },
    {} as Record<string, Stamp[]>,
  );

  const dates = Object.keys(groupedStamps).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <button onClick={onBack} className="text-blue-600 font-semibold mb-4">
        ← 돌아가기
      </button>

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">스탬프 컬렉션</h2>
        </div>
        <p className="text-white/90 text-sm">
          지금까지 {stamps.length}개의 장소를 방문했어요!
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stamps.length}</p>
          <p className="text-xs text-gray-500">총 스탬프</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{dates.length}</p>
          <p className="text-xs text-gray-500">방문 일수</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {Math.min(stamps.length * 10, 100)}%
          </p>
          <p className="text-xs text-gray-500">달성률</p>
        </div>
      </div>

      {/* 스탬프 목록 */}
      {stamps.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">
            아직 수집한 스탬프가 없어요
          </p>
          <p className="text-sm text-gray-400 mt-2">
            추천 장소를 방문하고 QR 코드를 스캔해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {dates.map((date) => (
            <div key={date}>
              {/* 날짜 헤더 */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">{date}</p>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* 해당 날짜의 스탬프들 */}
              <div className="grid grid-cols-2 gap-3">
                {groupedStamps[date].map((stamp) => (
                  <div
                    key={stamp.id}
                    className="bg-white rounded-xl p-4 shadow-md border-2 border-green-200 hover:border-green-400 transition-all">
                    {/* 스탬프 아이콘 */}
                    <div className="bg-gradient-to-br from-green-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>

                    {/* 장소 이름 */}
                    <p className="font-bold text-gray-900 text-center mb-1">
                      {stamp.name}
                    </p>

                    {/* 시간 */}
                    <p className="text-xs text-gray-500 text-center">
                      {new Date(stamp.timestamp).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* 위치 정보 */}
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {stamp.latitude.toFixed(3)},{" "}
                        {stamp.longitude.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 달성 메시지 */}
      {stamps.length >= 10 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mt-6 text-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-white font-bold text-lg">🎉 축하합니다!</p>
          <p className="text-white/90 text-sm mt-1">
            10개 스탬프를 모두 수집했습니다!
          </p>
        </div>
      )}
    </div>
  );
};

export default StampCollection;
