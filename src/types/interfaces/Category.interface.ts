export interface CategoryLocaleSchema {
  language: string;
  value: string;
}

export interface Category {
  _id: string;
  name: string;
  parentId: number | null;
  ancestors: number[];
  hash?: string;
  locales: CategoryLocaleSchema[];
}
