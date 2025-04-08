export interface CategoryLocaleSchema {
  language: string;
  value: string;
}

export interface Category {
  _id: number;
  name: string;
  parentId: number | null;
  ancestors: number[];
  hash?: string;
  locales: CategoryLocaleSchema[];
  children?: Category[];
}
