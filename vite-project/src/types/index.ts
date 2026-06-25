export interface StoryChapter {
  id: string;
  type: 'cover' | 'photo_text' | 'video' | 'letter';
  title: string;
  content: string;
  mediaUrl?: string;
  videoUrl?: string;
}

export interface CardData {
  recipient: string;
  sender: string;
  moment: string;
  message: string;
  theme: string;
  music: string;
  story: StoryChapter[];
}

export interface UploadedPhoto {
  localId: string;
  file: File;
  previewUrl: string;
  uploadedId: string | null;
  fileUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface UploadedMusicFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  previewUrl?: string;
}
