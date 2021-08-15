import { FeatureType } from 'admin-bro';
import { BaseProvider } from './providers';
import UploadOptions from './types/upload-options.type';
export declare type ProviderOptions = Required<Exclude<UploadOptions['provider'], BaseProvider>>;
declare const uploadFileFeature: (config: UploadOptions) => FeatureType;
export default uploadFileFeature;
