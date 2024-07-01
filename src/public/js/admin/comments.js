$(document).ready(function() {
    $('.del-record').on('click', function() {
        var commentId = $(this).attr('alt');        
        var confirmation = confirm('Bạn có chắc chắn muốn xóa bình luận này không?');
        if (confirmation) {
            $.ajax({
                url: '/admin/delete_comment/' + commentId, 
                type: 'POST', 
                data: {
                    _method: 'DELETE'
                },
                success: function(response) {
                    if (response.success) {
                        $('#action' + commentId).closest('tr').remove();
                        alert('Bình luận đã được xóa thành công!');
                    } else {
                        alert('Có lỗi xảy ra khi xóa bình luận: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Có lỗi xảy ra khi gửi yêu cầu xóa: ' + error);
                }
            });
        }
    });    

    $('.commentStatusCheckbox').change(function() {
        var status = this.checked ? 1 : 0;
        var commentId = $(this).data('comment-id');
        if (confirm('Are you sure you want to change ')) {
            $.ajax({
                url: '/updateCommentStatus', 
                type: 'POST',
                data: { commentId: commentId, status: status }
            })
            .done(function(response) {
                if (response.success) {
                    alert(response.message); 
                } else {
                    alert('Error: ' + response.message);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert('Error deleting comment: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.message : textStatus));
            });
        }
    });

    var urlParams = new URLSearchParams(window.location.search);
    var keyword = urlParams.get('kw');
    
    if (keyword) {
        $('#searchInput').val(keyword);
        searchPosts(keyword); 
    }
    
    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val().trim(); 
        searchPosts(searchTerm);
    });
    
});