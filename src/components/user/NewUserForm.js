// import React, { Component } from 'react';
// // import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

// import { Form, Input, Button } from 'antd';
// import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
// import * as api from '../api/users';
// class NewUserForm extends Component {

//     componentDidUpdate() {
//         // Chỉ set lại dữ liệu form từ editingUser nếu có
//         if (this.props.editingUser) {
//             this.form.setFieldsValue({
//                 firstName: this.props.editingUser.firstName,
//                 lastName: this.props.editingUser.lastName,
//             });
//         }
//     }

//     handleSubmit = (values) => {
//         const { firstName, lastName } = values;
//         // Nếu đang edit thì truyền userId
//         if (this.props.editingUser) {
//             this.props.onSubmit({
//                 userId: this.props.editingUser.userId,
//                 firstName,
//                 lastName,
//             });
//         } else {
//             this.props.onSubmit({
//                 firstName,
//                 lastName,
//             });
//         }
//         this.form.resetFields();
//     };
//     // handleChangeButtonUpdateClick = () => {
//     //     const buttonUpdate_name = document.getElementById('button').innerText;
//     //     if (buttonUpdate_name === Str_Update) {
//     //         document.getElementById('button').innerText = Str_Create;
//     //     }
//     //     // else {
//     //     //     document.getElementById('button').innerText = Str_Update;
//     //     // }

//     // };

//     render() {

//         return (
//             <Form
//                 layout="vertical"
//                 onFinish={this.handleSubmit}
//                 ref={(form) => (this.form = form)}
//             >
//                 <Form.Item
//                     label="First name"
//                     name="firstName"
//                     rules={[{ required: true, message: 'Please input your first name!' }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     label="Last name"
//                     name="lastName"
//                     rules={[{ required: true, message: 'Please input your last name!' }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item>
//                     <div style={{ display: "flex", gap: "8px" }}>
//                         {/* Nút chính (chiếm hết chiều ngang) */}
//                         <Button
//                             id="button"
//                             type="primary"
//                             htmlType="submit"
//                             style={{ flex: 1 }}   // 👈 thay cho block
//                         >
//                             Create
//                         </Button>

//                         {/* Nút nhỏ */}
//                         <Button
//                             id="reset-button"
//                             type="default"
//                             size="small"
//                             icon={<ReloadOutlined />}
//                             onClick={() => {
//                                 this.form.resetFields();
//                                 if (this.props.onResetEditMode) {
//                                     this.props.onResetEditMode();
//                                 }
//                             }}
//                         />
//                     </div>
//                 </Form.Item>


//             </Form>
//         );
//     }
// }

// export default NewUserForm;









// // render() {
// //     return (
// //         <Form onSubmit={this.handleSubmit}>
// //             <FormGroup>
// //                 <Label>
// //                     First name
// //                 </Label>
// //                 <Input id="firstName" required type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
// //             </FormGroup>
// //             <FormGroup>
// //                 <Label>
// //                     Last name
// //                 </Label>
// //                 <Input id="lastName" required type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
// //             </FormGroup>
// //             <FormGroup>
// //                 <Button block outline type="submit" color="primary">
// //                     Create
// //                 </Button>
// //             </FormGroup>
// //         </Form>
// //     );
// // }

// // // state

// // class NewUserForm extends Component {
// //     // khởi tạo giá trị ban đầu
// //     state = {
// //         firstName: '',
// //         lastName: ''
// //     };

// //     handleSubmit = e => {
// //         e.preventDefault();
// //         const { firstName, lastName } = this.state;

// //         this.props.onSubmit({
// //             firstName,
// //             lastName
// //         });
// //         // khởi tạo lại
// //         this.setState({
// //             firstName: '',
// //             lastName: ''
// //         });
// //     }
// //     handleFirstNameChange = e => {
// //         this.setState({
// //             firstName: e.currentTarget.value
// //         });
// //     }
// //     handleLastNameChange = e => {
// //         this.setState({
// //             lastName: e.currentTarget.value
// //         });
// //     }


// //     render() {
// //         return (
// //             <Form onSubmit={this.handleSubmit}>
// //                 <FormGroup>
// //                     <Label>
// //                         First name
// //                     </Label>
// //                     <Input id="firstName" required type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <Label>
// //                         Last name
// //                     </Label>
// //                     <Input id="lastName" required type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <Button block outline type="submit" color="primary">
// //                         Create
// //                     </Button>
// //                 </FormGroup>
// //             </Form>
// //         );
// //     }
// // }

// // export default NewUserForm;


