$(document).ready(function() {
    $('.postStatusCheckbox').change(function() {
        var status = this.checked ? 1 : 0;
        var postId = $(this).data('post-id');
        console.log(123);
        $.ajax({
            url: '/updatePostStatus', // Endpoint để xử lý yêu cầu Ajax
            type: 'POST',
            data: { postId: postId, status: status }
        })
        .done(function(response) {
            console.log('Cập nhật trạng thái thành công.');
        })
        .fail(function(xhr, status, error) {
            // Xảy ra lỗi
            console.error('Lỗi khi cập nhật trạng thái:', error);
        });
    });

    $(document).ready(function() {
        $('.del-record').on('click', function(event) {
            event.preventDefault();
            var postId = $(this).attr('alt');
            var row = $(this).closest('tr'); 
    
            if (confirm('Are you sure you want to delete this post?')) {
                $.ajax({
                    url: '/delete_post/' + postId,  
                    type: 'POST', 
                    data: { _method: 'DELETE' },  
                    dataType: 'json'  
                })
                .done(function(response) {
                    if (response.success) {
                        alert(response.message); 
                        row.remove();  
                    } else {
                        alert('Error: ' + response.message);
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    alert('Error deleting post: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.message : textStatus));
                });
            }
        });
    });
    
});       
