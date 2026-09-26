export type TemplateType = 'MALE' | 'FEMALE' | 'CHILD';
export type PublicationStatus = 'DRAFT' | 'PUBLISHED';
export type TributeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface MemorialMedia {
  id: string;
  memorialId: string;
  cloudinaryPublicId: string | null;
  url: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Tribute {
  id: string;
  memorialId: string;
  visitorName: string;
  message: string;
  status: TributeStatus;
  createdAt: string;
  updatedAt: string;
  memorial?: {
    id: string;
    fullName: string;
    slug: string;
  } | null;
}

export interface Memorial {
  id: string;
  slug: string;
  fullName: string;
  dateOfBirth: string;
  dateOfPassing: string;
  biography: string;
  lifeStory: string | null;
  mainPhotograph: string;
  serviceInformation: string | null;
  familyAcknowledgement: string | null;
  livestreamUrl: string | null;
  recordingUrl: string | null;
  templateType: TemplateType;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  media?: MemorialMedia[];
  tributes?: Tribute[];
  _count?: {
    tributes: number;
  };
}

export interface DashboardSummary {
  total: number;
  drafts: number;
  published: number;
  pendingTributes: number;
}
