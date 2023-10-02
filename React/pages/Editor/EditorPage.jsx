import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/componentsStyles/editor.scss';
import ThemeBar from '../../components/ThemeBar/ThemeBar';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPageById } from '../../redux/actions/categoriesAction/categoriesAction';
import User from '../../components/User/User';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';

export const EditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    edit: [editorValue, setEditorValue],
    pageTitle: [pageTitle, setPageTitle],
  } = useOutletContext();
  const currentPage = useSelector((s) => s.categories.currentPageContent);
  const apiKey = process.env.REACT_APP_EDITOR_API_KEY;

  const [changeEditorText] = useState(null);
  const [beforeCopy, setBeforeCopy] = useState('');
  const [initialEditor, setInitialEditor] = useState(editorValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'undefined') {
      setLoading(true);
      dispatch(getPageById(id)).then((el) => {
        if (Object.keys(el).length) {
          setLoading(false);
          setEditorValue(el.body);
          setBeforeCopy(`/static-pages/${el.category}/page/${id}`);
          setInitialEditor(el.body);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (currentPage.length !== 0) {
      setPageTitle(currentPage.title);
    }
  }, [currentPage]);

  const getCopy = () => {
    const html = `<a href="#${beforeCopy}" target="_self">${pageTitle}</a>`;
    if (navigator.clipboard) {
      navigator.clipboard
        .write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })])
        .then(
          () => {
            toast.success(`Скопировано`);
          },
          (err) => {
            console.error(err);
            toast.error(`Ошибка`);
          }
        );
    } else if (window.clipboardData) {
      window.clipboardData.setData('text/html', html);
    }
  };

  useEffect(() => {
    console.log('init');
  }, []);

  const handleChange = (e) => {
    setEditorValue(e.target.getContent());
  };

  return (
    <div className="text-editor">
      <h2 className="text-editor__title">Редактирование контента</h2>
      {loading && <Spinner />}
      <div className="edit_title">
        <span>СООБЩЕНИЕ</span>
        <input
          type="text"
          placeholder="Введите заголовок..."
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
        />
      </div>
      <Editor
        onChange={handleChange}
        initialValue={initialEditor}
        apiKey={apiKey}
        init={{
          height: 500,
          menubar: true,
          plugins:
            'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons textarea forecolor backcolor',
          toolbar:
            'header fontfamily  | blocks | forecolor | bold italic underline| fontselect fontsizeselect formatselect | alignleft aligncenter alignright | numlist bullist table| insertfile image media link',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_upload_url: 'postAcceptor.php',
          automatic_uploads: false,
          selector: 'textarea',
          inline_boundaries_selector: 'a[href],code,b,i,strong,em',
          language: 'ru',
        }}
      />
      <div className="text-editor__bottom">
        <div className="text-editor__bottom_right">
          <div className="text-editor__phone">
            {currentPage && <h4 className="page-title">{currentPage.category.title}</h4>}
            <div className="text-editor__post-items">
              <div className="text-editor__post-item">
                <User />
                <h2 className="content-title">{pageTitle}</h2>
                <div
                  className={`text-editor__phone-content ql-editor ${changeEditorText === '2' && 'cut-post'
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: editorValue,
                  }}
                />
              </div>
            </div>
            <div className="theme-btn-wrapper">
              <ThemeBar />
            </div>
          </div>
          <div className="copy_link">
            <div className="copy_link_inner">
              {beforeCopy}
              <button onClick={() => getCopy()}>копировать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
