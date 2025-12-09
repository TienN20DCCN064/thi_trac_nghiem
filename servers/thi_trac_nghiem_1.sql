-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 09, 2025 at 12:22 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thi_trac_nghiem_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `cau_hoi`
--

CREATE TABLE `cau_hoi` (
  `id_ch` bigint NOT NULL,
  `trinh_do` enum('CĐ','VB2','ĐH') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `loai` enum('chon_1','dien_khuyet','yes_no') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `noi_dung` text COLLATE utf8mb4_vietnamese_ci,
  `dap_an_dung` text COLLATE utf8mb4_vietnamese_ci,
  `chuong_so` int DEFAULT NULL,
  `ma_mh` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ma_gv` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `trang_thai_xoa` enum('chua_xoa','da_xoa') COLLATE utf8mb4_vietnamese_ci DEFAULT 'chua_xoa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `cau_hoi`
--

INSERT INTO `cau_hoi` (`id_ch`, `trinh_do`, `loai`, `noi_dung`, `dap_an_dung`, `chuong_so`, `ma_mh`, `ma_gv`, `trang_thai_xoa`) VALUES
(1, 'ĐH', 'chon_1', 'Hàm số f(x)=x^2 giá trị tại x=2 là?', '4', 1, 'MH01', 'GV02', 'da_xoa'),
(2, 'ĐH', 'dien_khuyet', 'Viết công thức đạo hàm của sin(x)', 'cos(x)', 2, 'MH01', 'GV02', 'da_xoa'),
(3, 'ĐH', 'chon_1', 'mạng máy tính(compute netword) so với hệ thống tập trung multi-user', 'tất cả đều đúng', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(4, 'ĐH', 'yes_no', 'mạng máy tính(compute netword) so với hệ thống tập trung multi-user là dễ phát triển hệ thống,  tăng độ tin cậy,tiết kiệm chi phí', 'Yes', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(5, 'ĐH', 'yes_no', ' 1 + 1 = 3 ', 'No', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(6, 'ĐH', 'dien_khuyet', 'le van ....', 'tiến', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(7, 'ĐH', 'dien_khuyet', 'nguyên văn ....', 'vinh', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(8, 'ĐH', 'chon_1', 'để một máy tính truyền dữ liệu cho một số máy khác trong mạng, ta dùng loại địa chỉ', 'multicast', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(9, 'ĐH', 'chon_1', 'thứ tự phân loại mạng theo chiều dài đường truyền', 'internet, wan, man, lan', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(10, 'ĐH', 'chon_1', 'Cáp UTP hỗ trợ tôc độ truyền 100MBps là loại', 'Cat 5', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(11, 'ĐH', 'chon_1', 'Hoạt động của protocol Stop and Wait', 'Chờ nhận được ACK của frame trước mới gửi tiếp frame kế', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(12, 'ĐH', 'chon_1', 'Loại mạng cục bộ nào dùng chuẩn CSMA/CD', 'Ethernet', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(13, 'ĐH', 'chon_1', 'Mạng nào có tốc độ truyền lớn hơn 100Mbps', 'Gigabit Ethernet', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(14, 'ĐH', 'chon_1', 'Cấp appliation trong mô hình TCP/IP tương đương với cấp nào trong mô hình OSI', 'Tất cả đều đúng', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(15, 'ĐH', 'chon_1', 'Subnet Mask nào sau đây chỉ cho tối đa 2 địa chỉ host', '255255255252', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(16, 'ĐH', 'chon_1', 'Khi một dịch vụ trả lời ACK cho biết dữ liệu đã nhận được, đó là', 'Dịch vụ có xác nhận', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(17, 'ĐH', 'chon_1', 'Loại frame nào được sử dụng trong mạng Token-ring', 'Token và Data', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(18, 'ĐH', 'chon_1', 'Chức năng cấp mạng (network) là', 'Tìm đường và kiểm soát tắc nghẽn', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(19, 'ĐH', 'chon_1', 'Mạng CSMA/CD làm gì', 'Truy cập đường truyền và truyền lại dữ liệu nếu xảy ra đụng độ', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(20, 'ĐH', 'chon_1', 'Tiền thân của mạng Internet là', 'Arpanet', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(21, 'ĐH', 'chon_1', 'Khi 1 cầu nối ( bridge) nhận được 1 framechưa biết thông tin về địa chỉ máy nhận, nó sẽ', 'Gửi đến mọi ngõ ra còn lại', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(22, 'ĐH', 'chon_1', 'Chức năng của cấp Network là', 'Tìm đường', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(23, 'ĐH', 'chon_1', 'mạng man được sử dụng trong phạm vi:', 'thành phố', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(24, 'ĐH', 'chon_1', 'mạng man không kết nối theo sơ đồ:', 'tree', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(25, 'ĐH', 'chon_1', 'Thiết bị nào làm việc trong cấp vật lý (physical)', 'Tất cả đều đúng', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(26, 'ĐH', 'chon_1', 'Protocol nào tạo frame bằng phương pháp chèn kí tự', 'PPP', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(27, 'ĐH', 'chon_1', 'Mạng Ethernet được IEEE đưa vào chuẩn', 'IEEE 802.3', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(28, 'ĐH', 'chon_1', 'Mạng Ethernet sử dụng được loại cáp', 'Tất cả đều đúgn', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(29, 'ĐH', 'chon_1', 'Cấp nào trong mô hình mạng OSI tương đương với cấp Internet trong mô hình TCP/IP', 'Network', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(30, 'ĐH', 'chon_1', 'Thành phần nào không thuộc socket', 'Địa chỉ cấp MAC', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(31, 'ĐH', 'chon_1', 'Thuật ngữ OSI là viết tắt bởi', 'Open System Interconnection', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(32, 'ĐH', 'chon_1', 'thuật ngữ man được viết tắt bởi:', 'multiple access network', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(33, 'ĐH', 'chon_1', 'kiến trúc mạng (network architechture) là:', 'tập các cấp và các protocol trong mỗi cấp', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(34, 'ĐH', 'chon_1', 'chọn câu sai trong các nguyên lý phân cấp của mô hình osi', 'mỗi cấp phải cung cấp cùng một kiểu địa chỉ và dịch vụ', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(35, 'ĐH', 'chon_1', 'Phương pháp dồn kênh phân chia tần số gọi là', 'FDM', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(36, 'ĐH', 'chon_1', 'Phương pháp nào được dủng trong việc phát hiện lỗi', 'Checksum', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(37, 'ĐH', 'chon_1', 'Chuẩn nào không dùng trong mạng cục bộ (LAN )', 'IEEE 802.6', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(38, 'ĐH', 'chon_1', 'Khoảng cách đường truyền tối đa mạng FDDI có thể đạt', '100Km', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(39, 'ĐH', 'chon_1', 'Chất lượng dịch vụ mạng không được đánh giá trên chỉ tiêu nào?', 'Thời gian thiết lập kết nối ngắn', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(40, 'ĐH', 'chon_1', 'Mục đích của Subnet Mask trong địa chỉ IP là', 'Xác định host của địa chỉ IP', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(41, 'ĐH', 'chon_1', 'Trong mạng Token-ting, khi 1 máy nhận được Token', 'Nó được quyền truyền dữ liệu', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(42, 'ĐH', 'chon_1', 'thuật ngữ nào không cùng nhóm:', 'multiplex', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(43, 'ĐH', 'chon_1', 'T-connector dùng trong loại cáp', '10Base-2', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(44, 'ĐH', 'chon_1', 'Termiator là linh kiện dùng trong loại cáp mạng', 'Đồng trục', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(45, 'ĐH', 'chon_1', 'Dịch vụ nào không sử dụng trong cấp data link', 'Không xác nhận, có kết nối', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(46, 'ĐH', 'chon_1', 'Kiểm soát lưu lượng (flow control) có nghĩa là', 'Điều tiết tốc độ truyền frame', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(47, 'ĐH', 'chon_1', 'Loại mạng nào dùng 1 máy tính làm Monitor để bảo trì mạng', 'Token-ring', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(48, 'ĐH', 'chon_1', 'Cấp network truyền nhận theo kiểu end-to-end vì nó quản lý dữ liệu', 'Giữa 2 đầu subnet', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(49, 'ĐH', 'chon_1', 'Kỹ thuật Multiplexing được dùng khi', 'Có nhiều kênh truyền hơn đường truyền', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(50, 'ĐH', 'chon_1', 'Bước đầu tiên cần thực hiện để truyền dữ liệu theo ALOHA là', 'Lập tức truyền dữ liệu', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(51, 'ĐH', 'chon_1', 'Trong mạng cục bộ, để xác định 1 máy trong mạng ta dùng địa chỉ', 'MAC', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(52, 'ĐH', 'chon_1', 'loại dịch vụ nào có thể nhận dữ liệu không đúng thứ tự khi truyền', 'không kết nối', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(53, 'ĐH', 'chon_1', 'Cáp xoắn đôi trong mạng LAN dùng đầu nối', 'RJ45', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(54, 'ĐH', 'chon_1', 'Mạng không dây dùng loại sóng nào không bị ảnh hưởng bởi khoảng cách địa lý', 'Sóng radio', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(55, 'ĐH', 'chon_1', 'Nguyên nhân gây sai sót khi gửi/nhận dữ liệu trên mạng', 'Tất cả đều đúng', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(56, 'ĐH', 'chon_1', 'Khả năng nhận biết tình trạng đường truyền ( carrier sence) là', 'Nhận biết có xung đột hay không', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(57, 'ĐH', 'chon_1', 'Loại mạng nào không có độ ưu tiên', 'Tất cả đều sai', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(58, 'ĐH', 'chon_1', 'Kiểu mạch ảo(virtual circuit) được dùng trong loại dịch vụ mạng', 'Có kết nối', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(59, 'ĐH', 'chon_1', 'Dịch vụ truyền Email sử dụng protocol nào?', 'SMTP', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(60, 'ĐH', 'chon_1', 'Cầu nối trong suốt hoạt động trong cấp nào', 'Data link', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(61, 'ĐH', 'chon_1', 'Thứ tự các cấp trong mô hình OSI', 'Application,Presentation,Session,Transport,Network,Data link,Physical', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(62, 'ĐH', 'chon_1', 'dịch vụ không xác nhận (unconfirmed) chỉ sử dụng 2 phép toán cơ bản:', 'request and indication', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(63, 'ĐH', 'chon_1', 'Chọn câu sai trong các nguyên lý phân cấp của mô hình OSI', 'Mỗi cấp phải cung cấp cùng 1 kiểu địa chỉ và dịch vụ', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(64, 'ĐH', 'chon_1', 'Chức năng cấp vận tải (transport)', 'Thiết lập và hủy bỏ dữ liệu', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(65, 'ĐH', 'chon_1', 'Đường truyền E1 gồm 32 kênh, trong đó sử dụng cho dữ liệu là:', '30 kênh', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(66, 'ĐH', 'chon_1', 'Để tránh sai sót khi truyền dữ liệu trong cấp data link', 'Tất cả đều đúng', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(67, 'ĐH', 'chon_1', 'Mạng nào không có khả năng nhận biết tình trạng đường truyền (carrier sence)', 'ALOHA', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(68, 'ĐH', 'chon_1', 'Loại mạng nào dùng 2 loại frame khác nhau trên đường truyền', 'Token-ring', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(69, 'ĐH', 'chon_1', 'Kiểu datagram trong cấp network', 'Phải tìm đường riêng cho từng packet', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(70, 'ĐH', 'chon_1', 'Địa chỉ IP lớp B nằm trong phạm vi nào', '128.0.0.0 - 191.0.0.0', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(71, 'ĐH', 'chon_1', 'Tốc độ của đường truyền T1 là:', '1544 Mbps', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(72, 'ĐH', 'chon_1', 'Cấp vật lý (physical) không quản lý', 'Địa chỉ vật lý', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(73, 'ĐH', 'chon_1', 'Chức năng của cấp vật lý(physical)', 'Xác định thời gian truyền 1 bit dữ liệu', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(74, 'ĐH', 'chon_1', 'Chức năng câp liên kết dữ liệu (data link)', 'Quản lý lỗi sai', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(75, 'ĐH', 'chon_1', 'Chức năng cấp mạng (network)', 'Điều khiển hoạt động subnet', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(76, 'ĐH', 'chon_1', 'Mạng máy tính thường sử dụng loại chuyển mach', 'Gói (packet switch)', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(77, 'ĐH', 'chon_1', 'Quản lý lưu lượng đường truyền là chức năng của cấp', 'Data link', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(78, 'ĐH', 'chon_1', 'Mạng nào có khả năng nhận biết xung đột (collision)', 'Tất cả đều đúng', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(79, 'ĐH', 'chon_1', 'Vùng dữ liệu trong mạng Ethernet chứa tối đa', '1500 bytes', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(80, 'ĐH', 'chon_1', 'Kiểm soát tắc nghẽn (congestion) là nhiệm vụ của cấp', 'Network', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(81, 'ĐH', 'chon_1', 'TCP sử dụng loại dịch vụ', 'Có kết nối, độ tin cậy cao', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(82, 'ĐH', 'chon_1', 'Chuẩn mạng nào có khả năng pkhát hiện xung đột (collision) trong khi truyền', 'CSMA/CD', 8, 'MMTCB', 'GV02', 'chua_xoa'),
(83, 'ĐH', 'chon_1', 'Chọn câu sai:\" Cầu nối (bridge) có thể kết nối các mạng có....\"', 'Chiều dài frame khác nhau', 8, 'MMTCB', 'GV02', 'chua_xoa'),
(84, 'ĐH', 'chon_1', 'Nguyên nhân dẫn đến tắt nghẻn (congestion) trên mạng', 'Tất cả đều đúng', 8, 'MMTCB', 'GV02', 'chua_xoa'),
(85, 'ĐH', 'chon_1', 'Địa chỉ IP bao gồm', 'Địa chỉ Network và địa chỉ host', 8, 'MMTCB', 'GV02', 'chua_xoa'),
(86, 'ĐH', 'chon_1', 'Board members ..... carefully define their goals and objectives for the agency before the monthly meeting next week.', 'should', 1, 'AVCB', 'GV02', 'chua_xoa'),
(87, 'ĐH', 'chon_1', 'The publishers suggested that the envelopes be sent to ...... by courier so that the film can be developed as soon as possible', 'them', 2, 'AVCB', 'GV02', 'chua_xoa'),
(88, 'ĐH', 'chon_1', 'For business relations to continue between our two firms, satisfactory agreement must be ...... reached and signer', 'either', 2, 'AVCB', 'GV02', 'chua_xoa'),
(89, 'ĐH', 'chon_1', 'Aswering telephone calls is the..... of an operator', 'responsibility', 2, 'AVCB', 'GV02', 'chua_xoa'),
(90, 'ĐH', 'chon_1', 'The corporation, which underwent a major restructing seven years ago, has been growing steadily ......five years', 'for', 3, 'AVCB', 'GV02', 'chua_xoa'),
(91, 'ĐH', 'chon_1', 'A free watch will be provided with every purchase of $20.00 or more a ........ period of time', 'limited', 3, 'AVCB', 'GV02', 'chua_xoa'),
(92, 'ĐH', 'chon_1', 'Making advance arrangements for audiovisual equipment is....... recommended for all seminars.', 'sternly', 4, 'AVCB', 'GV02', 'chua_xoa'),
(93, 'ĐH', 'chon_1', 'The president of the corporation has .......arrived in Copenhagen and will meet with the Minister of Trade on Monday morning', 'already', 4, 'AVCB', 'GV02', 'chua_xoa'),
(94, 'ĐH', 'chon_1', 'Two assistants will be required to ...... reporter\'s names when they arrive at the press conference', 'check', 5, 'AVCB', 'GV02', 'chua_xoa'),
(95, 'ĐH', 'chon_1', 'Conservatives predict that government finaces will remain...... during the period of the investigation', 'stable', 5, 'AVCB', 'GV02', 'chua_xoa'),
(96, 'ĐH', 'chon_1', 'Because we value your business, we have .......for card members like you to receive one thousand  dollars of complimentary life insurance', 'arranged', 5, 'AVCB', 'GV02', 'chua_xoa'),
(97, 'ĐH', 'chon_1', 'The present government has an excellent ......to increase exports', 'opportunity', 6, 'AVCB', 'GV02', 'chua_xoa'),
(98, 'ĐH', 'chon_1', 'Our studies show that increases in worker productivity have not been adequately .......rewarded by significant increases in ......', 'commodity', 6, 'AVCB', 'GV02', 'chua_xoa'),
(99, 'ĐH', 'chon_1', 'Employees are........that due to the new government regulations. there is to be no smoking in the factory', 'reminded', 6, 'AVCB', 'GV02', 'chua_xoa'),
(100, 'ĐH', 'chon_1', 'The customers were told that no ........could be made on weekend nights because the restaurant was too busy', 'reservation', 6, 'AVCB', 'GV02', 'chua_xoa'),
(101, 'ĐH', 'chon_1', 'The sales representive\'s presentation was difficult to understand ........ he spoke very quickly', 'because', 6, 'AVCB', 'GV02', 'chua_xoa'),
(102, 'ĐH', 'chon_1', 'While you are in the building, please wear your identification badge at all times so that you are ....... as a company employee.', 'recognizable', 7, 'AVCB', 'GV02', 'chua_xoa'),
(103, 'ĐH', 'chon_1', 'MS. Galera gave a long...... in honor of the retiring vice-president', 'speech', 7, 'AVCB', 'GV02', 'chua_xoa'),
(104, 'ĐH', 'chon_1', 'Any person who is........ in volunteering his or her time for the campaign should send this office a letter of intent', 'interested', 7, 'AVCB', 'GV02', 'chua_xoa'),
(105, 'ĐH', 'chon_1', 'Mr.Gonzales was very concerned.........the upcoming board of directors meeting', 'about', 7, 'AVCB', 'GV02', 'chua_xoa'),
(106, 'CĐ', 'chon_1', 'Unfortunately, neither Mr.Sachs....... Ms Flynn will be able to attend the awards banquet this evening', 'nor', 1, 'AVCB', 'GV02', 'chua_xoa'),
(107, 'CĐ', 'chon_1', 'We are pleased to inform...... that the missing order has been found.', 'you', 2, 'AVCB', 'GV02', 'chua_xoa'),
(108, 'CĐ', 'chon_1', 'According to the manufacturer, the new generatir is capable of....... the amount of power consumed by our facility by nearly ten percent.', 'reducing', 2, 'AVCB', 'GV02', 'chua_xoa'),
(109, 'CĐ', 'chon_1', 'In order to place a call outside the office, you have to .......nine first.', 'number', 3, 'AVCB', 'GV02', 'chua_xoa'),
(110, 'CĐ', 'chon_1', 'After the main course, choose from our wide....... of homemade deserts', 'variety', 3, 'AVCB', 'GV02', 'chua_xoa'),
(111, 'CĐ', 'chon_1', '.........has the marketing environment been more complex and subject to change', 'Rarely', 3, 'AVCB', 'GV02', 'chua_xoa'),
(112, 'CĐ', 'chon_1', 'All full-time staff are eligible to participate in the revised health plan, which becomes effective the first ......... the month.', 'of', 3, 'AVCB', 'GV02', 'chua_xoa'),
(113, 'CĐ', 'chon_1', 'Battery-operated reading lamps......very well right now', 'are selling', 4, 'AVCB', 'GV02', 'chua_xoa'),
(114, 'CĐ', 'chon_1', 'One of the most frequent complaints among airline passengers is that there is not ...... legroom', 'enough', 4, 'AVCB', 'GV02', 'chua_xoa'),
(115, 'CĐ', 'chon_1', 'On international shipments, all duties and taxes are paid by the..........', 'recipient', 4, 'AVCB', 'GV02', 'chua_xoa'),
(116, 'CĐ', 'chon_1', 'Although the textbook gives a definitive answer,wise managers will look for........ own creative solutions', 'their', 4, 'AVCB', 'GV02', 'chua_xoa'),
(117, 'CĐ', 'chon_1', 'Initial ....... regarding the merger of the companies took place yesterday at the Plaza Conference Center.', 'negotiations', 4, 'AVCB', 'GV02', 'chua_xoa'),
(118, 'CĐ', 'chon_1', 'Please......... photocopies of all relevant docunments to this office ten days prior to your performance review date', 'submit', 4, 'AVCB', 'GV02', 'chua_xoa'),
(119, 'CĐ', 'chon_1', 'The auditor\'s results for the five year period under study were .........the accountant\'s', 'the same as', 4, 'AVCB', 'GV02', 'chua_xoa'),
(120, 'CĐ', 'chon_1', 'Faculty members are planning to..... a party in honor of Dr.Walker, who will retire at the end of the semester', 'take', 5, 'AVCB', 'GV02', 'chua_xoa'),
(121, 'CĐ', 'chon_1', 'The firm is not liable for damage resulting from circumstances.........its control.', 'beyond', 5, 'AVCB', 'GV02', 'chua_xoa'),
(122, 'CĐ', 'chon_1', 'Because of.......weather conditions, California has an advantage in the production of fruits and vegetables', 'favorable', 5, 'AVCB', 'GV02', 'chua_xoa'),
(123, 'CĐ', 'chon_1', 'Many employees seem more ....... now about how to use the new telephone system than they did before they attended the workshop', 'confused', 6, 'AVCB', 'GV02', 'chua_xoa'),
(124, 'CĐ', 'chon_1', 'It has been predicted that an.......weak dollar will stimulate tourism in the United States', 'increasingly', 6, 'AVCB', 'GV02', 'chua_xoa'),
(125, 'CĐ', 'chon_1', '.........our production figures improve in the near future, we foresee having to hire more people between now and July', 'Because', 7, 'AVCB', 'GV02', 'chua_xoa'),
(126, 'VB2', 'chon_1', 'Rates for the use of recreational facilities do not include ta and are subject to change without.........', 'signal', 1, 'AVCB', 'GV02', 'chua_xoa'),
(127, 'VB2', 'chon_1', 'This new highway construction project will help the company.........', 'diversity', 1, 'AVCB', 'GV02', 'chua_xoa'),
(128, 'VB2', 'chon_1', 'A recent global survey suggests.......... demand for aluminum and tin will remain at its current level for the next five to ten years.', 'that', 2, 'AVCB', 'GV02', 'chua_xoa'),
(129, 'VB2', 'chon_1', 'Ms.Patel has handed in an ........business plan to the director', 'outstanding', 2, 'AVCB', 'GV02', 'chua_xoa'),
(130, 'VB2', 'chon_1', 'If you send in an order ....... mail, we recommend that you phone our sales division directly to confirm the order.', 'near', 3, 'AVCB', 'GV02', 'chua_xoa'),
(131, 'VB2', 'chon_1', 'Contracts must be read........ before they are signed.', 'thoroughly', 3, 'AVCB', 'GV02', 'chua_xoa'),
(132, 'VB2', 'chon_1', 'Passengers should allow for...... travel time to the airport in rush hour traffic', 'additional', 3, 'AVCB', 'GV02', 'chua_xoa'),
(133, 'VB2', 'chon_1', 'This fiscal year, the engineering team has worked well together on all phases ofproject.........', 'development', 3, 'AVCB', 'GV02', 'chua_xoa'),
(134, 'VB2', 'chon_1', 'Recent changes in heating oil costs have affected..........production of turniture', 'local', 3, 'AVCB', 'GV02', 'chua_xoa'),
(135, 'VB2', 'chon_1', 'In Piazzo\'s lastest architectural project, he hopes to......his flare for blending contemporary and traditional ideals.', 'demonstrate', 4, 'AVCB', 'GV02', 'chua_xoa'),
(136, 'VB2', 'chon_1', 'We were........unaware of the problems with the air-conidtioning units in the hotel rooms until this week.', 'completing', 4, 'AVCB', 'GV02', 'chua_xoa'),
(137, 'VB2', 'chon_1', 'Mr.Dupont had no ....... how long it would take to drive downtown', 'idea', 4, 'AVCB', 'GV02', 'chua_xoa'),
(138, 'VB2', 'chon_1', 'Savat Nation Park is ....... by train,bus, charter plane, and rental car.', 'accessible', 5, 'AVCB', 'GV02', 'chua_xoa'),
(139, 'VB2', 'chon_1', 'Replacing the offic equipment that the company purchased only three years ago seems quite.....', 'wasting', 5, 'AVCB', 'GV02', 'chua_xoa'),
(140, 'VB2', 'chon_1', 'On........, employees reach their peak performance level when they have been on the job for at least two years.', 'general', 5, 'AVCB', 'GV02', 'chua_xoa'),
(141, 'VB2', 'chon_1', 'Small company stocks usually benefit..........the so called January effect that cause the price of these stocks to rise between November and January', 'from', 5, 'AVCB', 'GV02', 'chua_xoa'),
(142, 'VB2', 'chon_1', 'Dr. Abernathy\'s donation to Owstion College broke the record for the largest private gift...... give to the campus', 'once', 6, 'AVCB', 'GV02', 'chua_xoa'),
(143, 'VB2', 'chon_1', 'It has been suggested that employees ........to work in their current positions until the quarterly review is finished.', 'continue', 6, 'AVCB', 'GV02', 'chua_xoa'),
(144, 'VB2', 'chon_1', 'Though their performance was relatively unpolished, the actors held the audience\'s ........for the duration of the play.', 'attention', 7, 'AVCB', 'GV02', 'chua_xoa'),
(145, 'VB2', 'chon_1', 'It is admirable that Ms.Jin wishes to handle all transactions by........, but it might be better if several people shared the responsibility', 'herself', 7, 'AVCB', 'GV02', 'chua_xoa'),
(146, 'CĐ', 'chon_1', 'Byte đầu của địa chỉ IP lớp E nằm trong phạm vi', '240 - 247', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(147, 'CĐ', 'chon_1', 'Cầu nối (bridge)dựa vào thông tin nào để truyền tiếp hoặc hủy bỏ 1 frame', 'Địa chỉ mạng', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(148, 'CĐ', 'chon_1', 'Loại cáp nào chỉ truyền dữ liệu 1 chiều', 'Cáp quang', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(149, 'CĐ', 'chon_1', 'Để chống nhiễu trên đường truyền tốt nhất, nên dùng loại cáp:', 'Cáp quang', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(150, 'CĐ', 'chon_1', 'Sự khác nhau giữa địa chỉ cấp Data link và Network là', 'Địa chỉ cấp Data link là đia chỉ Physic, địa chỉ cấp Network là địa chỉ Logic', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(151, 'CĐ', 'chon_1', 'Truyền dữ liệu theo kiểu có kết nối không cần thực hiện việc', 'Tìm đường cho từng gói tin', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(152, 'CĐ', 'chon_1', 'Khi truyền đi chuỗi \"VIET NAM\" nhưng nhận được chuỗi\"MAN TEIV \". Cần phải hiệu chỉnh các protocol trong cấp nào để truyền chính xác', 'Transport', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(153, 'CĐ', 'chon_1', 'Cấp Data link không thực hiện chức năng nào?', 'Thiết lập kết nối', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(154, 'CĐ', 'chon_1', 'Chuẩn nào sử dụng trong cấp presentation?', 'ASCII và EBCDIC', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(155, 'CĐ', 'chon_1', 'Thiết bị Modem dùng để', 'Điều chế và giải điều chế tín hiệu', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(156, 'CĐ', 'chon_1', 'Phần mềm gửi/nhận thư điện tử thuộc cấp nào trong mô hình OSI', 'Application', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(157, 'CĐ', 'chon_1', 'Kỹ thuật nào không sử dụng được trong việc kiểm soát lưu lượng(flow control)', 'Multiplexing', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(158, 'CĐ', 'chon_1', 'Protocol nghĩa là', 'Tập các qui tắc và cấu trúc dữ liệu để truyền thông giữa các cấp mạng', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(159, 'CĐ', 'chon_1', 'Tên cáp UTP dùng torng mạng Fast Ethernet là', '100BaseT', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(160, 'CĐ', 'chon_1', 'Nhược điểm của dịch vụ có kết nối so với không kết nối', 'Đường truyền không thay đổi', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(161, 'CĐ', 'chon_1', 'Đơn vị truyền dữ liệu giữa các cấp trong mạng theo thứ tự', 'bit,frame,packet,data', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(162, 'CĐ', 'chon_1', 'Việc cấp phát kênh truyền áp dụng cho loại mạng', 'Broadcast', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(163, 'CĐ', 'chon_1', 'Chức năng của thiết bị Hub trong mạng LAN', 'Phân chia tín hiệu', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(164, 'CĐ', 'chon_1', 'Cấp cao nhất trong mô hình mạng OSI là', 'Application', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(165, 'CĐ', 'chon_1', 'Tốc độ truyền của mạng Ethernet là', '10 Mbps', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(166, 'CĐ', 'chon_1', 'Lý do nào khiến người ta chọn protocol TCP hơn là UDP', 'Độ tin cậy', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(167, 'CĐ', 'chon_1', 'Mạng Ethernet do cơ quan nào phát minh', 'XEROX', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(168, 'CĐ', 'chon_1', 'Mạng nào dùng phương pháp mã hóa Manchester Encoding', 'Tất cả đều đúng', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(169, 'CĐ', 'chon_1', 'Switch là thiết bị mạng làm việc tương tự như', 'Bridge', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(170, 'CĐ', 'chon_1', 'Tại sao mạng máy tình dùng mô hình phân cấp', 'Các cấp khác không cần sửa đổi khi thay đổi 1 cấp mạng', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(171, 'CĐ', 'chon_1', 'Thuật ngữ nào cho biết loại mạng chỉ truyền được  chiều tại 1 thời điểm', 'Half duplex', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(172, 'CĐ', 'chon_1', 'Dịch vụ mạng thường được phân chia thành', 'Tất cả đều đúng', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(173, 'CĐ', 'chon_1', 'Subnet mask chuẩn của địa chỉ IP lớp B là', '255.255.0.0', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(174, 'CĐ', 'chon_1', 'Chiều dài loại cáp nào tối đa 100 m?', '10BaseT', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(175, 'CĐ', 'chon_1', 'Phương pháp tìm đường có tính đến thời gian trễ', 'Tìm đường theo trạng thái đường truyền', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(176, 'CĐ', 'chon_1', 'Router làm gì để giảm tăc nghẽn (congestion)', 'Cấm truyền dữ liệu broadcasr', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(177, 'CĐ', 'chon_1', 'Chọn câu đúng đối với switch của mạng LAN', 'Nhận data từ 1 cổng và xuất ra 1 cổng đích tùy theo địa chỉ cấp MAC', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(178, 'CĐ', 'chon_1', 'Đơn vị truyền dữ liệu trong cấp Network gọi là', 'Packet', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(179, 'CĐ', 'chon_1', 'Đầu nới AUI dùng cho loại cáp nào?', 'Đồng trục', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(180, 'CĐ', 'chon_1', 'Địa chỉ IP 100.150.200.250 có nghĩa là', 'Tất cả đều sai', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(181, 'CĐ', 'chon_1', 'Chuẩn mạng nào khi có dữ liệu không truyền ngay mà chờ 1 thời gian ngẫu nhiên?', 'Non-presistent CSMA', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(182, 'CĐ', 'chon_1', 'Byte đầu của 1 IP có giá trị 222, địa chỉ này thuộc lớp địa chỉ nào', 'Lớp C', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(183, 'CĐ', 'chon_1', 'Protocol nào trong mạng TCP/IP chuyển đổi địa chỉ vật lý thành địa chỉ IP', 'RARP', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(184, 'CĐ', 'chon_1', 'Switching hun khác hub thông thường ở chỗ nó làm', 'Giảm collision trên mạng', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(185, 'CĐ', 'chon_1', 'Phương pháp chèn bit (bit stuffing) được dùng để', 'Phân biệt đầu và cuối frame', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(186, 'VB2', 'chon_1', 'Thiết bị nào có thể thêm vào mạng LAN mà không sợ vi phạm luật 5-4-3', 'Router', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(187, 'VB2', 'chon_1', 'Địa chỉ IP được chia làm mấy lớp', '5', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(188, 'VB2', 'chon_1', 'Cáp quang dùng công nghệ dồn kênh nào', 'WDM', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(189, 'VB2', 'chon_1', 'Để tránh nhận trùng dữ liệu người ta dùng phương pháp', 'Đánh số thứ tự các frame', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(190, 'VB2', 'chon_1', 'Cáp đồng trục (coaxial)', 'Chống nhiễu tốt hơn UTP', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(191, 'VB2', 'chon_1', 'Mạng CSMA/CD', 'Kiểm tra đường truyền nếu rảnh mới truyền dữ liệu', 1, 'MMTCB', 'GV02', 'chua_xoa'),
(192, 'VB2', 'chon_1', 'Thêm thiết bị nào vào mạng có thể qui phạm luật 5-4-3', 'Repeater', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(193, 'VB2', 'chon_1', 'Chức năng nào không phải của cấp Network', 'Địa chỉ logic', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(194, 'VB2', 'chon_1', 'Nhược điểm của phương pháp chèn ký tự', 'Tăng phí tổn đường truyền', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(195, 'VB2', 'chon_1', 'Cơ chế Timer dùng để', 'Đo thời gian chơ frame', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(196, 'VB2', 'chon_1', 'Câp Data link', 'Bảo đảm đường truyền dữ liệu tin cậy giữa 2 đầu đường truyền', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(197, 'VB2', 'chon_1', 'Địa chỉ MAC', 'Dùng để phân biệt các máy trong mạng', 2, 'MMTCB', 'GV02', 'chua_xoa'),
(198, 'VB2', 'chon_1', 'Mạng nào cóxảy ra xung đột (collision) trên đường truyền', 'Ethernet', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(199, 'VB2', 'chon_1', 'Phương pháp chèn kí tự dùng để', 'Phân biệt dữ liệu và ký tự điều khiển', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(200, 'VB2', 'chon_1', 'Mất đồng bộ frame xảy ra đối với phương pháp', 'Đếm ký tự', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(201, 'VB2', 'chon_1', 'Cấp nào trong mô hình OSI quan tâm tới topology mạng', 'Network', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(202, 'VB2', 'chon_1', 'Địa chỉ IP còn gọi là', 'Địa chỉ luận lý', 3, 'MMTCB', 'GV02', 'chua_xoa'),
(203, 'VB2', 'chon_1', 'Từ \"Broad\" trong tên cáp 10Broad36 viết tắt bởi', 'Broadband', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(204, 'VB2', 'chon_1', 'Kỹ thuật truyền nào mã hóa trực tiếp dữ liệu ra đường truyền không cần sóng mang', 'Baseband', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(205, 'VB2', 'chon_1', 'Mạng nào dùng công nghệ Token-bus', '100VG-AnyLAN', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(206, 'VB2', 'chon_1', 'Loại mạng nào sử dụng trên WAN', 'Ethernet và Token-bus', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(207, 'VB2', 'chon_1', 'Cấp Presentation', 'Cung cấp dịch vụ truyền dữ liệu từ nguồn đến đích', 4, 'MMTCB', 'GV02', 'chua_xoa'),
(208, 'VB2', 'chon_1', 'Thiết bị nào làm việc trong cấp Network', 'Router', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(209, 'VB2', 'chon_1', 'Protocol nào sử dụng trong cấp Network', 'IP', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(210, 'VB2', 'chon_1', 'Sóng viba sử dụng băng tần', 'Tất cả đều đúng', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(211, 'VB2', 'chon_1', 'Thiết bị nào tự trao đổi thông tin lẫn nhau để quản lý mạng', 'Router', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(212, 'VB2', 'chon_1', 'Repeater nhiều port là tên gọi của', 'Hub', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(213, 'VB2', 'chon_1', 'Tập các luật để định dạng và truyền dữ liệu gọi là', 'Nghi thức (protocol)', 5, 'MMTCB', 'GV02', 'chua_xoa'),
(214, 'VB2', 'chon_1', 'Thiết bị nào cần có bộ nhớ làm buffer', 'Router', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(215, 'VB2', 'chon_1', 'Protocol nào torng cấp Transport cung cấp dịch vụ không kết nối', 'UDP', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(216, 'VB2', 'chon_1', 'Sóng viba bị ảnh hưởng bời', 'Trời mưa', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(217, 'VB2', 'chon_1', 'Tần số sóng điện từ dùng trong mạng vô tuyến sắp theo thứ tự tăng dần', 'Radio,viba,hồng ngoại', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(218, 'VB2', 'chon_1', 'Đơn vị đo tốc độ đường truyền', 'bps(bit per second)', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(219, 'VB2', 'chon_1', 'Tại sao cần có tiêu chuẩn về mang', 'Tương thích về công nghệ để truyền thông được lẫn nhau', 6, 'MMTCB', 'GV02', 'chua_xoa'),
(220, 'VB2', 'chon_1', 'Luật 5-4-3 cho phép tối đa', '5 segment trong 1 mạng', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(221, 'VB2', 'chon_1', 'Protocol nào trong cấp Transport dùng kiểu dịch vụ có kết nối?', 'TCP', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(222, 'VB2', 'chon_1', 'Đường dây trung kế trong mạng điện thoại sử dụng', 'Tất cả đêu đúng', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(223, 'VB2', 'chon_1', 'Đường dây hạ kế (local loop) trong mạch điện thoại dùng tín hiệu', 'Analog', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(224, 'VB2', 'chon_1', 'Repeater dùng để', 'Mở rộng chiều dài đường truyền', 7, 'MMTCB', 'GV02', 'chua_xoa'),
(225, 'VB2', 'chon_1', 'Dữ liệu truyền trên mạng bằng', 'Xung điện áp', 7, 'MMTCB', 'GV02', 'chua_xoa');

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_dang_ky_thi`
--

CREATE TABLE `chi_tiet_dang_ky_thi` (
  `id_dang_ky_thi` bigint NOT NULL,
  `chuong_so` int NOT NULL,
  `so_cau` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_thi`
--

CREATE TABLE `chi_tiet_thi` (
  `id_dang_ky_thi` bigint NOT NULL,
  `ma_sv` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `stt` int NOT NULL,
  `id_ch` bigint DEFAULT NULL,
  `cau_tra_loi` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chon_lua`
--

CREATE TABLE `chon_lua` (
  `id_chon_lua` bigint NOT NULL,
  `id_ch` bigint DEFAULT NULL,
  `noi_dung` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `chon_lua`
--

INSERT INTO `chon_lua` (`id_chon_lua`, `id_ch`, `noi_dung`) VALUES
(1, 1, '2'),
(2, 1, '3'),
(3, 1, '4'),
(4, 1, '5'),
(5, 3, 'dễ phát triển hệ thống'),
(6, 3, 'tăng độ tin cậy'),
(7, 3, 'tiết kiệm chi phí'),
(8, 3, 'tất cả đều đúng'),
(9, 8, 'Broadcast'),
(10, 8, 'Broadband'),
(11, 8, 'multicast'),
(12, 8, 'multiple access'),
(13, 9, 'internet, lan, man, wan'),
(14, 9, 'internet, wan, man, lan'),
(15, 9, 'lan, wan, man, internet'),
(16, 9, 'man, lan, wan, internet'),
(17, 10, 'Cat 3'),
(18, 10, 'Cat 4'),
(19, 10, 'Cat 5'),
(20, 10, 'Cat 6'),
(21, 11, 'Chờ một khoảng thời gian time-out rồi gửi tiếp frame kế'),
(22, 11, 'Chờ 1 khoảng thời gian time-out rồi gửi lại frame trước'),
(23, 11, 'Chờ nhận được ACK của frame trước mới gửi tiếp frame kế'),
(24, 11, 'Không chờ mà gửi liên tiếp các frame kế nhau'),
(25, 12, 'Token-ring'),
(26, 12, 'Token-bus'),
(27, 12, 'Ethernet'),
(28, 12, 'ArcNet'),
(29, 13, 'Fast Ethernet'),
(30, 13, 'Gigabit Ethernet'),
(31, 13, 'Ethernet'),
(32, 13, 'Tất cả đều đúng'),
(33, 14, 'Session'),
(34, 14, 'Application'),
(35, 14, 'Presentation'),
(36, 14, 'Tất cả đều đúng'),
(37, 15, '255255255252'),
(38, 15, '255255255254'),
(39, 15, '255255255248'),
(40, 15, '255255255240'),
(41, 16, 'Dịch vụ có xác nhận'),
(42, 16, 'Dịch vụ không xác nhận'),
(43, 16, 'Dịch vụ có kết nối'),
(44, 16, 'Dịch vụ không kết nối'),
(45, 17, 'Monitor'),
(46, 17, 'Token'),
(47, 17, 'Data'),
(48, 17, 'Token và Data'),
(49, 18, 'Mã hóa và định dạng dữ liệu'),
(50, 18, 'Tìm đường và kiểm soát tắc nghẽn'),
(51, 18, 'Truy cập môi trường mạng'),
(52, 18, 'Kiểm soát lỗi và kiểm soát lưu lượng'),
(53, 19, 'Truyền Token trên mạng hình sao'),
(54, 19, 'Truyền Token trên mạng dạng Bus'),
(55, 19, 'Chia packet ra thành từng frame nhỏ và truỵền đi trên mạng'),
(56, 19, 'Truy cập đường truyền và truyền lại dữ liệu nếu xảy ra đụng độ'),
(57, 20, 'Intranet'),
(58, 20, 'Ethernet'),
(59, 20, 'Arpanet'),
(60, 20, 'Token-bus'),
(61, 21, 'Xóa bỏ frame này'),
(62, 21, 'Gửi trả lại máy gốc'),
(63, 21, 'Gửi đến mọi ngõ ra còn lại'),
(64, 21, 'Giảm thời gian sống của frame đi 1 đơn vị và gửi đến mọi ngõ ra còn lại'),
(65, 22, 'Tìm đường'),
(66, 22, 'Mã hóa dữ liệu'),
(67, 22, 'Tạo địa chỉ vật lý'),
(68, 22, 'Kiểm soát lưu lượng'),
(69, 23, 'quốc gia'),
(70, 23, 'lục địa'),
(71, 23, 'khu phố'),
(72, 23, 'thành phố'),
(73, 24, 'bus'),
(74, 24, 'ring'),
(75, 24, 'star'),
(76, 24, 'tree'),
(77, 25, 'Terminator'),
(78, 25, 'Hub'),
(79, 25, 'Repeater'),
(80, 25, 'Tất cả đều đúng'),
(81, 26, 'ADCCP'),
(82, 26, 'HDLC'),
(83, 26, 'SDLC'),
(84, 26, 'PPP'),
(85, 27, 'IEEE 802.2'),
(86, 27, 'IEEE 802.3'),
(87, 27, 'IEEE 802.4'),
(88, 27, 'IEEE 802.5'),
(89, 28, 'Cáp quang'),
(90, 28, 'Xoắn đôi'),
(91, 28, 'Đồng trục'),
(92, 28, 'Tất cả đều đúgn'),
(93, 29, 'Network'),
(94, 29, 'Transport'),
(95, 29, 'Physical'),
(96, 29, 'Data link'),
(97, 30, 'Port'),
(98, 30, 'Địa chỉ IP'),
(99, 30, 'Địa chỉ cấp MAC'),
(100, 30, 'Protocol cấp Transport'),
(101, 31, 'Organization for Standard Institude'),
(102, 31, 'Organization for Standard Internet'),
(103, 31, 'Open Standard Institude'),
(104, 31, 'Open System Interconnection'),
(105, 32, 'middle area network'),
(106, 32, 'metropolitan area network'),
(107, 32, 'medium area network'),
(108, 32, 'multiple access network'),
(109, 33, 'tập các chức năng trong mạng'),
(110, 33, 'tập các cấp và các protocol trong mỗi cấp'),
(111, 33, 'tập các dịch vụ trong mạng'),
(112, 33, 'tập các protocol trong mạng'),
(113, 34, 'mỗi cấp thực hiện 1 chức năng rõ ràng'),
(114, 34, 'mỗi cấp được chọn sao cho thông tin trao đổi giữa các cấp tối thiểu'),
(115, 34, 'mỗi cấp được tạo ra ứng với 1 mức trừu tượng hóa'),
(116, 34, 'mỗi cấp phải cung cấp cùng một kiểu địa chỉ và dịch vụ'),
(117, 35, 'FDM'),
(118, 35, 'WDM'),
(119, 35, 'TDM'),
(120, 35, 'CSMA'),
(121, 36, 'Timer'),
(122, 36, 'Ack'),
(123, 36, 'Checksum'),
(124, 36, 'Tất cả đều đúng'),
(125, 37, 'IEEE 802.3'),
(126, 37, 'IEEE 802.4'),
(127, 37, 'IEEE 802.5'),
(128, 37, 'IEEE 802.6'),
(129, 38, '1Km'),
(130, 38, '10Km'),
(131, 38, '100Km'),
(132, 38, '1000Km'),
(133, 39, 'Thời gian thiết lập kết nối ngắn'),
(134, 39, 'Tỉ lệ sai sót rất nhỏ'),
(135, 39, 'Tốc độ đường truyền cao'),
(136, 39, 'Khả năng phục hồi khi có sự cố'),
(137, 40, 'Xác định host của địa chỉ IP'),
(138, 40, 'Xác định vùng network của địa chỉ IP'),
(139, 40, 'Lấy các bit trong vùng subnet làm địa chỉ host'),
(140, 40, 'Lấy các bit trong vùng địa chỉ host làm subnet'),
(141, 41, 'Nó phải truyền cho máy kế trong vòng'),
(142, 41, 'Nó được quyền truyền dữ liệu'),
(143, 41, 'Nó được quyền giữ lại Token'),
(144, 41, 'Tất cả đều sai'),
(145, 42, 'simplex'),
(146, 42, 'multiplex'),
(147, 42, 'half duplex'),
(148, 42, 'full duplex'),
(149, 43, '10Base-2'),
(150, 43, '10Base-5'),
(151, 43, '10Base-T'),
(152, 43, '10Base-F'),
(153, 44, 'Cáp quang'),
(154, 44, 'UTP và STP'),
(155, 44, 'Xoắn đôi'),
(156, 44, 'Đồng trục'),
(157, 45, 'Xác nhận, có kết nối'),
(158, 45, 'Xác nhận, không kết nôi'),
(159, 45, 'Không xác nhận, có kết nối'),
(160, 45, 'Không xác nhận, không kết nối'),
(161, 46, 'Thay đổi thứ tự truyền frame'),
(162, 46, 'Điều tiết tốc độ truyền frame'),
(163, 46, 'Thay đổi thời gian chờ time-out'),
(164, 46, 'Điều chỉnh kích thước frame'),
(165, 47, 'Ethernet'),
(166, 47, 'Token-ring'),
(167, 47, 'Token-bus'),
(168, 47, 'Tất cả đều sai'),
(169, 48, 'Giữa 2 đầu subnet'),
(170, 48, 'Giữa 2 máy tính trong mạng'),
(171, 48, 'Giữa 2 thiết bị trên đường truyền'),
(172, 48, 'Giữa 2 đầu đường truyền'),
(173, 49, 'Có nhiều kênh truyền hơn đường truyền'),
(174, 49, 'Có nhiều đường truyền hơn kênh truyền'),
(175, 49, 'Truyền dữ liệu số trên mạng điện thoại'),
(176, 49, 'Truyền dữ liệu tương tự trên mạng điện thọai'),
(177, 50, 'Chờ 1 thời gian ngẫu nhiên'),
(178, 50, 'Gửi tín hiệu tạo kết nối'),
(179, 50, 'Kiểm tra tình trạng đường truyền'),
(180, 50, 'Lập tức truyền dữ liệu'),
(181, 51, 'MAC'),
(182, 51, 'Socket'),
(183, 51, 'Domain'),
(184, 51, 'Port'),
(185, 52, 'point to point'),
(186, 52, 'có kết nối'),
(187, 52, 'không kết nối'),
(188, 52, 'broadcast'),
(189, 53, 'AUI'),
(190, 53, 'BNC'),
(191, 53, 'RJ11'),
(192, 53, 'RJ45'),
(193, 54, 'Sóng radio'),
(194, 54, 'Sống hồng ngoại'),
(195, 54, 'Sóng viba'),
(196, 54, 'Song cực ngắn'),
(197, 55, 'Mất đồng bộ trong khi truyền'),
(198, 55, 'Nhiễu từ môi trường'),
(199, 55, 'Lỗi phần cứng hoặc phần mềm'),
(200, 55, 'Tất cả đều đúng'),
(201, 56, 'Xác định đường truyền tốt hay xấu'),
(202, 56, 'Có kết nối được hay không'),
(203, 56, 'Nhận biết có xung đột hay không'),
(204, 56, 'Đường truyền đang rảnh hay bận'),
(205, 57, 'Ethernet'),
(206, 57, 'Token-ring'),
(207, 57, 'Token-bus'),
(208, 57, 'Tất cả đều sai'),
(209, 58, 'Có kết nối'),
(210, 58, 'Không kết nối'),
(211, 58, 'Truyền 1 chiều'),
(212, 58, 'Truyền 2 chiều'),
(213, 59, 'HTTP'),
(214, 59, 'NNTP'),
(215, 59, 'SMTP'),
(216, 59, 'FTP'),
(217, 60, 'Data link'),
(218, 60, 'Physical'),
(219, 60, 'Network'),
(220, 60, 'Transport'),
(221, 61, 'Application,Session,Transport,Physical'),
(222, 61, 'Application, Transport, Network, Physical'),
(223, 61, 'Application, Presentation,Session,Network,Transport,Data link,Physical'),
(224, 61, 'Application,Presentation,Session,Transport,Network,Data link,Physical'),
(225, 62, 'response and confirm'),
(226, 62, 'confirm and request'),
(227, 62, 'request and indication'),
(228, 62, 'indication and response'),
(229, 63, 'Mỗi cấp thực hiện 1 chức năng rõ ràng'),
(230, 63, 'Mỗi cấp được chọn sao cho thông tin trao đổi giữa các cấp tối thiểu'),
(231, 63, 'Mỗi cấp được tạo ra ứng với 1 mức trừu tượng hóa'),
(232, 63, 'Mỗi cấp phải cung cấp cùng 1 kiểu địa chỉ và dịch vụ'),
(233, 64, 'Quản lý địa chỉ mạng'),
(234, 64, 'Chuyển đổi các dạng frame khác nhau'),
(235, 64, 'Thiết lập và hủy bỏ dữ liệu'),
(236, 64, 'Mã hóa và giải mã dữ liệu'),
(237, 65, '32 kênh'),
(238, 65, '31 kênh'),
(239, 65, '30 kênh'),
(240, 65, '24 kênh'),
(241, 66, 'Đánh số thứ tự frame'),
(242, 66, 'Quản lý dữ liệu theo frame'),
(243, 66, 'Dùng vùng checksum'),
(244, 66, 'Tất cả đều đúng'),
(245, 67, 'ALOHA'),
(246, 67, 'CSMA'),
(247, 67, 'CSMA/CD'),
(248, 67, 'Tất cả đều đúng'),
(249, 68, 'Token-ring'),
(250, 68, 'Token-bus'),
(251, 68, 'Ethernet'),
(252, 68, 'Tất cả đều sai'),
(253, 69, 'Chỉ tìm đường 1 lần khi tạo kết nối'),
(254, 69, 'Phải tìm đường riêng cho từng packet'),
(255, 69, 'THông tin có sẵn trong packet, không cần tìm đường'),
(256, 69, 'Thông tin có sẵn trong router , không cần tìm đường'),
(257, 70, '192.0.0.0 - 223.0.0.0'),
(258, 70, '127.0.0.0 - 191.0.0.0'),
(259, 70, '128.0.0.0 - 191.0.0.0'),
(260, 70, '1.0.0.0 - 126.0.0.0'),
(261, 71, '2048 Mbps'),
(262, 71, '1544 Mbps'),
(263, 71, '155 Mbps'),
(264, 71, '56 Kbps'),
(265, 72, 'Mức điện áp'),
(266, 72, 'Địa chỉ vật lý'),
(267, 72, 'Mạch giao tiếp vật lý'),
(268, 72, 'Truyền các bit dữ liêu'),
(269, 73, 'Qui định truyền 1 hay 2 chiều'),
(270, 73, 'Quản lý lỗi sai'),
(271, 73, 'Xác định thời gian truyền 1 bit dữ liệu'),
(272, 73, 'Quản lý địa chỉ vật lý'),
(273, 74, 'Quản lý lỗi sai'),
(274, 74, 'Mã hóa dữ liệu'),
(275, 74, 'Tìm đường đi cho dữ liệu'),
(276, 74, 'Chọn kênh truyền'),
(277, 75, 'Quản lý lưu lượng đường truyền'),
(278, 75, 'Điều khiển hoạt động subnet'),
(279, 75, 'Nén dữ liệu'),
(280, 75, 'Chọn điện áp trên kênh truyền'),
(281, 76, 'Gói (packet switch)'),
(282, 76, 'Kênh (Circuit switch)'),
(283, 76, 'Thông báo(message switch)'),
(284, 76, 'Tất cả đều đúng'),
(285, 77, 'Presentation'),
(286, 77, 'Network'),
(287, 77, 'Data link'),
(288, 77, 'Physical'),
(289, 78, 'ALOHA'),
(290, 78, 'CSMA'),
(291, 78, 'CSMA/CD'),
(292, 78, 'Tất cả đều đúng'),
(293, 79, '185 bytes'),
(294, 79, '1500 bytes'),
(295, 79, '8182 bytes'),
(296, 79, 'Không giới hạn'),
(297, 80, 'Physical'),
(298, 80, 'Transport'),
(299, 80, 'Data link'),
(300, 80, 'Network'),
(301, 81, 'Có kết nối, độ tin cậy cao'),
(302, 81, 'Có kết nối, độ tin cậy thấp'),
(303, 81, 'Không kết nối, độ tin cậy cao'),
(304, 81, 'Không kết nối, độ tin cậy thấp'),
(305, 82, '1-persistent CSMA'),
(306, 82, 'p-persistent CSMA'),
(307, 82, 'Non-persistent CSMA'),
(308, 82, 'CSMA/CD'),
(309, 83, 'Chiều dài frame khác nhau'),
(310, 83, 'Cấu trúc frame khác nhau'),
(311, 83, 'Tốc độ truyền khác nhau'),
(312, 83, 'Chuẩn khác nhau'),
(313, 84, 'Tốc độ xử lý của router chậm'),
(314, 84, 'Buffers trong router nhỏ'),
(315, 84, 'Router có nhiều đường vào nhưng ít đường ra'),
(316, 84, 'Tất cả đều đúng'),
(317, 85, 'Địa chỉ Network và địa chỉ host'),
(318, 85, 'Địa chỉ physical và địa chỉ logical'),
(319, 85, 'Địa chỉ cấp MAC và và địa chỉ LLC'),
(320, 85, 'Địa chỉ hardware và địa chỉ software'),
(321, 86, 'had'),
(322, 86, 'should'),
(323, 86, 'used'),
(324, 86, 'have'),
(325, 87, 'they'),
(326, 87, 'their'),
(327, 87, 'theirs'),
(328, 87, 'them'),
(329, 88, 'yet'),
(330, 88, 'both'),
(331, 88, 'either'),
(332, 88, 'as well as'),
(333, 89, 'responsible'),
(334, 89, 'responsibly'),
(335, 89, 'responsive'),
(336, 89, 'responsibility'),
(337, 90, 'for'),
(338, 90, 'on'),
(339, 90, 'from'),
(340, 90, 'since'),
(341, 91, 'limit'),
(342, 91, 'limits'),
(343, 91, 'limited'),
(344, 91, 'limiting'),
(345, 92, 'sternly'),
(346, 92, 'strikingly'),
(347, 92, 'stringently'),
(348, 92, 'strongly'),
(349, 93, 'still'),
(350, 93, 'yet'),
(351, 93, 'already'),
(352, 93, 'soon'),
(353, 94, 'remark'),
(354, 94, 'check'),
(355, 94, 'notify'),
(356, 94, 'ensure'),
(357, 95, 'authoritative'),
(358, 95, 'summarized'),
(359, 95, 'examined'),
(360, 95, 'stable'),
(361, 96, 'arrange'),
(362, 96, 'arranged'),
(363, 96, 'arranges'),
(364, 96, 'arranging'),
(365, 97, 'popularity'),
(366, 97, 'regularity'),
(367, 97, 'celebrity'),
(368, 97, 'opportunity'),
(369, 98, 'compensation'),
(370, 98, 'commodity'),
(371, 98, 'compilation'),
(372, 98, 'complacency'),
(373, 99, 'reminded'),
(374, 99, 'respected'),
(375, 99, 'remembered'),
(376, 99, 'reacted'),
(377, 100, 'delays'),
(378, 100, 'cuisines'),
(379, 100, 'reservation'),
(380, 100, 'violations'),
(381, 101, 'because'),
(382, 101, 'althought'),
(383, 101, 'so that'),
(384, 101, 'than'),
(385, 102, 'recognize'),
(386, 102, 'recognizing'),
(387, 102, 'recognizable'),
(388, 102, 'recognizably'),
(389, 103, 'speak'),
(390, 103, 'speaker'),
(391, 103, 'speaking'),
(392, 103, 'speech'),
(393, 104, 'interest'),
(394, 104, 'interested'),
(395, 104, 'interesting'),
(396, 104, 'interestingly'),
(397, 105, 'to'),
(398, 105, 'about'),
(399, 105, 'at'),
(400, 105, 'upon'),
(401, 106, 'but'),
(402, 106, 'and'),
(403, 106, 'nor'),
(404, 106, 'either'),
(405, 107, 'you'),
(406, 107, 'your'),
(407, 107, 'yours'),
(408, 107, 'yourseld'),
(409, 108, 'reduced'),
(410, 108, 'reducing'),
(411, 108, 'reduce'),
(412, 108, 'reduces'),
(413, 109, 'tip'),
(414, 109, 'make'),
(415, 109, 'dial'),
(416, 109, 'number'),
(417, 110, 'varied'),
(418, 110, 'various'),
(419, 110, 'vary'),
(420, 110, 'variety'),
(421, 111, 'Totally'),
(422, 111, 'Negatively'),
(423, 111, 'Decidedly'),
(424, 111, 'Rarely'),
(425, 112, 'of'),
(426, 112, 'to'),
(427, 112, 'from'),
(428, 112, 'for'),
(429, 113, 'sale'),
(430, 113, 'sold'),
(431, 113, 'are selling'),
(432, 113, 'were sold'),
(433, 114, 'enough'),
(434, 114, 'many'),
(435, 114, 'very'),
(436, 114, 'plenty'),
(437, 115, 'recipient'),
(438, 115, 'receiving'),
(439, 115, 'receipt'),
(440, 115, 'receptive'),
(441, 116, 'them'),
(442, 116, 'their'),
(443, 116, 'theirs'),
(444, 116, 'they'),
(445, 117, 'negotiations'),
(446, 117, 'dedications'),
(447, 117, 'propositions'),
(448, 117, 'announcements'),
(449, 118, 'emerge'),
(450, 118, 'substantiate'),
(451, 118, 'adapt'),
(452, 118, 'submit'),
(453, 119, 'same'),
(454, 119, 'same as'),
(455, 119, 'the same'),
(456, 119, 'the same as'),
(457, 120, 'carry'),
(458, 120, 'do'),
(459, 120, 'hold'),
(460, 120, 'take'),
(461, 121, 'beyond'),
(462, 121, 'above'),
(463, 121, 'inside'),
(464, 121, 'around'),
(465, 122, 'favorite'),
(466, 122, 'favor'),
(467, 122, 'favorable'),
(468, 122, 'favorably'),
(469, 123, 'confusion'),
(470, 123, 'confuse'),
(471, 123, 'confused'),
(472, 123, 'confusing'),
(473, 124, 'increased'),
(474, 124, 'increasingly'),
(475, 124, 'increases'),
(476, 124, 'increase'),
(477, 125, 'During'),
(478, 125, 'Only'),
(479, 125, 'Unless'),
(480, 125, 'Because'),
(481, 126, 'signal'),
(482, 126, 'cash'),
(483, 126, 'report'),
(484, 126, 'notice'),
(485, 127, 'diversity'),
(486, 127, 'clarify'),
(487, 127, 'intensify'),
(488, 127, 'modify'),
(489, 128, 'which'),
(490, 128, 'it'),
(491, 128, 'that'),
(492, 128, 'both'),
(493, 129, 'anxious'),
(494, 129, 'evident'),
(495, 129, 'eager'),
(496, 129, 'outstanding'),
(497, 130, 'near'),
(498, 130, 'by'),
(499, 130, 'for'),
(500, 130, 'on'),
(501, 131, 'thoroughness'),
(502, 131, 'more thorough'),
(503, 131, 'thorough'),
(504, 131, 'thoroughly'),
(505, 132, 'addition'),
(506, 132, 'additive'),
(507, 132, 'additionally'),
(508, 132, 'additional'),
(509, 133, 'development'),
(510, 133, 'developed'),
(511, 133, 'develops'),
(512, 133, 'developer'),
(513, 134, 'local'),
(514, 134, 'locality'),
(515, 134, 'locally'),
(516, 134, 'location'),
(517, 135, 'demonstrate'),
(518, 135, 'appear'),
(519, 135, 'valve'),
(520, 135, 'position'),
(521, 136, 'complete'),
(522, 136, 'completely'),
(523, 136, 'completed'),
(524, 136, 'completing'),
(525, 137, 'knowledge'),
(526, 137, 'thought'),
(527, 137, 'idea'),
(528, 137, 'willingness'),
(529, 138, 'accessible'),
(530, 138, 'accessing'),
(531, 138, 'accessibility'),
(532, 138, 'accesses'),
(533, 139, 'waste'),
(534, 139, 'wasteful'),
(535, 139, 'wasting'),
(536, 139, 'wasted'),
(537, 140, 'common'),
(538, 140, 'standard'),
(539, 140, 'average'),
(540, 140, 'general'),
(541, 141, 'unless'),
(542, 141, 'from'),
(543, 141, 'to'),
(544, 141, 'since'),
(545, 142, 'always'),
(546, 142, 'rarely'),
(547, 142, 'once'),
(548, 142, 'ever'),
(549, 143, 'continuity'),
(550, 143, 'continue'),
(551, 143, 'continuing'),
(552, 143, 'continuous'),
(553, 144, 'attentive'),
(554, 144, 'attentively'),
(555, 144, 'attention'),
(556, 144, 'attentiveness'),
(557, 145, 'she'),
(558, 145, 'herself'),
(559, 145, 'her'),
(560, 145, 'hers'),
(561, 146, '128 - 191'),
(562, 146, '192 - 232'),
(563, 146, '224 - 239'),
(564, 146, '240 - 247'),
(565, 147, 'Điạ chỉ nguồn'),
(566, 147, 'Địa chỉ đích'),
(567, 147, 'Địa chỉ mạng'),
(568, 147, 'Tất cả đều đúng'),
(569, 148, 'Cáp quang'),
(570, 148, 'Xoắn đôi'),
(571, 148, 'Đồng trục'),
(572, 148, 'Tất cả đều đúng'),
(573, 149, 'Xoắn đôi'),
(574, 149, 'Đồng trục'),
(575, 149, 'Cáp quang'),
(576, 149, 'Mạng không dây'),
(577, 150, 'Địa chỉ cấp Data link có kích thước nhỏ hơn địa chỉ cấp Network'),
(578, 150, 'Địa chỉ cấp Data link là đia chỉ Physic, địa chỉ cấp Network là địa chỉ Logic'),
(579, 150, 'Địa chỉ cấp Data Link là địa chỉ Logic, địa chỉ câp Network là địa chỉ Physic'),
(580, 150, 'Địa chỉ Data link cấu hình theo mạng, địa chỉ cấp Network xác định theo IEEE'),
(581, 151, 'Hủy kết nối'),
(582, 151, 'Tạo kết nối'),
(583, 151, 'Truyền dữ liệu'),
(584, 151, 'Tìm đường cho từng gói tin'),
(585, 152, 'Session'),
(586, 152, 'Transport'),
(587, 152, 'Application'),
(588, 152, 'Presentation'),
(589, 153, 'Kiểm soát lỗi'),
(590, 153, 'Địa chỉ vật lý'),
(591, 153, 'Kiểm soát lưu lượng'),
(592, 153, 'Thiết lập kết nối'),
(593, 154, 'UTP và STP'),
(594, 154, 'SMTP và HTTP'),
(595, 154, 'ASCII và EBCDIC'),
(596, 154, 'TCP và UDP'),
(597, 155, 'Tách và ghép tín hiệu'),
(598, 155, 'Nén và gải nén tín hiệu'),
(599, 155, 'Mã hóa và giải mã tín hiệu'),
(600, 155, 'Điều chế và giải điều chế tín hiệu'),
(601, 156, 'Data link'),
(602, 156, 'Network'),
(603, 156, 'Application'),
(604, 156, 'Presentation'),
(605, 157, 'Ack'),
(606, 157, 'Buffer'),
(607, 157, 'Windowing'),
(608, 157, 'Multiplexing'),
(609, 158, 'Tập các chuẩn truyền dữ liệu'),
(610, 158, 'Tập các cấp mạng trong mô hình OSI'),
(611, 158, 'Tập các chức năng của từng cấp trong mạng'),
(612, 158, 'Tập các qui tắc và cấu trúc dữ liệu để truyền thông giữa các cấp mạng'),
(613, 159, '100BaseF'),
(614, 159, '100Base2'),
(615, 159, '100BaseT'),
(616, 159, '100Base5'),
(617, 160, 'Độ tin cậy'),
(618, 160, 'Thứ tự nhận dữ liệu không đúng'),
(619, 160, 'Đường truyền không thay đổi'),
(620, 160, 'Đường truyền thay đổi liên tục'),
(621, 161, 'bit,frame,packet,data'),
(622, 161, 'bit,packet,frame,data'),
(623, 161, 'data,frame,packet,bit'),
(624, 161, 'data,bit,packet,frame'),
(625, 162, 'Peer to peer'),
(626, 162, 'Point to point'),
(627, 162, 'Broadcast'),
(628, 162, 'Multiple Access'),
(629, 163, 'Mã hóa tín hiệu'),
(630, 163, 'Triệt tiêu tín hiệu'),
(631, 163, 'Phân chia tín hiệu'),
(632, 163, 'Điều chế tín hiếu'),
(633, 164, 'Transport'),
(634, 164, 'Physical'),
(635, 164, 'Network'),
(636, 164, 'Application'),
(637, 165, '1 Mbps'),
(638, 165, '10 Mbps'),
(639, 165, '100 Mbps'),
(640, 165, '1000 Mbps'),
(641, 166, 'Không ACK'),
(642, 166, 'Dễ sử dụng'),
(643, 166, 'Độ tin cậy'),
(644, 166, 'Không kết nối'),
(645, 167, 'ANSI'),
(646, 167, 'ISO'),
(647, 167, 'IEEE'),
(648, 167, 'XEROX'),
(649, 168, 'Ethernet'),
(650, 168, 'Token-ring'),
(651, 168, 'Token-bus'),
(652, 168, 'Tất cả đều đúng'),
(653, 169, 'Hub'),
(654, 169, 'Repeater'),
(655, 169, 'Router'),
(656, 169, 'Bridge'),
(657, 170, 'Để mọi người sử dụng cùng 1 ứng dụng mạng'),
(658, 170, 'Để phân biệt giữa chuẩn mạng và ứng dụng mạng'),
(659, 170, 'Giảm độ phức tạp trong việc thiết kế và cài đặt'),
(660, 170, 'Các cấp khác không cần sửa đổi khi thay đổi 1 cấp mạng'),
(661, 171, 'Half duplex'),
(662, 171, 'Full duplex'),
(663, 171, 'Simplex'),
(664, 171, 'Monoplex'),
(665, 172, 'Dịch vụ không kết nối và có kết nối'),
(666, 172, 'Dich vụ có xác nhận và không xác nhận'),
(667, 172, 'Dịch vụ có độ tin cậy cao và có độ tin cậy thấp'),
(668, 172, 'Tất cả đều đúng'),
(669, 173, '255.0.0.0'),
(670, 173, '255.255.0.0'),
(671, 173, '255.255.255.0'),
(672, 173, '255255255255'),
(673, 174, '10Base2'),
(674, 174, '10Base5'),
(675, 174, '10BaseT'),
(676, 174, '10BaseF'),
(677, 175, 'Tìm đường theo chiều sâu'),
(678, 175, 'Tìm đường theo chiều rộng'),
(679, 175, 'Tìm đường theo vector khoảng cách'),
(680, 175, 'Tìm đường theo trạng thái đường truyền'),
(681, 176, 'Nén dữ liệu'),
(682, 176, 'Lọc bớt dữ liệu theo địa chỉ vật lý'),
(683, 176, 'Lọc bớt dữ liệu theo địa chỉ logic'),
(684, 176, 'Cấm truyền dữ liệu broadcasr'),
(685, 177, 'Là 1 cầu nối tốc độ cao'),
(686, 177, 'Nhận data từ 1 cổng và xuất ra mọi cổng còn lại'),
(687, 177, 'Nhận data từ 1 cổng và xuất ra  cổng đích tùy theo địa chỉ cấp IP'),
(688, 177, 'Nhận data từ 1 cổng và xuất ra 1 cổng đích tùy theo địa chỉ cấp MAC'),
(689, 178, 'Bit'),
(690, 178, 'Frame'),
(691, 178, 'Packet'),
(692, 178, 'Segment'),
(693, 179, 'Đồng trục'),
(694, 179, 'Xoắn đôi'),
(695, 179, 'Cáp quang'),
(696, 179, 'Tất cả đều đúng'),
(697, 180, 'Địa chỉ network 100, địa chỉ host 150.200.250'),
(698, 180, 'Địa chỉ network 100.150, địa chỉ host 200.250'),
(699, 180, 'Địa chỉ network 100.150.200, địa chỉ host 250'),
(700, 180, 'Tất cả đều sai'),
(701, 181, '1-presistent CSMA'),
(702, 181, 'p-presistent CSMA'),
(703, 181, 'Non-presistent CSMA'),
(704, 181, 'CSMA/CD'),
(705, 182, 'Lớp A'),
(706, 182, 'Lớp B'),
(707, 182, 'Lớp C'),
(708, 182, 'Lớp D'),
(709, 183, 'IP'),
(710, 183, 'ARP'),
(711, 183, 'ICMP'),
(712, 183, 'RARP'),
(713, 184, 'Giảm collision trên mạng'),
(714, 184, 'Tăng collision trên mạng'),
(715, 184, 'Giảm congestion trên mạng'),
(716, 184, 'Tăng congestion trên mạng'),
(717, 185, 'Phân biệt đầu và cuối frame'),
(718, 185, 'Bổ sung cho đủ kích thước frame tối thiểu'),
(719, 185, 'Phân cách nhiều bit 0 bằng bit 1'),
(720, 185, 'Biến đổi dạng dữ liệu 8 bit ra 16 bit'),
(721, 186, 'Router'),
(722, 186, 'Repeater'),
(723, 186, 'Máy tính'),
(724, 186, 'Tất cả đều đúng'),
(725, 187, '2'),
(726, 187, '3'),
(727, 187, '4'),
(728, 187, '5'),
(729, 188, 'TDM'),
(730, 188, 'FDM'),
(731, 188, 'WDM'),
(732, 188, 'CDMA'),
(733, 189, 'Đánh số thứ tự các frame'),
(734, 189, 'Quy định kích thước frame cố định'),
(735, 189, 'Chờ nhận ACK mới gửi frame kế tiếp'),
(736, 189, 'So sánh và loại bỏ các frame giống nhau'),
(737, 190, 'Có 4 đôi dây'),
(738, 190, 'Không cần repeater'),
(739, 190, 'Truyền tín hiệu ánh sáng'),
(740, 190, 'Chống nhiễu tốt hơn UTP'),
(741, 191, 'Kiểm tra để bảo đảm dữ liệu truyền đến đích'),
(742, 191, 'Kiểm tra đường truyền nếu rảnh mới truyền dữ liệu'),
(743, 191, 'Chờ 1 thời gian ngẫu nhiên rồi truyền  dữ liệu kế tiếp'),
(744, 191, 'Tất cả đều đúng'),
(745, 192, 'Router'),
(746, 192, 'Repeater'),
(747, 192, 'Bridge'),
(748, 192, 'Tất cả đều đúng'),
(749, 193, 'Tìm đường'),
(750, 193, 'Địa chỉ logic'),
(751, 193, 'Kiểm soát tắc nghẽn'),
(752, 193, 'Chất lượng dịch vụ'),
(753, 194, 'Giảm tốc độ đường truyền'),
(754, 194, 'Tăng phí tổn đường truyền'),
(755, 194, 'Mất đồng bộ frame'),
(756, 194, 'Không nhận diện được frame'),
(757, 195, 'Đo thời gian chơ frame'),
(758, 195, 'Tránh tình trạng mất frame'),
(759, 195, 'Chọn thời điểm truyền frame'),
(760, 195, 'Kiểm soát thòi gian truyền frame'),
(761, 196, 'Truyền dữ liệu cho các cấp khác trong mạng'),
(762, 196, 'Cung cấp dịch vụ cho chương trình ứng dụng'),
(763, 196, 'Nhận tín hiệu yếu,lọc,khuếch đại và phát lại trên mạng'),
(764, 196, 'Bảo đảm đường truyền dữ liệu tin cậy giữa 2 đầu đường truyền'),
(765, 197, 'Gồm có 32 bit'),
(766, 197, 'Còn gọi là địa chỉ logic'),
(767, 197, 'Nằm trong cấp Network'),
(768, 197, 'Dùng để phân biệt các máy trong mạng'),
(769, 198, 'Ethernet'),
(770, 198, 'Token-ring'),
(771, 198, 'Token-bus'),
(772, 198, 'Tất cả đều sai'),
(773, 199, 'Phân cách các frame'),
(774, 199, 'Phân biệt dữ liệu và ký tự điều khiển'),
(775, 199, 'Nhận diện đầu cuối frame'),
(776, 199, 'Bổ sung cho đủ kich thước frame tối thiểu'),
(777, 200, 'Chèn bit'),
(778, 200, 'Đếm ký tự'),
(779, 200, 'Chèn ký tự'),
(780, 200, 'Tất cả đều đúng'),
(781, 201, 'Transport'),
(782, 201, 'Network'),
(783, 201, 'Data link'),
(784, 201, 'Physical'),
(785, 202, 'Địa chĩ vật lý'),
(786, 202, 'Địa chỉ luận lý'),
(787, 202, 'Địa chỉ thập phân'),
(788, 202, 'Địa chỉ thập lục phân'),
(789, 203, 'Broadcast'),
(790, 203, 'Broadbase'),
(791, 203, 'Broadband'),
(792, 203, 'Broadway'),
(793, 204, 'Broadcast'),
(794, 204, 'Digital'),
(795, 204, 'Baseband'),
(796, 204, 'Broadband'),
(797, 205, 'FDDI'),
(798, 205, 'CDDI'),
(799, 205, 'Fast Ethernet'),
(800, 205, '100VG-AnyLAN'),
(801, 206, 'Ethernet và Token-bus'),
(802, 206, 'ISDN và Frame relay'),
(803, 206, 'Token-ring và FDDI'),
(804, 206, 'SDLC và HDLC'),
(805, 207, 'Thiết lập, quản lý và kết thúc các ứng dụng'),
(806, 207, 'Hướng dẫn cách mô tả hình ảnh, âm thanh, tiếng nói'),
(807, 207, 'Cung cấp dịch vụ truyền dữ liệu từ nguồn đến đích'),
(808, 207, 'Hỗ trợ việc truyền thông trong các ứng dụng như web, mail...'),
(809, 208, 'Bridge'),
(810, 208, 'Repeater'),
(811, 208, 'Router'),
(812, 208, 'Gateway'),
(813, 209, 'IP'),
(814, 209, 'TCP'),
(815, 209, 'UDP'),
(816, 209, 'FTP'),
(817, 210, 'SHF'),
(818, 210, 'LF và MF'),
(819, 210, 'UHF và VHF'),
(820, 210, 'Tất cả đều đúng'),
(821, 211, 'Hub'),
(822, 211, 'Bridge'),
(823, 211, 'Router'),
(824, 211, 'Repeater'),
(825, 212, 'Hub'),
(826, 212, 'Host'),
(827, 212, 'Bridge'),
(828, 212, 'Router'),
(829, 213, 'Qui luật (rule)'),
(830, 213, 'Nghi thức (protocol)'),
(831, 213, 'Tiêu chuẩn (standard)'),
(832, 213, 'Mô hình (model)'),
(833, 214, 'Hub'),
(834, 214, 'Switch'),
(835, 214, 'Repeater'),
(836, 214, 'Router'),
(837, 215, 'IP'),
(838, 215, 'TCP'),
(839, 215, 'UDP'),
(840, 215, 'FTP'),
(841, 216, 'Trời mưa'),
(842, 216, 'Sấm chớp'),
(843, 216, 'Giông bão'),
(844, 216, 'Ánh sáng mặt trời'),
(845, 217, 'Radio,viba,hồng ngoại'),
(846, 217, 'Radio,hồng ngoại,viba'),
(847, 217, 'Hồng ngoại,viba,radio'),
(848, 217, 'Viba,radio,hồng ngoại'),
(849, 218, 'bps(bit per second)'),
(850, 218, 'Bps(Byte per second)'),
(851, 218, 'mps(meter per second)'),
(852, 218, 'hertz (ccle per second)'),
(853, 219, 'Định hướng phát triển phần cứng và phần mềm mới'),
(854, 219, 'LAN,MAN và WAN sử dụng các thiết bị khác nhau'),
(855, 219, 'Kết nối mạng giữa các quôc gia khác nhau'),
(856, 219, 'Tương thích về công nghệ để truyền thông được lẫn nhau'),
(857, 220, '5 segment trong 1 mạng'),
(858, 220, '5 repeater trong 1 mạng'),
(859, 220, '5 máy tính trong 1 mạng'),
(860, 220, '5 máy tính trong 1 segment'),
(861, 221, 'IP'),
(862, 221, 'TCP'),
(863, 221, 'UDP'),
(864, 221, 'FTP'),
(865, 222, 'Tín hiệu số'),
(866, 222, 'Kỹ thuật dồn kênh'),
(867, 222, 'Cáp quang, cáp đồng và viba'),
(868, 222, 'Tất cả đêu đúng'),
(869, 223, 'Digital'),
(870, 223, 'Analog'),
(871, 223, 'Manchester'),
(872, 223, 'T1 hoặc E1'),
(873, 224, 'Lọc bớt dữ liệu trên mạng'),
(874, 224, 'Tăng tốc độ lưu thông trên mạng'),
(875, 224, 'Tăng thời gian trễ trên mạng'),
(876, 224, 'Mở rộng chiều dài đường truyền'),
(877, 225, 'Mã ASCII'),
(878, 225, 'Số nhị phân'),
(879, 225, 'Không và một'),
(880, 225, 'Xung điện áp');

-- --------------------------------------------------------

--
-- Table structure for table `dang_ky_thi`
--

CREATE TABLE `dang_ky_thi` (
  `id_dang_ky_thi` bigint NOT NULL,
  `ma_lop` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ma_mh` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `trinh_do` enum('CĐ','VB2','ĐH') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ngay_thi` date DEFAULT NULL,
  `thoi_gian` int DEFAULT NULL,
  `ma_gv` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `trang_thai` enum('Cho_phe_duyet','Da_phe_duyet','Tu_choi') COLLATE utf8mb4_vietnamese_ci DEFAULT 'Cho_phe_duyet',
  `nguoi_phe_duyet` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `giao_vien`
--

CREATE TABLE `giao_vien` (
  `ma_gv` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ho` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ten` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `hoc_vi` enum('CuNhan','ThacSi','TienSi') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ma_khoa` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_vietnamese_ci,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `giao_vien`
--

INSERT INTO `giao_vien` (`ma_gv`, `id_tai_khoan`, `ho`, `ten`, `hoc_vi`, `ma_khoa`, `hinh_anh`, `ghi_chu`, `email`) VALUES
('GV01', 1, 'Nguyen', 'An', 'CuNhan', 'CNTT', '20251130_105432_3333', '', 'vantien18122002@gmail.com'),
('GV02', 4, 'Lê Văn', 'Tiến', 'CuNhan', 'CNTT', '20251201_113725_giaoVien', 'sdf', 'GV03@gmail.com'),
('GV03', NULL, 'Nguyễn Thị Kim', 'Anh', 'ThacSi', 'DPT', '', '', 'gv03@teacher.ptithcm.edu.vn'),
('gv04', NULL, 'Phan Mạnh', 'Quỳnh', 'ThacSi', 'KT', '', '', 'gv04@teacher.ptithcm.edu.vn');

-- --------------------------------------------------------

--
-- Table structure for table `khoa`
--

CREATE TABLE `khoa` (
  `ma_khoa` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `ten_khoa` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `khoa`
--

INSERT INTO `khoa` (`ma_khoa`, `ten_khoa`) VALUES
('ATTT', 'An Toàn Thông Tin'),
('CNTT', 'Công nghệ thông tin'),
('DPT', 'Đa Phương Tiện'),
('KT', 'Kinh tế'),
('VL', 'Vật lý');

-- --------------------------------------------------------

--
-- Table structure for table `lop`
--

CREATE TABLE `lop` (
  `ma_lop` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `ten_lop` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `nam_nhap_hoc` date DEFAULT NULL,
  `ma_khoa` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `lop`
--

INSERT INTO `lop` (`ma_lop`, `ten_lop`, `nam_nhap_hoc`, `ma_khoa`) VALUES
('CNTT01', 'D19CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT02', 'D20CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT03', 'D21CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT04', 'D22CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT05', 'D23CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT06', 'D24CQCN01-N', '2025-12-09', 'CNTT'),
('CNTT07', 'D25CQCN01-N', '2025-12-09', 'CNTT'),
('KT01', 'KT K63', '2020-09-01', 'KT'),
('PT01', 'D21CQPTUD01-N', '2025-12-09', 'DPT');

-- --------------------------------------------------------

--
-- Table structure for table `mon_hoc`
--

CREATE TABLE `mon_hoc` (
  `ma_mh` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `ten_mh` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `mon_hoc`
--

INSERT INTO `mon_hoc` (`ma_mh`, `ten_mh`) VALUES
('AVCB', 'Anh Văn'),
('ELE1433', 'Kỹ Thuật Số'),
('INT13147', 'Thực tập cơ sở'),
('INT1405', 'Các hệ thống phân tán'),
('MH01', 'Toán cao cấp'),
('MH02', 'Lập trình cơ bản'),
('MMTCB', 'Mạng Máy Tính');

-- --------------------------------------------------------

--
-- Table structure for table `sinh_vien`
--

CREATE TABLE `sinh_vien` (
  `ma_sv` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ho` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ten` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `phai` enum('Nam','Nu') COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `dia_chi` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `ma_lop` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `sinh_vien`
--

INSERT INTO `sinh_vien` (`ma_sv`, `id_tai_khoan`, `ho`, `ten`, `phai`, `dia_chi`, `ngay_sinh`, `ma_lop`, `hinh_anh`, `email`) VALUES
('SV01', 3, 'Tran', 'Binh', 'Nam', 'xgf', '2025-11-04', 'KT01', '20251130_105456_22222', 'binh.tran@student.edu'),
('SV02', 5, 'Nguyễn Văn', 'Nguyễn', 'Nam', 'sdf', '2025-11-18', 'KT01', '20251201_134054_1112', 'dfdf@gmail.com'),
('SV03', 6, 'Nguyễn Văn', 'Đăng', 'Nam', 'sdf', '2025-11-25', 'KT01', NULL, 'SV02@gmail.com'),
('SV04', 9, 'Nguyễn Thành', 'Vinh', 'Nam', 'sdf', '2025-11-23', 'KT01', NULL, '111@gmail.com'),
('SV05', 10, 'Dương Thị', 'Bình', 'Nam', 'dsf', NULL, 'KT01', NULL, 'binh@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id_tai_khoan` bigint NOT NULL,
  `ten_dang_nhap` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `vai_tro` enum('GiaoVu','GiaoVien','SinhVien') COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`id_tai_khoan`, `ten_dang_nhap`, `mat_khau`, `vai_tro`) VALUES
(1, 'giaovu01', '$2b$10$umfPIAiqDzMCxaFOfNCoQejuiUDfQ443qjZ0FnLgfzrb7ZW8IfA5m', 'GiaoVu'),
(2, 'gv01', '$2b$10$umfPIAiqDzMCxaFOfNCoQejuiUDfQ443qjZ0FnLgfzrb7ZW8IfA5m', 'GiaoVien'),
(3, 'SV01', '$2b$10$umfPIAiqDzMCxaFOfNCoQejuiUDfQ443qjZ0FnLgfzrb7ZW8IfA5m', 'SinhVien'),
(4, 'gv03', '$2b$10$GI.4xI7WYrmcGKcRQ4jTaOSANc81atBw6Fr8IjojBaNSXvpue619K', 'GiaoVien'),
(5, 'SV02', '$2b$10$oMqGaVk81P4.fQ7AMeNFOOWL2Q9QUPz1O/DzC/cpQnnf2CTEzanc6', 'SinhVien'),
(6, 'SV03', '$2b$10$57.YbbRMnwToUbf99WsxdOYotNPT0nLMw9e4C86CY103hiDXZiVdu', 'SinhVien'),
(7, 'gv02', '$2b$10$w8WnnEgyr8r/4N6SZIHb/u8p3pgKZxpkw77N.IE89lQ8QebfQ/vfa', 'GiaoVien'),
(9, 'SV04', '$2b$10$UqlkeKrI7zY8PJTodGhGwO/.pJmbbpJNisoLViyhsWaMC9WKyiaDi', 'SinhVien'),
(10, 'SV05', '$2b$10$uSTHiDVn8fAkOIvdTLTU9.7zLlEjZSImdJiCrccZ9qeTA/HLtuGyy', 'SinhVien'),
(11, 'SV06', '$2b$10$9Urio27LBA6.u5pbiOPWG.WQMy9RrHsxloae0e1wqCjTv3dRHjTcC', 'SinhVien'),
(12, 'SV07', '$2b$10$NBA1A77y.3P3uuo4R1SSa.pv2Y7GklTuqO4Bvgg/MdUnU06SkYDa6', 'SinhVien'),
(13, 'SV08', '$2b$10$OC3Et7x86MVYWdt3oXofTOCRqYBVXBVFclWegxKuox94.QHk4pSMe', 'SinhVien');

-- --------------------------------------------------------

--
-- Table structure for table `thi`
--

CREATE TABLE `thi` (
  `id_dang_ky_thi` bigint NOT NULL,
  `ma_sv` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `thoi_gian_bat_dau` datetime DEFAULT NULL,
  `thoi_gian_ket_thuc` datetime DEFAULT NULL,
  `diem` float DEFAULT NULL,
  `trang_thai` enum('Dang_lam','Hoan_thanh','Bi_ket_thuc_tg') COLLATE utf8mb4_vietnamese_ci DEFAULT 'Hoan_thanh'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cau_hoi`
--
ALTER TABLE `cau_hoi`
  ADD PRIMARY KEY (`id_ch`),
  ADD KEY `ma_mh` (`ma_mh`),
  ADD KEY `ma_gv` (`ma_gv`);

--
-- Indexes for table `chi_tiet_dang_ky_thi`
--
ALTER TABLE `chi_tiet_dang_ky_thi`
  ADD PRIMARY KEY (`id_dang_ky_thi`,`chuong_so`);

--
-- Indexes for table `chi_tiet_thi`
--
ALTER TABLE `chi_tiet_thi`
  ADD PRIMARY KEY (`id_dang_ky_thi`,`ma_sv`,`stt`),
  ADD KEY `ma_sv` (`ma_sv`),
  ADD KEY `id_ch` (`id_ch`);

--
-- Indexes for table `chon_lua`
--
ALTER TABLE `chon_lua`
  ADD PRIMARY KEY (`id_chon_lua`),
  ADD KEY `id_ch` (`id_ch`);

--
-- Indexes for table `dang_ky_thi`
--
ALTER TABLE `dang_ky_thi`
  ADD PRIMARY KEY (`id_dang_ky_thi`),
  ADD UNIQUE KEY `ma_lop` (`ma_lop`,`ma_mh`),
  ADD KEY `ma_mh` (`ma_mh`),
  ADD KEY `ma_gv` (`ma_gv`),
  ADD KEY `nguoi_phe_duyet` (`nguoi_phe_duyet`);

--
-- Indexes for table `giao_vien`
--
ALTER TABLE `giao_vien`
  ADD PRIMARY KEY (`ma_gv`),
  ADD UNIQUE KEY `id_tai_khoan` (`id_tai_khoan`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `ma_khoa` (`ma_khoa`);

--
-- Indexes for table `khoa`
--
ALTER TABLE `khoa`
  ADD PRIMARY KEY (`ma_khoa`);

--
-- Indexes for table `lop`
--
ALTER TABLE `lop`
  ADD PRIMARY KEY (`ma_lop`),
  ADD KEY `ma_khoa` (`ma_khoa`);

--
-- Indexes for table `mon_hoc`
--
ALTER TABLE `mon_hoc`
  ADD PRIMARY KEY (`ma_mh`);

--
-- Indexes for table `sinh_vien`
--
ALTER TABLE `sinh_vien`
  ADD PRIMARY KEY (`ma_sv`),
  ADD UNIQUE KEY `id_tai_khoan` (`id_tai_khoan`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `ma_lop` (`ma_lop`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id_tai_khoan`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`);

--
-- Indexes for table `thi`
--
ALTER TABLE `thi`
  ADD PRIMARY KEY (`id_dang_ky_thi`,`ma_sv`),
  ADD KEY `ma_sv` (`ma_sv`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cau_hoi`
--
ALTER TABLE `cau_hoi`
  MODIFY `id_ch` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=226;

--
-- AUTO_INCREMENT for table `chon_lua`
--
ALTER TABLE `chon_lua`
  MODIFY `id_chon_lua` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=881;

--
-- AUTO_INCREMENT for table `dang_ky_thi`
--
ALTER TABLE `dang_ky_thi`
  MODIFY `id_dang_ky_thi` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id_tai_khoan` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cau_hoi`
--
ALTER TABLE `cau_hoi`
  ADD CONSTRAINT `cau_hoi_ibfk_1` FOREIGN KEY (`ma_mh`) REFERENCES `mon_hoc` (`ma_mh`),
  ADD CONSTRAINT `cau_hoi_ibfk_2` FOREIGN KEY (`ma_gv`) REFERENCES `giao_vien` (`ma_gv`);

--
-- Constraints for table `chi_tiet_dang_ky_thi`
--
ALTER TABLE `chi_tiet_dang_ky_thi`
  ADD CONSTRAINT `chi_tiet_dang_ky_thi_ibfk_1` FOREIGN KEY (`id_dang_ky_thi`) REFERENCES `dang_ky_thi` (`id_dang_ky_thi`);

--
-- Constraints for table `chi_tiet_thi`
--
ALTER TABLE `chi_tiet_thi`
  ADD CONSTRAINT `chi_tiet_thi_ibfk_1` FOREIGN KEY (`id_dang_ky_thi`) REFERENCES `dang_ky_thi` (`id_dang_ky_thi`),
  ADD CONSTRAINT `chi_tiet_thi_ibfk_2` FOREIGN KEY (`ma_sv`) REFERENCES `sinh_vien` (`ma_sv`),
  ADD CONSTRAINT `chi_tiet_thi_ibfk_3` FOREIGN KEY (`id_ch`) REFERENCES `cau_hoi` (`id_ch`);

--
-- Constraints for table `chon_lua`
--
ALTER TABLE `chon_lua`
  ADD CONSTRAINT `chon_lua_ibfk_1` FOREIGN KEY (`id_ch`) REFERENCES `cau_hoi` (`id_ch`);

--
-- Constraints for table `dang_ky_thi`
--
ALTER TABLE `dang_ky_thi`
  ADD CONSTRAINT `dang_ky_thi_ibfk_1` FOREIGN KEY (`ma_lop`) REFERENCES `lop` (`ma_lop`),
  ADD CONSTRAINT `dang_ky_thi_ibfk_2` FOREIGN KEY (`ma_mh`) REFERENCES `mon_hoc` (`ma_mh`),
  ADD CONSTRAINT `dang_ky_thi_ibfk_3` FOREIGN KEY (`ma_gv`) REFERENCES `giao_vien` (`ma_gv`),
  ADD CONSTRAINT `dang_ky_thi_ibfk_4` FOREIGN KEY (`nguoi_phe_duyet`) REFERENCES `giao_vien` (`ma_gv`);

--
-- Constraints for table `giao_vien`
--
ALTER TABLE `giao_vien`
  ADD CONSTRAINT `giao_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id_tai_khoan`),
  ADD CONSTRAINT `giao_vien_ibfk_2` FOREIGN KEY (`ma_khoa`) REFERENCES `khoa` (`ma_khoa`);

--
-- Constraints for table `lop`
--
ALTER TABLE `lop`
  ADD CONSTRAINT `lop_ibfk_1` FOREIGN KEY (`ma_khoa`) REFERENCES `khoa` (`ma_khoa`);

--
-- Constraints for table `sinh_vien`
--
ALTER TABLE `sinh_vien`
  ADD CONSTRAINT `sinh_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id_tai_khoan`),
  ADD CONSTRAINT `sinh_vien_ibfk_2` FOREIGN KEY (`ma_lop`) REFERENCES `lop` (`ma_lop`);

--
-- Constraints for table `thi`
--
ALTER TABLE `thi`
  ADD CONSTRAINT `thi_ibfk_1` FOREIGN KEY (`id_dang_ky_thi`) REFERENCES `dang_ky_thi` (`id_dang_ky_thi`),
  ADD CONSTRAINT `thi_ibfk_2` FOREIGN KEY (`ma_sv`) REFERENCES `sinh_vien` (`ma_sv`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
