import { apiClient } from './client';

export interface ContentItem {
  contentId: string;
  isSpoiler: boolean;
  reason: string;
}

export interface CreateCollectionRequest {
  title: string;
  description: string;
  imageUrl?: string;
  isPublic: boolean;
  contentList: ContentItem[];
}

export interface Collection {
  collectionId: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface CollectionListResponse {
  items: Collection[];
  nextCursor: string | null;
  hasNext: boolean;
}

export const collectionApi = {
  create: async (data: CreateCollectionRequest) => {
    const response = await apiClient.post('/collections', data);
    return response.data;
  },

  getList: async (cursor?: string, size = 10) => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('size', size.toString());

    const response = await apiClient.get<{ data: CollectionListResponse }>(`/collections?${params}`);
    return response.data.data;
  },

  getDetail: async (collectionId: string) => {
    const response = await apiClient.get(`/collections/${collectionId}`);
    return response.data.data;
  },
};
