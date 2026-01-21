import { apiClient } from './client';

// API 응답 타입
interface ContentSearchApiResponse {
  id: number;
  title: string;
  author: string;
  posterUrl: string;
  year: number;
}

// 프론트엔드에서 사용하는 타입
export interface Content {
  contentId: string;
  title: string;
  imageUrl: string;
  year?: number;
  director?: string;
}

export const contentApi = {
  search: async (keyword: string): Promise<{ contents: Content[] }> => {
    const params = new URLSearchParams();
    params.append('keyword', keyword);

    const response = await apiClient.get<{ data: { contents: ContentSearchApiResponse[] } }>(`/search/contents?${params}`);

    // API 응답을 프론트엔드 타입으로 변환
    const contents = response.data.data.contents.map((item) => ({
      contentId: String(item.id),
      title: item.title,
      imageUrl: item.posterUrl,
      year: item.year,
      director: item.author,
    }));

    return { contents };
  },
};
