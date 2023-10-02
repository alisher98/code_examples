// import React, { useRef } from 'react';
// import '../../styles/componentsStyles/customTable.scss';
// import 'antd/dist/antd.css';
// import { Tabs } from 'antd';
// import { formats, modules } from '../../components/EditorToolbar/EditorToolbar';
// import ReactQuill from 'react-quill';
// import Input from '../../components/Input/Input';
// const { TabPane } = Tabs;
//
// export const Tab = ({
//   showTable,
//   setRemoveImg,
//   setEditorValue,
//   editorValue,
//   setChangeEditorText,
//   currentPostValue,
//   id,
//   postTitle,
//   setPostTitle,
//   setEditingPost,
//   column,
//   trList,
// }) => {
//   const editorRef = useRef();
//
//   const changeFocus = (e) => {
//     if (e.key === 'Enter') {
//       editorRef.current.focus();
//     }
//   };
//
//   const getValueFromTable = (e, col, item) => {
//     console.log('e', e);
//     console.log('col', col);
//     console.log('item', item);
//     console.log('----------------');
//   };
//
//   const onChange = (e) => {
//     setEditorValue(e);
//   };
//
//   return (
//     <Tabs defaultActiveKey="1" animated={false} onTabClick={(e) => setChangeEditorText(e)}>
//       <TabPane
//         onClick={() => {
//           setRemoveImg(1);
//         }}
//         tab="Сообщение"
//         key="1"
//       >
//         <Input
//           className="post-title-input"
//           placeholder="Введите заголовок..."
//           onChange={(e) => {
//             setPostTitle(e.target.value);
//           }}
//           onKeyPress={changeFocus}
//           value={postTitle}
//         />
//         <ReactQuill
//           theme="snow"
//           value={editorValue || ''}
//           onChange={onChange}
//           placeholder={'Напишите пост...'}
//           modules={modules}
//           formats={formats}
//           ref={editorRef}
//         ></ReactQuill>
//         {showTable && (
//           <div className="cus_table_cont">
//             <table className="cus_table">
//               <tbody>
//                 {trList?.map((item) => (
//                   <tr key={item} className="cus_table__tr">
//                     {column?.map((col) => (
//                       <td key={col} className="cus_table__td">
//                         <input
//                           type="text"
//                           autoComplete="off"
//                           onChange={(e) => getValueFromTable(e.target.value, col, item)}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </TabPane>
//       <TabPane
//         onClick={() => {
//           setRemoveImg(2);
//           setChangeEditorText(true);
//         }}
//         tab="Превью"
//         key="2"
//       >
//         <div className="editor-box"></div>
//       </TabPane>
//       <TabPane onClick={() => setRemoveImg(3)} tab="Пуш" key="3">
//         <div className="editor-box"></div>
//       </TabPane>
//     </Tabs>
//   );
// };
