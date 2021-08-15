import { RecordJSON, ActionContext } from 'admin-bro';
import { BaseProvider } from '../providers';
import { UploadOptionsWithDefault } from '../types/upload-options.type';
export declare const fillRecordWithPath: (record: RecordJSON, context: ActionContext, uploadOptionsWithDefault: UploadOptionsWithDefault, provider: BaseProvider) => Promise<RecordJSON>;
