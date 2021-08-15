import { UploadedFile } from 'admin-bro';
import { BaseProvider } from './base-provider';
/**
 * Options required by the LocalAdapter
 *
 * @memberof module:@admin-bro/upload
 */
export declare type LocalUploadOptions = {
    /**
     * Path where files will be stored. For example: `path.join(__dirname, '../public')`
     */
    bucket: string;
};
export declare class LocalProvider extends BaseProvider {
    constructor(options: LocalUploadOptions);
    upload(file: UploadedFile, key: string): Promise<any>;
    delete(key: string, bucket: string): Promise<any>;
    path(key: string, bucket?: string): string;
}
