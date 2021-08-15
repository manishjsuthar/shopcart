"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimeTypes = exports.OtherMimeTypes = exports.FontMimeTypes = exports.BinaryDocsMimeTypes = exports.TextMimeTypes = exports.DocumentMimeTypes = exports.CompressedMimeTypes = exports.ImageMimeTypes = exports.VideoMimeTypes = exports.AudioMimeTypes = void 0;
exports.AudioMimeTypes = [
    'audio/aac',
    'audio/midi',
    'audio/x-midi',
    'audio/mpeg',
    'audio/ogg',
    'application/ogg',
    'audio/opus',
    'audio/wav',
    'audio/webm',
    'audio/3gpp2',
];
exports.VideoMimeTypes = [
    'video/x-msvideo',
    'video/mpeg',
    'video/ogg',
    'video/mp2t',
    'video/webm',
    'video/3gpp',
    'video/3gpp2',
];
exports.ImageMimeTypes = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/vnd.microsoft.icon',
    'image/tiff',
    'image/webp',
];
exports.CompressedMimeTypes = [
    'application/x-bzip',
    'application/x-bzip2',
    'application/gzip',
    'application/java-archive',
    'application/x-tar',
    'application/zip',
    'application/x-7z-compressed',
];
exports.DocumentMimeTypes = [
    'application/x-abiword',
    'application/x-freearc',
    'application/vnd.amazon.ebook',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-fontobject',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/rtf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
exports.TextMimeTypes = [
    'text/css',
    'text/csv',
    'text/html',
    'text/calendar',
    'text/javascript',
    'application/json',
    'application/ld+json',
    'text/javascript',
    'text/plain',
    'application/xhtml+xml',
    'application/xml',
    'text/xml',
];
exports.BinaryDocsMimeTypes = [
    'application/epub+zip',
    'application/pdf',
];
exports.FontMimeTypes = [
    'font/otf',
    'font/ttf',
    'font/woff',
    'font/woff2',
];
exports.OtherMimeTypes = [
    'application/octet-stream',
    'application/x-csh',
    'application/vnd.apple.installer+xml',
    'application/x-httpd-php',
    'application/x-sh',
    'application/x-shockwave-flash',
    'vnd.visio',
    'application/vnd.mozilla.xul+xml',
];
exports.MimeTypes = [
    ...exports.AudioMimeTypes,
    ...exports.VideoMimeTypes,
    ...exports.ImageMimeTypes,
    ...exports.CompressedMimeTypes,
    ...exports.DocumentMimeTypes,
    ...exports.TextMimeTypes,
    ...exports.BinaryDocsMimeTypes,
    ...exports.OtherMimeTypes,
    ...exports.FontMimeTypes,
    ...exports.OtherMimeTypes,
];
