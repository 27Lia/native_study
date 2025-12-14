import { useNative } from "../../hooks/useNative";
import React, { useState } from "react";

const NativeTest = () => {
  const { isNative, photos, contacts, openCamera, openGallery, getContacts } =
    useNative();

  const [activeTab, setActiveTab] = useState<"photos" | "contacts">("photos");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 헤더 */}

      {/* 액션 버튼 */}
      <div className="flex justify-between mb-6 space-x-3">
        <button onClick={openCamera} disabled={!isNative} className="">
          카메라
        </button>
        <button onClick={openGallery} disabled={!isNative} className="">
          갤러리
        </button>
        <button onClick={getContacts} disabled={!isNative} className="">
          연락처
        </button>
      </div>

      {/* 탭 */}
      <div className="">
        <button onClick={() => setActiveTab("photos")}>사진</button>
        <button onClick={() => setActiveTab("contacts")}>연락처</button>
      </div>

      {/* 컨텐츠 */}
      <main>
        {activeTab === "photos" ? (
          photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition transform hover:scale-105">
                  <img
                    src={`data:image/jpeg;base64,${photo.data}`}
                    alt=""
                    className="w-48 h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-12">사진X</p>
          )
        ) : contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition">
                <p className="font-semibold text-gray-900">
                  {contact.familyName} {contact.givenName}
                </p>
                {contact.phones[0] && (
                  <p className="text-gray-400 mt-1">{contact.phones[0]}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-12">연락처X</p>
        )}
      </main>
    </div>
  );
};

export default NativeTest;
