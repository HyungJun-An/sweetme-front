import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function ReactQuillEditor({ style, value, onChange }) {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ header: '1' }, { header: '2' }],
    ],
  };

  return (
    <>
      <ReactQuill style={style} modules={modules} value={value} onChange={onChange} />
    </>
  );
}

export default ReactQuillEditor;
