    $(document).ready(function() {
        $('#loginForm').submit(function(e) {
            e.preventDefault(); // Ngăn chặn việc gửi form mặc định

            // Lấy dữ liệu từ form
            var formData = {
                email: $('#form2Example1').val(),
                password: $('#form2Example2').val()
            };

            // Gửi request AJAX
            $.ajax({
                type: 'POST',
                url: '/login',
                data: formData,
                success: function(response){
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                if(response.role == 0){
                    window.location.href="/admin"
                } else 
                    window.location.href="/";
                },
                error: function(err) {
                    console.error(err);
                }
            });
        })
    })
