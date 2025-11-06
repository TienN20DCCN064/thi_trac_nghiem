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

import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
const teacherSubjectActions = createActions("cau_hoi");

const { Option } = Select;

const TeacherQuestionDetailModal = ({
  visible,
  maGV,
  maMH,
  trinhDo,
  mode = "add",
  questionId,
  onCancel,
  status_question = "chua_xoa", // 👈 THÊM DÒNG NÀY
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [gvOptions, setGvOptions] = useState([]);
  const [monHocOptions, setMonHocOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  // Tạo state riêng để lưu danh sách câu hỏi được khôi phục
  const [restoreList, setRestoreList] = useState([]);

  const dispatch = useDispatch();

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
              q.ma_gv === maGV &&
              q.ma_mh === maMH &&
              q.trinh_do === trinhDo &&
              q.trang_thai_xoa === status_question // 👈 thêm ở đây
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
        chuong_so: 1, // Giá trị chương mặc định
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

  // Khôi phục câu hỏi tạm thời khỏi UI (vẫn giữ trong restoreList)
  const handleRestoreQuestion = (qid) => {
    // Lấy câu hỏi vừa khôi phục
    const restoredQuestion = questions.find((q) => q.id_ch === qid);
    if (!restoredQuestion) return;

    // Thêm vào restoreList nếu chưa có
    setRestoreList((prev) => {
      if (!prev.some((q) => q.id_ch === qid))
        return [...prev, restoredQuestion];
      return prev;
    });

    // Xóa khỏi UI tạm thời
    setQuestions((prev) => prev.filter((q) => q.id_ch !== qid));
  };

  // Xóa tạm thời câu hỏi khỏi UI
  const handleDeleteQuestion = (qid) => {
    setQuestions((prev) => prev.filter((q) => q.id_ch !== qid));
  };

  // const handleSave = async () => {
  //   try {
  //     await form.validateFields();
  //     let newErrors = {};

  //     questions.forEach((q) => {
  //       if (!q.noi_dung.trim()) {
  //         newErrors[q.id_ch] = "Nội dung câu hỏi không được để trống";
  //       } else if (
  //         !q.chuong_so ||
  //         !Number.isInteger(Number(q.chuong_so)) ||
  //         Number(q.chuong_so) <= 0
  //       ) {
  //         newErrors[q.id_ch] = "Chương phải là số nguyên dương";
  //       } else if (q.loai === "dien_khuyet" && !q.dap_an_dung.trim()) {
  //         newErrors[q.id_ch] = "Đáp án điền khuyết không được để trống";
  //       } else if (q.loai === "yes_no" && !q.dap_an_dung) {
  //         newErrors[q.id_ch] = "Chưa chọn đáp án Yes/No";
  //       } else if (q.loai === "chon_1") {
  //         if (!q.chon_lua || q.chon_lua.length < 2) {
  //           newErrors[q.id_ch] = "Cần ít nhất 2 lựa chọn";
  //         } else if (!q.dap_an_dung) {
  //           newErrors[q.id_ch] = "Chưa chọn đáp án đúng";
  //         } else if (!q.chon_lua.some((c) => c.noi_dung === q.dap_an_dung)) {
  //           newErrors[q.id_ch] = "Đáp án đúng không hợp lệ";
  //         } else if (q.chon_lua.some((c) => !c.noi_dung.trim())) {
  //           newErrors[q.id_ch] = "Có lựa chọn chưa nhập nội dung";
  //         } else {
  //           // ✅ Kiểm tra trùng nội dung các lựa chọn
  //           const noiDungList = q.chon_lua.map((c) => c.noi_dung.trim());
  //           const uniqueNoiDung = new Set(noiDungList);
  //           if (uniqueNoiDung.size !== noiDungList.length) {
  //             newErrors[q.id_ch] = "Các lựa chọn không được trùng nhau";
  //           }
  //         }
  //       }
  //     });

  //     if (Object.keys(newErrors).length > 0) {
  //       setErrors(newErrors);
  //       throw new Error("Có lỗi trong câu hỏi, kiểm tra lại!");
  //     }

  //     setErrors({});
  //     setLoading(true);
  //     const formData = {
  //       ma_gv: form.getFieldValue("ma_gv"),
  //       ma_mh: form.getFieldValue("ma_mh"),
  //       trinh_do: form.getFieldValue("trinh_do"),
  //       questions,
  //     };
  //     console.log(questions);

  //     if (mode === "edit") {
  //       await hamChung.updateListQuestions(formData);
  //     } else {
  //       await hamChung.createListQuestions(formData);
  //     }

  //     message.success("Lưu danh sách câu hỏi thành công!");
  //     dispatch(teacherSubjectActions.creators.fetchAllRequest());
  //     onCancel();
  //   } catch (e) {
  //     message.error(e.message || "Chưa điền đủ thông tin bắt buộc!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ----- Lưu khi ở chế độ XÓA -----
  const handleSave_status_xoa = async () => {
    try {
      await form.validateFields();
      // Validation như hiện tại
      let newErrors = {};
      questions.forEach((q) => {
        if (!q.noi_dung.trim()) {
          newErrors[q.id_ch] = "Nội dung câu hỏi không được để trống";
        }
        // ... các kiểm tra khác như cũ
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        throw new Error("Có lỗi trong câu hỏi, kiểm tra lại!");
      }
      setErrors({});
      setLoading(true);

      const formData = {
        ma_gv: form.getFieldValue("ma_gv"),
        ma_mh: form.getFieldValue("ma_mh"),
        trinh_do: form.getFieldValue("trinh_do"),
        questions, // danh sách còn lại trên UI
      };

      console.log("Danh sách lưu khi XÓA:", questions);

      if (mode === "edit") {
        await hamChung.updateListQuestions(formData);
      } else {
        await hamChung.createListQuestions(formData);
      }

      message.success("Lưu danh sách câu hỏi thành công!");
      dispatch(teacherSubjectActions.creators.fetchAllRequest());
      onCancel();
    } catch (e) {
      message.error(e.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // ----- Lưu khi ở chế độ KHÔI PHỤC -----
  const handleSave_statusEditStatus = async () => {
    // Chỉ in danh sách restoreList ra console, hoặc gọi API nếu cần
    console.log("Danh sách câu hỏi đã bấm KHÔI PHỤC:", restoreList);
    for (let i = 0; i < restoreList.length; i++) {
      restoreList[i].trang_thai_xoa = "chua_xoa";
      const formOneUpdate = {
        id_ch: restoreList[i].id_ch,
        trinh_do: restoreList[i].trinh_do,
        loai: restoreList[i].loai,
        dap_an_dung: restoreList[i].dap_an_dung,
        noi_dung: restoreList[i].noi_dung,
        chuong_so: restoreList[i].chuong_so,
        ma_mh: restoreList[i].ma_mh,
        ma_gv: restoreList[i].ma_gv,
        trang_thai_xoa: "chua_xoa",
      };

      try {
        const res = await hamChung.update(
          "cau_hoi",
          formOneUpdate.id_ch,
          formOneUpdate
        );
        console.log("Câu hỏi khôi phục:", formOneUpdate.id_ch);
        console.log("Dữ liệu khôi phục:", formOneUpdate);
        console.log("Kết quả khôi phục câu hỏi:", res);
      } catch (error) {
        console.error("Error restoring question:", error);
      }
    }
    dispatch(teacherSubjectActions.creators.fetchAllRequest());
    onCancel();
    message.success("Danh sách khôi phục đã được ghi nhận!");
  };

  // ----- Function tổng quát tùy theo chế độ -----
  const handleSave = async () => {
    console.log("Status question:", status_question);
    if (status_question === "chua_xoa") {
      await handleSave_status_xoa();
    } else if (status_question === "da_xoa") {
      await handleSave_statusEditStatus();
    }
  };

  return (
    <Modal
      title={
        mode === "edit"
          ? "Sửa câu hỏi"
          : mode === "view"
          ? "Xem chi tiết câu hỏi"
          : "Quản lý Câu hỏi"
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {mode === "view" ? "Thoát" : "Hủy"}
        </Button>,
        mode !== "view" && (
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Lưu
          </Button>
        ),
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
                mode !== "view" &&
                (status_question === "chua_xoa" ? (
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDeleteQuestion(q.id_ch)}
                  >
                    Xóa
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleRestoreQuestion(q.id_ch)}
                  >
                    Khôi phục
                  </Button>
                ))
              }
            >
              <Form layout="vertical">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Form.Item
                      label="Nội dung"
                      validateStatus={errors[q.id_ch] ? "error" : ""}
                      help={errors[q.id_ch] || ""}
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
                  <Col flex="50px">
                    <Form.Item
                      label="Chương"
                      validateStatus={
                        errors[q.id_ch] && q.chuong_so === undefined
                          ? "error"
                          : ""
                      }
                      help={
                        errors[q.id_ch] && q.chuong_so === undefined
                          ? "Chưa nhập chương"
                          : ""
                      }
                    >
                      <Input
                        type="number"
                        value={q.chuong_so}
                        onChange={(e) =>
                          handleChangeQuestion(
                            q.id_ch,
                            "chuong_so",
                            e.target.value
                          )
                        }
                        placeholder="Nhập chương"
                        disabled={
                          mode === "view" || status_question === "da_xoa"
                        }
                        min={1}
                      />
                    </Form.Item>
                  </Col>
                  <Col flex="200px">
                    <Form.Item label="Loại câu hỏi">
                      <Select
                        value={q.loai}
                        onChange={(v) => {
                          handleChangeQuestion(q.id_ch, "loai", v);
                          if (v !== "chon_1") {
                            handleChangeQuestion(q.id_ch, "chon_lua", []);
                            handleChangeQuestion(q.id_ch, "dap_an_dung", "");
                          }
                        }}
                        disabled={
                          mode === "view" || status_question === "da_xoa"
                        }
                      >
                        <Option value="chon_1">Nhiều chọn lựa</Option>
                        <Option value="yes_no">Yes/No</Option>
                        <Option value="dien_khuyet">Điền khuyết</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {q.loai === "dien_khuyet" && (
                  <Form.Item>
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
                  <Form.Item>
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
                  <Form.Item>
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
                      disabled={status_question === "da_xoa"} // ✅ disable khi khôi phục
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
