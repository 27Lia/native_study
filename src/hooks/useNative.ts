import { useState, useEffect } from 'react';
import { Contact, Photo } from 'types';

export const useNative = () => {
  const [isNative, setIsNative] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // iOS 네이티브 체크
    const native = window.webkit?.messageHandlers !== undefined;
    setIsNative(native);

    // iOS → JS 콜백 등록
    window.photoCallback = (data) => {
      console.log('📸 사진 받음:', data);
      if (data.photo && data.fileName && data.size) {
        setPhotos(prev => [...prev, {
          id: Date.now(),
          data: data.photo,
          fileName: data.fileName,
          size: data.size
        }]);
      }
    };

    window.contactListCallback = (data) => {
      console.log('📇 연락처 받음:', data);
      if (data.status === 'success' && data.contacts) {
        setContacts(data.contacts.map((c: any, idx: number) => ({
          id: `${Date.now()}_${idx}`,
          givenName: c.givenName,
          familyName: c.familyName,
          phones: c.phones
        })));
      } else if (data.status === 'denied') {
        alert('연락처 접근 권한이 거부되었습니다.');
      }
    };

    window.appVersionCallback = (data) => {
      console.log('📱 앱 버전:', data);
      setAppVersion(data.version);
    };

    // 앱 버전 조회
    if (native) {
      window.webkit?.messageHandlers?.getAppVersion?.postMessage({});
    }

    // cleanup
    return () => {
      window.photoCallback = undefined;
      window.contactListCallback = undefined;
      window.appVersionCallback = undefined;
    };
  }, []);

  // JS → iOS 통신
  const sendMessage = (handler: string) => {
    if (window.webkit?.messageHandlers?.[handler as keyof typeof window.webkit.messageHandlers]) {
      (window.webkit.messageHandlers[handler as keyof typeof window.webkit.messageHandlers] as any).postMessage({});
    } else {
      alert('iOS 앱에서만 작동합니다!');
    }
  };

  const openCamera = () => sendMessage('openCamera');
  const openGallery = () => sendMessage('openGallery');
  const getContacts = () => sendMessage('getContacts');
  const openAppSettings = () => sendMessage('openAppSettings');



  return {
    isNative,
    photos,
    contacts,
    appVersion,
    openCamera,
    openGallery,
    getContacts,
    openAppSettings,
  };
};