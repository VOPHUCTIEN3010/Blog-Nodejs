function getElapsedTime(createdAt) {
    const currentTime = new Date();
    const elapsedTime = currentTime - new Date(createdAt);
    const elapsedSeconds = Math.floor(elapsedTime / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 0) {
        return `${elapsedDays} ngày trước`;
    } else if (elapsedHours > 0) {
        return `${elapsedHours} giờ trước`;
    } else if (elapsedMinutes > 0) {
        return `${elapsedMinutes} phút trước`;
    } else {
        return `Vừa mới đăng`;
    }
}

