export interface ExpandedImageItem {
  src: string;
  name: string;
}
export interface ExpandedImagePreview {
  images: ExpandedImageItem[];
  index: number;
}
export declare function buildExpandedImagePreview(
  images: ReadonlyArray<{
    id: string;
    name: string;
    previewUrl?: string;
  }>,
  selectedImageId: string,
): ExpandedImagePreview | null;
