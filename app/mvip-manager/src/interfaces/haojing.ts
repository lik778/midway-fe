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

export interface UpyunGenTaskParams {
  fileMD5: string;
  fileSuffix: string;
}

export interface UploadParams {
  policy: string;
  signature: string;
}

