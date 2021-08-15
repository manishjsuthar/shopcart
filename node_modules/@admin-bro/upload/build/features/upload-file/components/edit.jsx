"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const admin_bro_1 = require("admin-bro");
const design_system_1 = require("@admin-bro/design-system");
const Edit = ({ property, record, onChange }) => {
    const { params } = record;
    const { custom } = property;
    const path = admin_bro_1.flat.get(params, custom.filePathProperty);
    const key = admin_bro_1.flat.get(params, custom.keyProperty);
    const file = admin_bro_1.flat.get(params, custom.fileProperty);
    const [originalKey, setOriginalKey] = react_1.useState(key);
    const [filesToUpload, setFilesToUpload] = react_1.useState([]);
    react_1.useEffect(() => {
        // it means means that someone hit save and new file has been uploaded
        // in this case fliesToUpload should be cleared.
        // This happens when user turns off redirect after new/edit
        if ((typeof key === 'string' && key !== originalKey)
            || (typeof key !== 'string' && !originalKey)
            || (typeof key !== 'string' && Array.isArray(key) && key.length !== originalKey.length)) {
            setOriginalKey(key);
            setFilesToUpload([]);
        }
    }, [key, originalKey]);
    const onUpload = (files) => {
        setFilesToUpload(files);
        onChange(custom.fileProperty, files);
    };
    const handleRemove = () => {
        onChange(custom.fileProperty, null);
    };
    const handleMultiRemove = (singleKey) => {
        const index = (admin_bro_1.flat.get(record.params, custom.keyProperty) || []).indexOf(singleKey);
        const filesToDelete = admin_bro_1.flat.get(record.params, custom.filesToDeleteProperty) || [];
        if (path && path.length > 0) {
            const newPath = path.map((currentPath, i) => (i !== index ? currentPath : null));
            let newParams = admin_bro_1.flat.set(record.params, custom.filesToDeleteProperty, [...filesToDelete, index]);
            newParams = admin_bro_1.flat.set(newParams, custom.filePathProperty, newPath);
            onChange(Object.assign(Object.assign({}, record), { params: newParams }));
        }
        else {
            // eslint-disable-next-line no-console
            console.log('You cannot remove file when there are no uploaded files yet');
        }
    };
    return (<design_system_1.FormGroup>
      <design_system_1.Label>{property.label}</design_system_1.Label>
      <design_system_1.DropZone onChange={onUpload} multiple={custom.multiple} validate={{
        mimeTypes: custom.mimeTypes,
        maxSize: custom.maxSize,
    }} files={filesToUpload}/>
      {!custom.multiple && key && path && !filesToUpload.length && file !== null && (<design_system_1.DropZoneItem filename={key} src={path} onRemove={handleRemove}/>)}
      {custom.multiple && key && key.length && path ? (<>
          {key.map((singleKey, index) => {
        // when we remove items we set only path index to nulls.
        // key is still there. This is because
        // we have to maintain all the indexes. So here we simply filter out elements which
        // were removed and display only what was left
        const currentPath = path[index];
        return currentPath ? (<design_system_1.DropZoneItem key={singleKey} filename={singleKey} src={path[index]} onRemove={() => handleMultiRemove(singleKey)}/>) : '';
    })}
        </>) : ''}
    </design_system_1.FormGroup>);
};
exports.default = Edit;
