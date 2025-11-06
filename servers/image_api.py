from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
port = 5000

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('CLOUD_API_KEY'),
    api_secret=os.getenv('CLOUD_API_SECRET')
)

@app.route('/api/image', methods=['POST'])

def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "Không tìm thấy file ảnh"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Tên file không hợp lệ"}), 400

    try:
        filename = secure_filename(file.filename)
        name_only, ext = os.path.splitext(filename)  # ronaldo.jpg → ('ronaldo', '.jpg')

        # ⚡ Thêm timestamp vào tên file
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_name = f"{timestamp}_{name_only}"

        # Upload trực tiếp từ bộ nhớ (file stream)
        result = cloudinary.uploader.upload(
            file,                    # Không cần lưu tạm
            public_id=unique_name,    # tên file có timestamp
            folder="uploads"          # tùy chọn: thư mục trên Cloudinary
        )

        return jsonify({
            "imageUrl": result.get('secure_url'),
            "publicId": result.get('public_id'),
        })
    except Exception as e:
        print(e)
        return jsonify({"error": "Upload thất bại"}), 500


@app.route('/api/image/<public_id>', methods=['GET'])
def get_image_url(public_id):
    try:
        url = cloudinary.CloudinaryImage(public_id).build_url()
        return jsonify({"imageUrl": url})
    except Exception as e:
        print(e)
        return jsonify({"error": "Không có ảnh trên Cloudinary"}), 500


@app.route('/api/image/<public_id>', methods=['DELETE'])
def delete_image(public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") == "ok":
            return jsonify({"message": f"Đã xóa ảnh {public_id} thành công"})
        else:
            return jsonify({"error": f"Không thể xóa ảnh: {result.get('result')}"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Lỗi khi xóa ảnh trên Cloudinary"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
