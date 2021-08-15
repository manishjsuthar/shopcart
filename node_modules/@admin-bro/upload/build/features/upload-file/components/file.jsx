"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// eslint-disable-next-line import/no-extraneous-dependencies
const design_system_1 = require("@admin-bro/design-system");
const admin_bro_1 = require("admin-bro");
const mime_types_type_1 = require("../types/mime-types.type");
const SingleFile = (props) => {
    const { name, path, mimeType, width } = props;
    if (path && path.length) {
        if (mimeType && mime_types_type_1.ImageMimeTypes.includes(mimeType)) {
            return <img src={path} style={{ maxHeight: width, maxWidth: width }} alt={name}/>;
        }
        if (mimeType && mime_types_type_1.AudioMimeTypes.includes(mimeType)) {
            return (<audio controls src={path}>
          Your browser does not support the
          <code>audio</code>
          <track kind="captions"/>
        </audio>);
        }
    }
    return (<design_system_1.Box>
      <design_system_1.Button as="a" href={path} ml="default" size="sm" rounded target="_blank">
        <design_system_1.Icon icon="DocumentDownload" color="white" mr="default"/>
        {name}
      </design_system_1.Button>
    </design_system_1.Box>);
};
const File = ({ width, record, property }) => {
    const { custom } = property;
    const path = admin_bro_1.flat.get(record === null || record === void 0 ? void 0 : record.params, custom.filePathProperty);
    if (!path) {
        return null;
    }
    const name = admin_bro_1.flat.get(record === null || record === void 0 ? void 0 : record.params, custom.fileNameProperty ? custom.fileNameProperty : custom.keyProperty);
    const mimeType = custom.mimeTypeProperty && admin_bro_1.flat.get(record === null || record === void 0 ? void 0 : record.params, custom.mimeTypeProperty);
    if (!property.custom.multiple) {
        return <SingleFile path={path} name={name} width={width} mimeType={mimeType}/>;
    }
    return (<>
      {path.map((singlePath, index) => (<SingleFile key={singlePath} path={singlePath} name={name[index]} width={width} mimeType={mimeType[index]}/>))}
    </>);
};
exports.default = File;
