export class VideoUploadConfig {
  height?: number
  width?: number
  fileList?: any[]
  result?: any;
  results?: any[];
  number?: number;
  url?: string
  label? : string
  disabled?: boolean
  showUploadList?: {
    showPreviewIcon: boolean,
    showRemoveIcon: boolean,
    hidePreviewIconInNonImage: boolean
  }
  [propName: string]: any
}
