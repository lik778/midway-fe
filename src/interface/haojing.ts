export interface UpyunImgConfig {
  uploadUrl: string;
  uploadParams: UploadParams;
  vendorName: string;
  imageSuffix: string;
  fileKey: string;
  imageHost: string;
}

export interface UploadParams {
  policy: string;
  signature: string;
}
