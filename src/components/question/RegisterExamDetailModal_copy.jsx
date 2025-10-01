// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Spin,
//   message,
//   Form,
//   Input,
//   Button,
//   Select,
//   Row,
//   Col,
//   Radio,
//   Space,
//   Card,
// } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import hamChung from "../../services/service.hamChung.js";
// import hamChiTiet from "../../services/service.hamChiTiet.js";
// import {
//   getUserInfo,
//   setUserInfo,
//   clearUserInfo,
// } from "../../globals/globals.js";

// const { Option } = Select;

// const TeacherQuestionDetailModal = ({
//   visible,
//   maGV,
//   maMH,
//   trinhDo,
//   mode = "add", // "add" | "view" | "edit"
//   questionId, // Add questionId prop for edit mode
//   onCancel,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [gvOptions, setGvOptions] = useState([]);
//   const [monHocOptions, setMonHocOptions] = useState([]);
//   const [questions, setQuestions] = useState([]);

//   // Load danh sách GV + môn học
//   useEffect(() => {
//     if (!visible) return;
//     const fetchOptions = async () => {
//       try {
//         const gvs = await hamChung.getAll("giao_vien");
//         const monhocs = await hamChung.getAll("mon_hoc");
//         setGvOptions(gvs);
//         setMonHocOptions(monhocs);
//       } catch {
//         message.error("Lỗi tải dữ liệu giảng viên / môn học");
//       }
//     };
//     fetchOptions();
//   }, [visible]);

//   // Load danh sách câu hỏi hoặc câu hỏi cụ thể khi ở chế độ edit
//   // Load danh sách câu hỏi hoặc câu hỏi cụ thể khi ở chế độ edit
//   useEffect(() => {
//     if (!visible) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         let questionsWithChoices = [];

//         if ((mode === "edit" || mode === "view") && questionId) {
//           // Load câu hỏi cụ thể
//           const qDetail = await hamChiTiet.getQuestionWithChoicesByChoiceId(
//             questionId
//           );
//           questionsWithChoices = [qDetail];

//           form.setFieldsValue({
//             ma_gv: maGV,
//             ma_mh: maMH,
//             trinh_do: trinhDo,
//             noi_dung: qDetail.noi_dung,
//             loai: qDetail.loai,
//             dap_an_dung: qDetail.dap_an_dung,
//           });
//         } else {
//           // Load tất cả câu hỏi cho chế độ add/view
//           const res = await hamChung.getAll("cau_hoi");
//           const filtered = res.filter(
//             (q) =>
//               q.ma_gv === maGV && q.ma_mh === maMH && q.trinh_do === trinhDo
//           );
//           questionsWithChoices = await Promise.all(
//             filtered.map(async (q) => {
//               const qDetail = await hamChiTiet.getQuestionWithChoicesByChoiceId(
//                 q.id_ch
//               );
//               return qDetail;
//             })
//           );
//           form.setFieldsValue({ ma_gv: maGV, ma_mh: maMH, trinh_do: trinhDo });
//         }

//         setQuestions(questionsWithChoices);

//         // --- In ra console để kiểm tra ---
//         console.log("Danh sách câu hỏi + lựa chọn:", questionsWithChoices);
//       } catch (e) {
//         console.error(e);
//         message.error("Lỗi tải danh sách câu hỏi");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [visible, maGV, maMH, trinhDo, mode, questionId, form]);

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         id_ch: `tmp-${Date.now()}`,
//         noi_dung: "",
//         loai: "chon_1",
//         dap_an_dung: "",
//         chon_lua: [], // Không tự động tạo lựa chọn
//       },
//     ]);
//   };

//   const handleChangeQuestion = (id, field, value) => {
//     setQuestions((prev) =>
//       prev.map((q) => (q.id_ch === id ? { ...q, [field]: value } : q))
//     );
//   };

//   const handleAddChoice = (qid) => {
//     setQuestions((prev) =>
//       prev.map((q) =>
//         q.id_ch === qid
//           ? {
//               ...q,
//               chon_lua: [
//                 ...(q.chon_lua || []),
//                 { id: Date.now(), noi_dung: "" },
//               ],
//             }
//           : q
//       )
//     );
//   };

//   const handleInsertChoiceAfter = (qid, cid) => {
//     setQuestions((prev) =>
//       prev.map((q) =>
//         q.id_ch === qid
//           ? {
//               ...q,
//               chon_lua: q.chon_lua.flatMap((c) =>
//                 c.id === cid ? [c, { id: Date.now(), noi_dung: "" }] : [c]
//               ),
//             }
//           : q
//       )
//     );
//   };

//   const handleChangeChoice = (qid, cid, value) => {
//     setQuestions((prev) =>
//       prev.map((q) =>
//         q.id_ch === qid
//           ? {
//               ...q,
//               chon_lua: q.chon_lua.map((c) =>
//                 c.id === cid ? { ...c, noi_dung: value } : c
//               ),
//             }
//           : q
//       )
//     );
//   };

//   const handleDeleteChoice = (qid, cid) => {
//     setQuestions((prev) =>
//       prev.map((q) =>
//         q.id_ch === qid
//           ? { ...q, chon_lua: q.chon_lua.filter((c) => c.id !== cid) }
//           : q
//       )
//     );
//   };

//   const handleDeleteQuestion = (qid) => {
//     setQuestions((prev) => prev.filter((q) => q.id_ch !== qid));
//   };

//   // Validate trước khi lưu
//   const validateQuestions = () => {
//     for (const [i, q] of questions.entries()) {
//       if (!q.noi_dung.trim()) {
//         throw new Error(`Câu hỏi ${i + 1} chưa có nội dung`);
//       }
//       if (q.loai === "dien_khuyet" && !q.dap_an_dung.trim()) {
//         throw new Error(`Câu hỏi ${i + 1}: Điền khuyết chưa có đáp án`);
//       }
//       if (q.loai === "yes_no" && !q.dap_an_dung) {
//         throw new Error(`Câu hỏi ${i + 1}: Yes/No chưa chọn đáp án`);
//       }
//       if (q.loai === "chon_1") {
//         if (!q.chon_lua || q.chon_lua.length < 2) {
//           throw new Error(`Câu hỏi ${i + 1}: Cần ít nhất 2 lựa chọn`);
//         }
//         if (!q.dap_an_dung) {
//           throw new Error(`Câu hỏi ${i + 1}: Chưa chọn đáp án đúng`);
//         }
//         if (q.chon_lua.some((c) => !c.noi_dung.trim())) {
//           throw new Error(`Câu hỏi ${i + 1}: Có lựa chọn chưa có nội dung`);
//         }
//       }
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await form.validateFields();
//       validateQuestions();

//       setLoading(true);
//       for (const q of questions) {
//         const questionData = {
//           ...q,
//           ma_gv: maGV,
//           ma_mh: maMH,
//           trinh_do: trinhDo,
//         };
//         if (q.id_ch.toString().startsWith("tmp")) {
//           await hamChung.create("cau_hoi", questionData);
//         } else {
//           await hamChung.update("cau_hoi", q.id_ch, questionData);
//         }
//       }
//       message.success("Lưu danh sách câu hỏi thành công!");
//       onCancel();
//     } catch (e) {
//       message.error(e.message || "Có lỗi khi lưu dữ liệu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={mode === "edit" ? "Sửa câu hỏi" : "Quản lý Câu hỏi"}
//       open={visible}
//       onCancel={onCancel}
//       width={1000}
//       footer={[
//         <Button key="cancel" onClick={onCancel}>
//           Hủy
//         </Button>,
//         <Button
//           key="save"
//           type="primary"
//           onClick={handleSave}
//           loading={loading}
//         >
//           Lưu
//         </Button>,
//       ]}
//     >
//       {loading ? (
//         <Spin />
//       ) : (
//         <div>
//           {/* Giảng viên, Môn học, Trình độ */}
//           <Form form={form} layout="vertical">
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   label="Giảng viên"
//                   name="ma_gv"
//                   rules={[{ required: true, message: "Chưa chọn giảng viên" }]}
//                 >
//                   <Select disabled={true}>
//                     {gvOptions.map((gv) => (
//                       <Option key={gv.ma_gv} value={gv.ma_gv}>
//                         {gv.ho} {gv.ten}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="Môn học"
//                   name="ma_mh"
//                   rules={[{ required: true, message: "Chưa chọn môn học" }]}
//                 >
//                   <Select disabled={mode === "edit"}>
//                     {monHocOptions.map((mh) => (
//                       <Option key={mh.ma_mh} value={mh.ma_mh}>
//                         {mh.ten_mh}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="Trình độ"
//                   name="trinh_do"
//                   rules={[{ required: true, message: "Chưa chọn trình độ" }]}
//                 >
//                   <Select disabled={mode === "edit"}>
//                     <Option value="CĐ">CĐ</Option>
//                     <Option value="VB2">VB2</Option>
//                     <Option value="ĐH">ĐH</Option>
//                   </Select>
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>

//           {/* Danh sách câu hỏi */}
//           {questions.map((q, idx) => (
//             <Card
//               key={q.id_ch}
//               size="small"
//               title={`Câu hỏi ${idx + 1}`}
//               style={{ marginBottom: 12 }}
//               extra={
//                 mode !== "edit" && (
//                   <Button
//                     danger
//                     size="small"
//                     onClick={() => handleDeleteQuestion(q.id_ch)}
//                   >
//                     Xóa
//                   </Button>
//                 )
//               }
//             >
//               <Form layout="vertical">
//                 <Row gutter={16} align="middle">
//                   <Col flex="auto">
//                     <Form.Item label="Nội dung" required>
//                       <Input.TextArea
//                         rows={2}
//                         value={q.noi_dung}
//                         onChange={(e) =>
//                           handleChangeQuestion(
//                             q.id_ch,
//                             "noi_dung",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Nhập nội dung câu hỏi"
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col flex="200px">
//                     <Form.Item label="Loại câu hỏi" required>
//                       <Select
//                         value={q.loai}
//                         onChange={(v) => {
//                           handleChangeQuestion(q.id_ch, "loai", v);
//                           if (v !== "chon_1") {
//                             handleChangeQuestion(q.id_ch, "chon_lua", []);
//                           }
//                         }}
//                       >
//                         <Option value="chon_1">Nhiều chọn lựa</Option>
//                         <Option value="yes_no">Yes/No</Option>
//                         <Option value="dien_khuyet">Điền khuyết</Option>
//                       </Select>
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 {q.loai === "dien_khuyet" && (
//                   <Form.Item label="Đáp án đúng" required>
//                     <Input
//                       value={q.dap_an_dung}
//                       onChange={(e) =>
//                         handleChangeQuestion(
//                           q.id_ch,
//                           "dap_an_dung",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Nhập đáp án đúng"
//                     />
//                   </Form.Item>
//                 )}

//                 {q.loai === "yes_no" && (
//                   <Form.Item label="Đáp án đúng" required>
//                     <Radio.Group
//                       value={q.dap_an_dung}
//                       onChange={(e) =>
//                         handleChangeQuestion(
//                           q.id_ch,
//                           "dap_an_dung",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <Radio value="Yes">Yes</Radio>
//                       <Radio value="No">No</Radio>
//                     </Radio.Group>
//                   </Form.Item>
//                 )}

//                 {q.loai === "chon_1" && (
//                   <Form.Item label="Các lựa chọn (chọn 1 đáp án đúng)" required>
//                     <Radio.Group
//                       value={q.dap_an_dung}
//                       onChange={(e) =>
//                         handleChangeQuestion(
//                           q.id_ch,
//                           "dap_an_dung",
//                           e.target.value
//                         )
//                       }
//                       style={{ display: "block" }}
//                     >
//                       {(q.chon_lua || []).map((c) => (
//                         <Space
//                           key={c.id}
//                           style={{
//                             display: "flex",
//                             marginBottom: 8,
//                             alignItems: "flex-start",
//                             width: "100%",
//                           }}
//                           size={8}
//                         >
//                           <Radio value={c.id} style={{ marginTop: 8 }} />
//                           <Input.TextArea
//                             value={c.noi_dung}
//                             onChange={(e) =>
//                               handleChangeChoice(q.id_ch, c.id, e.target.value)
//                             }
//                             placeholder="Nhập nội dung lựa chọn"
//                             autoSize={{ minRows: 1, maxRows: 3 }}
//                           />
//                           <Button
//                             type="text"
//                             icon={<PlusOutlined />}
//                             onClick={() =>
//                               handleInsertChoiceAfter(q.id_ch, c.id)
//                             }
//                           />
//                           <Button
//                             type="text"
//                             danger
//                             icon={<DeleteOutlined />}
//                             onClick={() => handleDeleteChoice(q.id_ch, c.id)}
//                           />
//                         </Space>
//                       ))}
//                     </Radio.Group>

//                     <Button
//                       type="dashed"
//                       block
//                       icon={<PlusOutlined />}
//                       onClick={() => handleAddChoice(q.id_ch)}
//                     >
//                       Thêm lựa chọn (ở cuối)
//                     </Button>
//                   </Form.Item>
//                 )}
//               </Form>
//             </Card>
//           ))}

//           {mode !== "edit" && (
//             <Button type="dashed" block onClick={handleAddQuestion}>
//               + Thêm câu hỏi
//             </Button>
//           )}
//         </div>
//       )}
//     </Modal>
//   );
// };

// export default TeacherQuestionDetailModal;


import React, { useState, useEffect } from "react";
import {
  Modal,
  Spin,
  message,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Radio,
  Space,
  Card,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import hamChung from "../../services/service.hamChung.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";

const { Option } = Select;

const TeacherQuestionDetailModal = ({
  visible,
  maGV,
  maMH,
  trinhDo,
  mode = "add", // "add" | "view" | "edit"
  questionId,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [gvOptions, setGvOptions] = useState([]);
  const [monHocOptions, setMonHocOptions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Load danh sách GV + môn học
  useEffect(() => {
    if (!visible) return;
    const fetchOptions = async () => {
      try {
        const gvs = await hamChung.getAll("giao_vien");
        const monhocs = await hamChung.getAll("mon_hoc");
        setGvOptions(gvs);
        setMonHocOptions(monhocs);
      } catch {
        message.error("Lỗi tải dữ liệu giảng viên / môn học");
      }
    };
    fetchOptions();
  }, [visible]);

  // Load câu hỏi
  useEffect(() => {
    if (!visible) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let questionsWithChoices = [];

        if ((mode === "edit" || mode === "view") && questionId) {
          const qDetail = await hamChiTiet.getQuestionWithChoicesByChoiceId(
            questionId
          );
          questionsWithChoices = [qDetail];
        } else {
          const res = await hamChung.getAll("cau_hoi");
          const filtered = res.filter(
            (q) =>
              q.ma_gv === maGV && q.ma_mh === maMH && q.trinh_do === trinhDo
          );
          questionsWithChoices = await Promise.all(
            filtered.map(async (q) => {
              const qDetail = await hamChiTiet.getQuestionWithChoicesByChoiceId(
                q.id_ch
              );
              return qDetail;
            })
          );
        }

        setQuestions(questionsWithChoices);
        form.setFieldsValue({ ma_gv: maGV, ma_mh: maMH, trinh_do: trinhDo });
      } catch (e) {
        console.error(e);
        message.error("Lỗi tải danh sách câu hỏi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible, maGV, maMH, trinhDo, mode, questionId, form]);

  const handleAddQuestion = () => {
    const newQuestionId = `tmp-${Date.now()}`;
    setQuestions([
      ...questions,
      {
        id_ch: newQuestionId,
        noi_dung: "",
        loai: "chon_1",
        dap_an_dung: "",
        chon_lua: [
          { id_chon_lua: Date.now(), id_ch: newQuestionId, noi_dung: "" },
          { id_chon_lua: Date.now() + 1, id_ch: newQuestionId, noi_dung: "" },
        ],
      },
    ]);
  };

  const handleChangeQuestion = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id_ch === id ? { ...q, [field]: value } : q))
    );
  };

  const handleAddChoice = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id_ch === qid
          ? {
              ...q,
              chon_lua: [
                ...(q.chon_lua || []),
                { id_chon_lua: Date.now(), id_ch: qid, noi_dung: "" },
              ],
            }
          : q
      )
    );
  };

  const handleInsertChoiceAfter = (qid, cid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id_ch === qid
          ? {
              ...q,
              chon_lua: q.chon_lua.flatMap((c) =>
                c.id_chon_lua === cid
                  ? [c, { id_chon_lua: Date.now(), id_ch: qid, noi_dung: "" }]
                  : [c]
              ),
            }
          : q
      )
    );
  };

  const handleChangeChoice = (qid, cid, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id_ch === qid
          ? {
              ...q,
              chon_lua: q.chon_lua.map((c) =>
                c.id_chon_lua === cid ? { ...c, noi_dung: value } : c
              ),
              dap_an_dung:
                q.dap_an_dung ===
                q.chon_lua.find((c) => c.id_chon_lua === cid)?.noi_dung
                  ? value
                  : q.dap_an_dung,
            }
          : q
      )
    );
  };

  const handleDeleteChoice = (qid, cid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id_ch === qid
          ? {
              ...q,
              chon_lua: q.chon_lua.filter((c) => c.id_chon_lua !== cid),
              dap_an_dung:
                q.chon_lua.find((c) => c.id_chon_lua === cid)?.noi_dung ===
                q.dap_an_dung
                  ? ""
                  : q.dap_an_dung,
            }
          : q
      )
    );
  };

  const handleDeleteQuestion = (qid) => {
    setQuestions((prev) => prev.filter((q) => q.id_ch !== qid));
  };

  const handleSave = async () => {
    try {
      // validate Form (GV, môn học, trình độ)
      await form.validateFields();

      // validate questions & choices
      for (const [idx, q] of questions.entries()) {
        if (!q.noi_dung || !q.noi_dung.trim()) {
          throw new Error(`Câu hỏi ${idx + 1}: Nội dung không được để trống`);
        }
        if (
          q.loai === "dien_khuyet" &&
          (!q.dap_an_dung || !q.dap_an_dung.trim())
        ) {
          throw new Error(
            `Câu hỏi ${idx + 1}: Đáp án điền khuyết không được để trống`
          );
        }
        if (q.loai === "yes_no" && !q.dap_an_dung) {
          throw new Error(`Câu hỏi ${idx + 1}: Chưa chọn đáp án Yes/No`);
        }
        if (q.loai === "chon_1") {
          if (!q.chon_lua || q.chon_lua.length < 2) {
            throw new Error(`Câu hỏi ${idx + 1}: Cần ít nhất 2 lựa chọn`);
          }
          if (!q.dap_an_dung) {
            throw new Error(`Câu hỏi ${idx + 1}: Chưa chọn đáp án đúng`);
          }
          if (!q.chon_lua.some((c) => c.noi_dung === q.dap_an_dung)) {
            throw new Error(`Câu hỏi ${idx + 1}: Đáp án đúng không hợp lệ`);
          }
          if (q.chon_lua.some((c) => !c.noi_dung || !c.noi_dung.trim())) {
            throw new Error(
              `Câu hỏi ${idx + 1}: Có lựa chọn không được để trống`
            );
          }
        }
      }

      setLoading(true);
      for (const q of questions) {
        const questionData = {
          ...q,
          ma_gv: maGV,
          ma_mh: maMH,
          trinh_do: trinhDo,
        };
        if (q.id_ch.toString().startsWith("tmp")) {
          console.log("Tạo mới câu hỏi:", questionData);
        } else {
          console.log("Cập nhật câu hỏi:", questionData);
        }
      }
      message.success("Lưu danh sách câu hỏi thành công!");
      //   onCancel();
    } catch (e) {
      message.error(e.message || "Chưa điền đủ thông tin bắt buộc!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Sửa câu hỏi" : "Quản lý Câu hỏi"}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          Lưu
        </Button>,
      ]}
    >
      {loading ? (
        <Spin />
      ) : (
        <div>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Giảng viên"
                  name="ma_gv"
                  rules={[{ required: true, message: "Chưa chọn giảng viên" }]}
                >
                  <Select disabled>
                    {gvOptions.map((gv) => (
                      <Option key={gv.ma_gv} value={gv.ma_gv}>
                        {gv.ho} {gv.ten}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Môn học"
                  name="ma_mh"
                  rules={[{ required: true, message: "Chưa chọn môn học" }]}
                >
                  <Select disabled={mode === "edit"}>
                    {monHocOptions.map((mh) => (
                      <Option key={mh.ma_mh} value={mh.ma_mh}>
                        {mh.ten_mh}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Trình độ"
                  name="trinh_do"
                  rules={[{ required: true, message: "Chưa chọn trình độ" }]}
                >
                  <Select disabled={mode === "edit"}>
                    <Option value="CĐ">CĐ</Option>
                    <Option value="VB2">VB2</Option>
                    <Option value="ĐH">ĐH</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {questions.map((q, idx) => (
            <Card
              key={q.id_ch}
              size="small"
              title={`Câu hỏi ${idx + 1}`}
              style={{ marginBottom: 12 }}
              extra={
                mode !== "view" && (
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDeleteQuestion(q.id_ch)}
                  >
                    Xóa
                  </Button>
                )
              }
            >
              <Form layout="vertical">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Form.Item
                      label="Nội dung"
                      required
                      validateStatus={!q.noi_dung.trim() ? "error" : ""}
                      help={
                        !q.noi_dung.trim()
                          ? "Nội dung câu hỏi không được để trống"
                          : ""
                      }
                    >
                      <Input.TextArea
                        rows={2}
                        value={q.noi_dung}
                        onChange={(e) =>
                          handleChangeQuestion(
                            q.id_ch,
                            "noi_dung",
                            e.target.value
                          )
                        }
                        placeholder="Nhập nội dung câu hỏi"
                      />
                    </Form.Item>
                  </Col>
                  <Col flex="200px">
                    <Form.Item label="Loại câu hỏi" required>
                      <Select
                        value={q.loai}
                        onChange={(v) => {
                          handleChangeQuestion(q.id_ch, "loai", v);
                          if (v !== "chon_1") {
                            handleChangeQuestion(q.id_ch, "chon_lua", []);
                            handleChangeQuestion(q.id_ch, "dap_an_dung", "");
                          }
                        }}
                      >
                        <Option value="chon_1">Nhiều chọn lựa</Option>
                        <Option value="yes_no">Yes/No</Option>
                        <Option value="dien_khuyet">Điền khuyết</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {q.loai === "dien_khuyet" && (
                  <Form.Item
                    label="Đáp án đúng"
                    required
                    validateStatus={!q.dap_an_dung.trim() ? "error" : ""}
                    help={
                      !q.dap_an_dung.trim()
                        ? "Đáp án điền khuyết không được để trống"
                        : ""
                    }
                  >
                    <Input
                      value={q.dap_an_dung}
                      onChange={(e) =>
                        handleChangeQuestion(
                          q.id_ch,
                          "dap_an_dung",
                          e.target.value
                        )
                      }
                      placeholder="Nhập đáp án đúng"
                    />
                  </Form.Item>
                )}

                {q.loai === "yes_no" && (
                  <Form.Item
                    label="Đáp án đúng"
                    required
                    validateStatus={!q.dap_an_dung ? "error" : ""}
                    help={!q.dap_an_dung ? "Chưa chọn đáp án Yes/No" : ""}
                  >
                    <Radio.Group
                      value={q.dap_an_dung}
                      onChange={(e) =>
                        handleChangeQuestion(
                          q.id_ch,
                          "dap_an_dung",
                          e.target.value
                        )
                      }
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}

                {q.loai === "chon_1" && (
                  <Form.Item
                    label="Các lựa chọn (chọn 1 đáp án đúng)"
                    required
                    validateStatus={
                      !q.dap_an_dung ||
                      (q.chon_lua || []).some((c) => !c.noi_dung.trim())
                        ? "error"
                        : ""
                    }
                    help={
                      !q.dap_an_dung
                        ? "Chưa chọn đáp án đúng"
                        : (q.chon_lua || []).some((c) => !c.noi_dung.trim())
                        ? "Có lựa chọn chưa nhập nội dung"
                        : ""
                    }
                  >
                    <Radio.Group
                      value={q.dap_an_dung}
                      onChange={(e) =>
                        handleChangeQuestion(
                          q.id_ch,
                          "dap_an_dung",
                          e.target.value
                        )
                      }
                      style={{ display: "block" }}
                    >
                      {(q.chon_lua || []).map((c, index) => (
                        <Space
                          key={`c_${q.id_ch}_${c.id_chon_lua}_${index}`}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                            alignItems: "flex-start",
                            width: "100%",
                          }}
                          size={8}
                        >
                          <Radio
                            value={c.noi_dung}
                            disabled={!c.noi_dung.trim()}
                            style={{ marginTop: 8 }}
                          />
                          <Input.TextArea
                            value={c.noi_dung}
                            onChange={(e) =>
                              handleChangeChoice(
                                q.id_ch,
                                c.id_chon_lua,
                                e.target.value
                              )
                            }
                            placeholder="Nhập nội dung lựa chọn"
                            style={{ width: "600px" }}
                            autoSize={{ minRows: 1, maxRows: 3 }}
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              handleInsertChoiceAfter(q.id_ch, c.id_chon_lua)
                            }
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              handleDeleteChoice(q.id_ch, c.id_chon_lua)
                            }
                          />
                        </Space>
                      ))}
                    </Radio.Group>
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => handleAddChoice(q.id_ch)}
                    >
                      Thêm lựa chọn (ở cuối)
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </Card>
          ))}

          {mode !== "view" && (
            <Button type="dashed" block onClick={handleAddQuestion}>
              + Thêm câu hỏi
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TeacherQuestionDetailModal;
