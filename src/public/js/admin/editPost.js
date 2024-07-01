$(document).ready(function () {
    $('#image').on('change', function () {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#image-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#form-adduser').on('submit', function (e) {
        var slug = $('#slug').val().trim();
        if (slug === '') {
            e.preventDefault(); 
            $('#slug-error').show(); 
        } else {
            $('#slug-error').hide(); 
        }
    });
});