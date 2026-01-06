// Homepage.tsx
import MapTab from "@components/MapTab";
import NativeTab from "@components/NativeTab";
import QRTab from "@components/QRTab";
import { useEffect, useState } from "react";
import { Camera, Map, ScanLine } from "lucide-react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const Homepage = () => {
  const [activeTab, setActiveTab] = useState<"native" | "map" | "qr">("native");
  const [contacts, setContacts] = useState([]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (event: Event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data = JSON.parse(messageEvent.data);

        if (data.type === "CONTACTS_RESULT") {
          setContacts(data.data);
        }

        if (data.type === "CAMERA_RESULT") {
          setPhotos((prev) => [...prev, data.data]);
        }

        if (data.type === "GALLERY_RESULT") {
          setPhotos((prev) => [...prev, ...data.data]);
        }
      } catch (e) {
        console.error("메시지 파싱 에러:", e);
      }
    };

    window.addEventListener("message", handleMessage as EventListener);
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage as EventListener);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  const handleGetContacts = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "GET_CONTACTS" }),
      );
    }
  };

  const handleCamera = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_CAMERA" }),
      );
    }
  };

  const handleGallery = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_GALLERY" }),
      );
    }
  };

  const tabs = [
    { id: "native", label: "홈", icon: Camera },
    { id: "map", label: "지도", icon: Map },
    { id: "qr", label: "스캔", icon: ScanLine },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 - 고정 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="px-6 pt-safe">
          {/* 상단 상태바 영역 */}
          <div className="h-3"></div>

          {/* 헤더 컨텐츠 */}
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Native Features
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">모바일 네이티브 기능</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="px-4 pt-4 pb-safe">
        <div
          className={`transition-opacity duration-300 ${
            activeTab === "native" ? "opacity-100" : "opacity-0 hidden"
          }`}>
          {activeTab === "native" && (
            <NativeTab
              contacts={contacts}
              photos={photos}
              onCamera={handleCamera}
              onGallery={handleGallery}
              onGetContacts={handleGetContacts}
            />
          )}
        </div>

        <div
          className={`transition-opacity duration-300 ${
            activeTab === "map" ? "opacity-100" : "opacity-0 hidden"
          }`}>
          {activeTab === "map" && <MapTab />}
        </div>

        <div
          className={`transition-opacity duration-300 ${
            activeTab === "qr" ? "opacity-100" : "opacity-0 hidden"
          }`}>
          {activeTab === "qr" && <QRTab />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
