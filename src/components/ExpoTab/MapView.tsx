import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { MapPin, Award } from "lucide-react";
import type { RecommendedPlace, Stamp } from "./index";

interface Props {
  places?: RecommendedPlace[];
  stamps?: Stamp[];
  onStampAdded?: (stamp: Stamp) => void;
}

// 네이버 지도 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

const MapView: React.FC<Props> = ({ stamps }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<RecommendedPlace | null>(
    null,
  );

  const places = useMemo(
    () => [
      {
        id: "place_01",
        name: "컬처관",
        latitude: 36.7458,
        longitude: 126.2986,
        markerImage: "https://via.placeholder.com/100",
        fatigueLevel: "high" as const,
        description: "설명",
      },
      {
        id: "place_02",
        name: "힐링스토어",
        latitude: 36.7468,
        longitude: 126.2996,
        markerImage: "https://via.placeholder.com/100",
        fatigueLevel: "medium" as const,
        description: "설명2",
      },
    ],
    [],
  );

  const isStamped = useCallback(
    (placeId: string) => {
      return stamps?.some((s) => s.id === placeId);
    },
    [stamps],
  );

  // 마커 생성 함수
  const createMarkers = useCallback(() => {
    if (!naverMapRef.current || !window.naver) return;

    // 기존 마커 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    places?.forEach((place, index) => {
      const stamped = isStamped(place.id);

      // 커스텀 마커 HTML
      const markerContent = `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
        ">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${stamped ? "#10b981" : "linear-gradient(135deg, #3b82f6, #8b5cf6)"};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            ${stamped ? "✓" : index + 1}
          </div>
          <div style="
            position: absolute;
            top: 45px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 4px 8px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            white-space: nowrap;
            font-size: 12px;
            font-weight: bold;
            color: #111;
          ">
            ${place.name}
          </div>
        </div>
      `;

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.latitude, place.longitude),
        map: naverMapRef.current,
        icon: {
          content: markerContent,
          anchor: new window.naver.maps.Point(20, 20),
        },
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        setSelectedPlace(place);

        // 지도 중심 이동
        naverMapRef.current.panTo(
          new window.naver.maps.LatLng(place.latitude, place.longitude),
        );
      });

      markersRef.current.push(marker);
    });
  }, [places, isStamped]);

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    // 기본 중심 좌표 (태안)
    const defaultCenter = new window.naver.maps.LatLng(36.7458, 126.2986);

    // 지도 생성
    const mapOptions = {
      center:
        places && places.length > 0
          ? new window.naver.maps.LatLng(
              places?.[0].latitude,
              places?.[0].longitude,
            )
          : defaultCenter,
      zoom: 14,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    naverMapRef.current = new window.naver.maps.Map(mapRef.current, mapOptions);

    // 마커 생성
    createMarkers();

    return () => {
      // 마커 정리
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [places, createMarkers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        당신에게 어울리는 꽃을 만나러 가보세요!!
      </h2>

      {places?.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">추천 장소가 없습니다</p>
          <p className="text-sm text-gray-400 mt-2">
            먼저 피로도 측정을 진행해주세요
          </p>
        </div>
      ) : (
        <>
          {/* 네이버 지도 */}
          <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
            <div
              ref={mapRef}
              className="w-full h-80"
              style={{ minHeight: "320px" }}
            />
          </div>

          {/* 장소 리스트 */}
          <div className="space-y-3">
            {places?.map((place, index) => {
              const stamped = isStamped(place.id);

              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`bg-white rounded-2xl p-5 shadow-md transition-all cursor-pointer hover:shadow-lg ${
                    selectedPlace?.id === place.id ? "ring-2 ring-blue-500" : ""
                  } ${stamped ? "border-2 border-green-400" : "border border-gray-200"}`}>
                  <div className="flex items-start gap-4">
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
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
