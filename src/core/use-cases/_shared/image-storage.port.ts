export interface StoredImage {
  id: string;
  url: string;
}

export interface ImageStoragePort {
  save(buffer: Buffer, contentType: string, nomeOriginal?: string): Promise<StoredImage>;
  delete(id: string): Promise<void>;
}
