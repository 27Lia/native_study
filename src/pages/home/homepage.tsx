import { Camera, Image, Users, Phone } from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const Homepage = () => {
  const [contacts, setContacts] = useState([]);

  // RN에서 메시지 받기
  useEffect(() => {
    const handleMessage = (event: Event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data = JSON.parse(messageEvent.data);
        if (data.type === "CONTACTS_RESULT") {
          setContacts(data.data);
        }
      } catch (e) {
        console.error("메시지 파싱 에러:", e);
      }
    };

    // Window message 이벤트
    window.addEventListener("message", handleMessage as EventListener);

    // Android용 document message (타입 캐스팅)
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage as EventListener);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  // 연락처 요청
  const handleGetContacts = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "GET_CONTACTS",
        }),
      );
    } else {
      alert("RN 앱에서만 작동합니다");
    }
  };

  // 카메라 열기
  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // 후면 카메라
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log("사진 찍음:", file);
        // 파일 처리 로직
      }
    };
    input.click();
  };

  // 갤러리 열기
  const handleGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true; // 여러 장 선택
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || []);
      console.log("갤러리에서 선택:", files);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* 헤더 */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-bold text-white mb-2">Native Features</h1>
        <p className="text-purple-200">모바일 네이티브 기능 테스트</p>
      </div>

      {/* 기능 버튼들 */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button
          onClick={handleCamera}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition active:scale-95">
          <Camera className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-white font-medium">카메라</p>
        </button>

        <button
          onClick={handleGallery}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition active:scale-95">
          <Image className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-white font-medium">갤러리</p>
        </button>

        {/* 연락처 버튼 */}
        <button
          onClick={handleGetContacts}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-white font-medium">연락처</p>
        </button>

        {/* 연락처 목록 */}
        {contacts.length > 0 && (
          <div className="mt-6 space-y-2">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="bg-white/10 p-4 rounded-lg">
                <p className="text-white">{contact.name}</p>
                <p className="text-purple-200 text-sm">{contact.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
