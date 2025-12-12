import { useNative } from "../../hooks/useNative";
import React, { useState } from "react";

const NativeTest = () => {
  const {
    isNative,
    photos,
    contacts,
    appVersion,
    openCamera,
    openGallery,
    getContacts,
    openAppSettings,
    deletePhoto,
  } = useNative();

  const [activeTab, setActiveTab] = useState<"photos" | "contacts">("photos");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      {/* 헤더 */}
      <header className="bg-white/10 backdrop-blur-lg shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            📱 iOS Native Bridge
          </h1>
          <p className="text-center text-white/90 text-lg">
            {isNative ? "✅ iOS 네이티브 앱" : "⚠️ 웹 브라우저"}
          </p>
          {appVersion && (
            <p className="text-center text-white/80 text-sm mt-1">
              버전 {appVersion}
            </p>
          )}
        </div>
      </header>

      {/* 메인 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 기능 버튼들 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={openCamera}
            disabled={!isNative}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 disabled:hover:scale-100">
            <div className="text-5xl mb-2">📷</div>
            <div className="font-semibold">카메라</div>
          </button>

          <button
            onClick={openGallery}
            disabled={!isNative}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 disabled:hover:scale-100">
            <div className="text-5xl mb-2">🖼️</div>
            <div className="font-semibold">앨범</div>
          </button>

          <button
            onClick={getContacts}
            disabled={!isNative}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 disabled:hover:scale-100">
            <div className="text-5xl mb-2">📇</div>
            <div className="font-semibold">연락처</div>
          </button>

          <button
            onClick={openAppSettings}
            disabled={!isNative}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 disabled:hover:scale-100">
            <div className="text-5xl mb-2">⚙️</div>
            <div className="font-semibold">설정</div>
          </button>
        </div>

        {/* 안내 박스 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-purple-600 mb-4">
            💡 무료 계정으로 가능한 기능들
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 카메라 촬영 및 사진 선택</li>
            <li>✅ 연락처 접근</li>
            <li>✅ 앱 설정 열기</li>
            <li>✅ JavaScript ↔ Swift 양방향 통신</li>
            <li>❌ 푸시 알림 (유료 계정 필요)</li>
          </ul>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              activeTab === "photos"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}>
            📸 사진 ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              activeTab === "contacts"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}>
            📇 연락처 ({contacts.length})
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[400px]">
          {/* 사진 탭 */}
          {activeTab === "photos" && (
            <>
              {photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                      <img
                        src={photo.data}
                        alt={photo.fileName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="text-sm font-semibold truncate">
                            {photo.fileName}
                          </div>
                          <div className="text-xs opacity-80">
                            {formatSize(photo.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-lg">카메라로 사진을 촬영하거나</p>
                  <p className="text-lg">앨범에서 선택해보세요!</p>
                </div>
              )}
            </>
          )}

          {/* 연락처 탭 */}
          {activeTab === "contacts" && (
            <>
              {contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {contact.givenName.charAt(0)}
                        {contact.familyName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {contact.familyName}
                          {contact.givenName}
                        </h4>
                        <div className="space-y-1 mt-1">
                          {contact.phones.map((phone, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              📞 {phone}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="text-6xl mb-4">📇</div>
                  <p className="text-lg">연락처 버튼을 눌러</p>
                  <p className="text-lg">연락처를 불러오세요!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NativeTest;
