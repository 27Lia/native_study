// iOS 네이티브 타입 정의
export interface Photo {
  id: number;
  data: string;
  fileName: string;
  size: number;
}

export interface Contact {
  id: string;
  givenName: string;
  familyName: string;
  phones: string[];
}

// iOS WebKit 타입 확장
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        openCamera?: { postMessage: (data: any) => void };
        openGallery?: { postMessage: (data: any) => void };
        getContacts?: { postMessage: (data: any) => void };
      };
    };
    photoCallback?: (data: any) => void;
    contactListCallback?: (data: any) => void;
  }
}

export {};