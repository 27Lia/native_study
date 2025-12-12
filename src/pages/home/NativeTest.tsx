import { useNative } from "../../hooks/useNative";
import React, { useState } from "react";

const NativeTest = () => {
  const {
    isNative,
    photos,
    contacts,
    openCamera,
    openGallery,
    getContacts,
    deletePhoto,
  } = useNative();

  const [activeTab, setActiveTab] = useState<"photos" | "contacts">("photos");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 헤더 */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Device Hub</h1>
        <p className="text-gray-500 mt-1">Manage your photos and contacts</p>
      </header>

      {/* 액션 버튼 */}
      <div className="flex justify-between mb-6 space-x-3">
        <button
          onClick={openCamera}
          disabled={!isNative}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 transition">
          Camera
        </button>
        <button
          onClick={openGallery}
          disabled={!isNative}
          className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 transition">
          Gallery
        </button>
        <button
          onClick={getContacts}
          disabled={!isNative}
          className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-600 transition">
          Contacts
        </button>
      </div>

      {/* 탭 */}
      <div className="flex bg-white rounded-xl shadow mb-6 overflow-hidden">
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex-1 py-3 text-center font-semibold transition ${
            activeTab === "photos"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500"
          }`}>
          Photos
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-3 text-center font-semibold transition ${
            activeTab === "contacts"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-500"
          }`}>
          Contacts
        </button>
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
                    src={photo.data}
                    alt=""
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full text-white hover:bg-red-600 transition text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-12">
              No photos yet. Start by taking a photo.
            </p>
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
          <p className="text-gray-400 text-center mt-12">
            No contacts yet. Import your contacts.
          </p>
        )}
      </main>
    </div>
  );
};

export default NativeTest;
