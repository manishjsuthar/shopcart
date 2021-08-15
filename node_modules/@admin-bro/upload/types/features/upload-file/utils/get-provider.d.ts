import { BaseProvider } from '../providers';
import { UploadOptions, AvailableDefaultProviders } from '../types/upload-options.type';
export declare type GetProviderReturn = {
    name: AvailableDefaultProviders;
    provider: BaseProvider;
};
export declare const getProvider: (options: UploadOptions['provider']) => GetProviderReturn;
