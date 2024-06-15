function getElapsedTime(date) {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.abs(now - postDate) / 1000; 
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;

    const hours = Math.floor(diff / 3600) % 24;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

    const minutes = Math.floor(diff / 60) % 60;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

    const seconds = Math.floor(diff % 60);
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
}

$(document).ready(function() {
    $('.media-block.content-comment').each(function() {
        var path = String($(this).data('path'));
        if (path) {
            var dotCount = (path.match(/\./g) || []).length;
            if (dotCount === 1) {
                $(this).addClass('margin-4');
            } else if (dotCount > 1) {
                $(this).addClass('margin-8');
            }
        }
    });

    $('#comment-lists').on('click', '.reply-btn', function(event) {
        event.preventDefault();
        $(this).closest('.media-body').find('.reply-comment-form').toggleClass('hidden');
    });

    $('.post-time, .comment-time').each(function() {
        const time = $(this).attr('data-time');
        $(this).text(getElapsedTime(time));
    });
    function renderComment(response, username, userImage, content) {
        // Set default image if userImage is not provided
        const imageSrc = userImage ? `/upload/${userImage}` : 'http://bootdey.com/img/Content/avatar/avatar1.png';
        
        return `
            <div class="media-block content-comment" data-path="${response.response.path}">
                <a class="media-left" href="#">
                    <img class="img-circle img-sm" alt="Profile Picture" src="${imageSrc}" />
                </a>
                <div class="media-body mar-btm">
                    <a href="#" class="btn-link text-semibold media-heading box-inline">
                        ${username}
                    </a>
                    <p class="text-muted text-sm">
                        <i class="fa fa-mobile fa-lg"></i>
                        <span class="comment-time" data-time="${moment().format('YYYY-MM-DD HH:mm:ss')}"></span>
                    </p>
                    <span>${content}</span>
                    <div class="pad-ver">
                        <div class="btn-group">
                            <a class="btn btn-sm btn-default btn-hover-success" href="#">
                                <i class="fa fa-thumbs-up"></i> Like
                            </a>
                            <a class="btn btn-sm btn-default btn-hover-primary reply-btn" href="#">
                                <i class="fa fa-comment"></i> Reply
                            </a>
                            <a class="btn btn-sm btn-default btn-edit" href="#" data-comment-id="<%= comment.id %>">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </a>
                            <a class="btn btn-sm btn-default btn-delete" href="#" data-comment-id="<%= comment.id %>">
                                <i class="fa-solid fa-trash-can"></i> Del
                            </a>
                        </div>
                    </div>
                    <form class="form-text-comment hidden reply-comment-form" method="POST">
                        <textarea class="form-control comment-post" name="comment" placeholder="Comment...." rows="2"></textarea>
                        <input type="hidden" name="path" value="${response.response.path}">
                        <div class="mar-top clearfix">
                            <button type="submit" class="btn btn-sm btn-primary pull-right float-end">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
    
    $('#commentForm').submit(function(event) {
        event.preventDefault();
    
        const post_id = $('#post_id').val();
        const content = $('#inputComment').val();
        const username = $('#fullname').val();
        const userImage = $('#image').val();
    
        const data = {
            content: content,
            post_id: post_id
        };
    
        $.ajax({
            type: 'POST',
            url: '/comment_post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
        .done(function(response) {
            $('#comment-lists').append(renderComment(response, username, userImage, content));
            $('#inputComment').val('');
            updateCommentCount(true);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('Lỗi yêu cầu AJAX:', textStatus, errorThrown);
                alert('Yêu cầu AJAX không thành công');
            }
        });
    });
    
    $('#comment-lists').on('submit', '.reply-comment-form', function(event) {
        event.preventDefault();
        const form = $(this);
        const post_id = $('#post_id').val();
        const content = form.find('textarea[name="comment"]').val();
        const path = form.find('input[name="path"]').val();
        const username = $('#fullname').val();
        const userImage = $('#image').val();
        console.log(path);
        const data = {
            content: content,
            post_id: post_id,
            path: path
        };
    
        $.ajax({
            type: 'POST',
            url: '/comment_post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
        .done(function(response) {       
            form.before(renderComment(response, username, userImage, content));
            form.find('textarea[name="comment"]').val('');
            form.toggleClass('hidden');
            updateCommentCount(true);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('Lỗi yêu cầu AJAX:', textStatus, errorThrown);
                alert('Yêu cầu AJAX không thành công');
            }
        });
    });        
    
    const updateCommentCount = (increment = true) => {
        let currentCmtCount = parseInt($("#comment-count").text());
        let change = increment ? 1 : -1;
        let newCmtcount = currentCmtCount + change;
        $("#comment-count").text(newCmtcount);
    }
    
    $('.like-form').submit(function(event) {
        event.preventDefault();
        const user_id = $('#user_id').val();
        const $form = $(this);
        const post_id = $form.find('input[name="post_id"]').val();
        const data = {
            post_id: post_id,
            user_id: user_id
        };
        $.ajax({
            type: 'POST',
            url: '/like_post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
        .done(function(response) {
            const $likeIcon = $form.find('button>i');
            const $numberLikeSpan = $form.prev().find('.number-like');
            let numberLike = parseInt($numberLikeSpan.text());
    
            if (response.data === 1) {
                $likeIcon.removeClass('active');
                $numberLikeSpan.text(numberLike - 1);
                $form.data('liked', 'false');
                console.log('Post unliked');
            } else {
                $likeIcon.addClass('active');
                $numberLikeSpan.text(numberLike + 1);
                $form.data('liked', 'true');
                console.log('Post liked');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('AJAX request error:', textStatus, errorThrown);
                alert('AJAX request failed');
            }
        });
    });

    $('.comment-like-btn').click(function(event) {
        event.preventDefault();
        const $btn = $(this);
        const postId = $btn.data('post-id');
        const commentId = $btn.data('comment-id');
        const userId = $('#user_id').val();

        const data = {
            user_id: userId,
            comment_id: commentId,
            post_id: postId,
        };

        $.ajax({
            type: 'POST',
            url: '/like_comment',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
        .done(function(response) {
            const $likeIcon = $btn.find('.like-comment');
            const $numberLikeSpan = $btn.prev('.comment-number-like');
            let numberLike = parseInt($numberLikeSpan.text());
            console.log('response:', response);

            if (response.data === 1) {
                $likeIcon.removeClass('active');
                $numberLikeSpan.text(numberLike - 1);
                console.log('Comment unliked');
            } else {
                $likeIcon.addClass('active');
                $numberLikeSpan.text(numberLike + 1);
                console.log('Comment liked');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('Lỗi yêu cầu AJAX:', textStatus, errorThrown);
                alert('Yêu cầu AJAX thất bại');
            }
        });
    });

    $('.btn-edit').click(function(event) {
        event.preventDefault();
        const commentId = $(this).data('comment-id');
        $(`#comment-content-${commentId}`).hide();
        $(`#edit-form-${commentId}`).removeClass('hidden');
    });

    $('.cancel-edit').click(function() {
        const commentId = $(this).data('id');
        $(`#comment-content-${commentId}`).show();
        $(`#edit-form-${commentId}`).addClass('hidden');
    });

    $('.submit-edit').click(function() {
        const commentId = $(this).data('id');
        const newContent = $(`#edit-form-${commentId} .edit-comment`).val();

        $.ajax({
            url: `/edit_comment/${commentId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ content: newContent })
        })
        .done(function(data) {
            if (data.success) {
                $(`#comment-content-${commentId}`).text(newContent).show();
                $(`#edit-form-${commentId}`).addClass('hidden');
            } else {
                alert('Failed to update comment.');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('AJAX request error:', textStatus, errorThrown);
                alert('AJAX request failed');
            }
        });
    });

    $('.btn-delete').click(function(event) {
        event.preventDefault();
        const commentId = $(this).data('comment-id');
        const userConfirmed = confirm('Bạn có chắc chắn muốn xóa comment này không?');
    
        if (userConfirmed) {
            $.ajax({
                url: `/delete_comment/${commentId}`,
                type: 'DELETE'
            })
            .done(function(data) {
                if (data.success) {
                    $(`#comment-${commentId}`).remove();
                    updateCommentCount(false);
                } else {
                    alert('Failed to delete comment.');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401 || jqXHR.status === 403) {
                    window.location.href = "/login";
                } else {
                    console.error('AJAX request error:', textStatus, errorThrown);
                    alert('AJAX request failed');
                }
            });
        }
    });

    
    });
    
    
    
    
    
