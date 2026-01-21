import { apiClient } from './client';

export interface Content {
  contentId: string;
  title: string;
  imageUrl: string;
  year?: number;
  director?: string;
}

export interface ContentSearchResponse {
  items: Content[];
  nextCursor: number | null;
  hasNext: boolean;
}

export const contentApi = {
  search: async (keyword: string) => {
    const params = new URLSearchParams();
    params.append('keyword', keyword);

    const response = await apiClient.get<{ data: { contents: Content[] } }>(`/search/contents?${params}`);
    return response.data.data;
  },
};
