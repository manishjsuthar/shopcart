import { S3 } from 'aws-sdk';
import { UploadedFile } from 'admin-bro';
import { BaseProvider } from './base-provider';
/**
 * AWS Credentials which can be set for S3 file upload.
 * If not given, 'aws-sdk' will try to fetch them from
 * environmental variables.
 * @memberof module:@admin-bro/upload
 */
export declare type AWSOptions = {
    /**
     * AWS IAM accessKeyId. By default its value is taken from AWS_ACCESS_KEY_ID env variable
    */
    accessKeyId?: string;
    /**
     * AWS IAM secretAccessKey. By default its value is taken from AWS_SECRET_ACCESS_KEY env variable
     */
    secretAccessKey?: string;
    /**
     * AWS region where your bucket was created.
    */
    region: string;
    /**
     * S3 Bucket where files will be stored
     */
    bucket: string;
    /**
     * indicates how long links should be available after page load (in minutes).
     * Default to 24h. If set to 0 adapter will mark uploaded files as PUBLIC ACL.
     */
    expires?: number;
};
export declare class AWSProvider extends BaseProvider {
    private s3;
    expires: number;
    constructor(options: AWSOptions);
    upload(file: UploadedFile, key: string): Promise<S3.ManagedUpload.SendData>;
    delete(key: string, bucket: string): Promise<S3.DeleteObjectOutput>;
    path(key: string, bucket: string): Promise<string>;
}
