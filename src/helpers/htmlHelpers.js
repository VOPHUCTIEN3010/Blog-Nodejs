function generatePagination(currentPage, totalPages, postsPerPage, totalPosts, isSearch, keyword) {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    const displayText = isSearch ? 'entries search results' : 'entries';

    const kwQuery = keyword ? `&kw=${encodeURIComponent(keyword)}` : '';

    let paginationHtml = `
        <nav aria-label="Page navigation example">
            Showing ${(currentPage - 1) * postsPerPage + 1} to ${Math.min(currentPage * postsPerPage, totalPosts)} of ${totalPosts} ${displayText}
            <ul class="pagination float-end">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="?page=1${kwQuery}">First</a>
                </li>
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="?page=${currentPage - 1}${kwQuery}">Previous</a>
                </li>
    `;

    if (startPage > 1) {
        paginationHtml += `<li class="page-item"><span class="page-link">...</span></li>`;
    }

    paginationHtml += Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => `
        <li class="page-item ${currentPage === page ? 'active' : ''}">
            <a class="page-link" href="?page=${page}${kwQuery}">${page}</a>
        </li>
    `).join('');

    if (endPage < totalPages) {
        paginationHtml += `<li class="page-item"><span class="page-link">...</span></li>`;
    }

    paginationHtml += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="?page=${currentPage + 1}${kwQuery}">Next</a>
                </li>
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="?page=${totalPages}${kwQuery}">End</a>
                </li>
            </ul>
        </nav>
    `;

    return paginationHtml;
}

export default generatePagination