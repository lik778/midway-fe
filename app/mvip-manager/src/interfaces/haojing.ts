export interface UpyunImgConfig {
  uploadUrl: string;
  uploadParams: UploadParams;
  vendorName: string;
  imageSuffix: string;
  fileKey: string;
  imageHost: string;
}

export interface UpyunVideoConfig {
  uploadUrl: string;
  uploadParams: UploadParams;
  vendorName: string;
  suffix: string;
  fileKey: string;
  host: string;
}

export interface UploadParams {
  policy: string;
  signature: string;
}

