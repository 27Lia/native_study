// components/NativeTab.tsx
import { Camera, Image, Users, ImagePlus } from "lucide-react";

interface NativeTabProps {
  contacts: any[];
  photos: string[];
  onCamera: () => void;
  onGallery: () => void;
  onGetContacts: () => void;
}

const NativeTab = ({
  contacts,
  photos,
  onCamera,
  onGallery,
  onGetContacts,
}: NativeTabProps) => {
  return (
    <div className="space-y-4">
      {/* 기능 카드 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onCamera}
          className="bg-white rounded-3xl p-5 shadow-sm active:scale-95 transition-transform group">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-active:scale-90 transition-transform shadow-lg shadow-blue-500/30">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-900 font-semibold text-sm">카메라</p>
        </button>

        <button
          onClick={onGallery}
          className="bg-white rounded-3xl p-5 shadow-sm active:scale-95 transition-transform group">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-active:scale-90 transition-transform shadow-lg shadow-purple-500/30">
            <Image className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-900 font-semibold text-sm">갤러리</p>
        </button>

        <button
          onClick={onGetContacts}
          className="bg-white rounded-3xl p-5 shadow-sm active:scale-95 transition-transform group">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-active:scale-90 transition-transform shadow-lg shadow-green-500/30">
            <Users className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-900 font-semibold text-sm">연락처</p>
        </button>
      </div>

      {/* 사진 갤러리 */}
      {photos.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base">사진</h3>
                <p className="text-gray-500 text-xs">{photos.length}개</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={photo}
                  alt={`photo-${index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 연락처 목록 */}
      {contacts.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base">연락처</h3>
                <p className="text-gray-500 text-xs">{contacts.length}명</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {contacts.map((contact: any, index: number) => (
              <div
                key={contact.id}
                className="p-4 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold text-sm">
                      {contact.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {photos.length === 0 && contacts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImagePlus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">
            기능을 시작해보세요
          </p>
          <p className="text-gray-500 text-sm">
            위의 버튼을 눌러 사진을 찍거나
            <br />
            연락처를 불러올 수 있어요
          </p>
        </div>
      )}
    </div>
  );
};

export default NativeTab;
