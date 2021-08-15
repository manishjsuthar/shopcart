import { BulkActionResponse, After } from 'admin-bro/types/src';
import { BaseProvider } from '../providers';
import { UploadOptionsWithDefault } from '../types/upload-options.type';
export declare const deleteFilesFactory: (uploadOptionsWithDefault: UploadOptionsWithDefault, provider: BaseProvider) => After<BulkActionResponse>;
