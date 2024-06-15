$(document).ready(function() {
    $('#title').on('input', function() {
        const title = $(this).val();
        const slug = slugify(title);
        $('#slug').val(slug);
    });
});

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); 
    str = str.toLowerCase(); 
    str = str.replace(/[^a-z0-9 -]/g, '') 
            .replace(/\s+/g, '-') 
    
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
                        (now.getMonth() + 1).toString().padStart(2, '0') + 
                        now.getDate().toString().padStart(2, '0') + 
                        now.getHours().toString().padStart(2, '0') + 
                        now.getMinutes().toString().padStart(2, '0') + 
                        now.getSeconds().toString().padStart(2, '0');
    
    return str + '-' + timestamp;
}
    function previewImage(input) {
        const preview = document.getElementById('preview');
        const currentImage = document.getElementById('current-image');
        const noImage = document.getElementById('no-image');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Thay đổi src của thẻ img với id là 'preview' bằng dữ liệu hình ảnh mới
                preview.src = e.target.result;
                preview.style.display = 'block';

                // Ẩn hình ảnh hiện tại hoặc thông báo "No image"
                if (currentImage) {
                    currentImage.style.display = 'none';
                }
                if (noImage) {
                    noImage.style.display = 'none';
                }
            }
            reader.readAsDataURL(input.files[0]);
        } else {
            // Nếu không có hình ảnh mới, hiển thị lại hình ảnh hiện tại hoặc thông báo "No image"
            if (currentImage) {
                currentImage.style.display = 'block';
            }
            if (noImage) {
                noImage.style.display = 'block';
            }
            preview.style.display = 'none';
        }
    }
    
