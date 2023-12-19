export type ObjectString = Record<string, string>;

export type ValueOf<T> = T[keyof T];

export type ServerPageProps<Params = any, SearchParams = any> = {
  params: Params;
  searchParams: SearchParams;
};
