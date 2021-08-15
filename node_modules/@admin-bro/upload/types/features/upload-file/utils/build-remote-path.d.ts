import { BaseRecord, UploadedFile } from 'admin-bro';
import { UploadPathFunction } from '../types/upload-options.type';
/**
 * Creates a path to the file. Related to the given provider. If it is an AWS
 * path is related to the bucket.
 *
 * @param   {BaseRecord}  record
 * @param   {UploadedFile} file  uploaded file
 * @param   {UploadPathFunction}      [pathFunction]
 *
 * @return  {string}
 * @private
 */
export declare const buildRemotePath: (record: BaseRecord, file: UploadedFile, uploadPathFunction?: UploadPathFunction | undefined) => string;
