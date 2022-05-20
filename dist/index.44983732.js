const auth = "27499358-5a2fddce0b3687817b0f4c648";
const url = new URL(location.href);
const params = new URLSearchParams(url.search);
const currentPage = params.has('page') ? new URL(location.href).searchParams.get('page') : 1;
const getImages = async (pageNumber)=>{
    const url1 = `https://pixabay.com/api/?key=${auth}&image_type=photo&per_page=10&q=cute-dog&orientation=vertical&page=${pageNumber}`;
    const response = await fetch(url1, {
        method: "GET",
        contentType: "application/json"
    });
    if (!response.ok) return Promise.reject(response);
    const data = await response.json();
    return data;
};
const toggleModel = (id)=>{
    const modal = document.getElementById(`modal_${id}`);
    modal.classList.toggle("show-modal");
};
const createModal = (image)=>{
    const modal = document.createElement("div");
    modal.id = `modal_${image.id}`;
    modal.className = "modal";
    const modalContent = document.createElement("div");
    modalContent.className = "modal_content";
    modal.appendChild(modalContent);
    const closeBtn = document.createElement("span");
    closeBtn.className = "modal_close";
    closeBtn.innerHTML = "&times;";
    closeBtn.id = `close_btn_${image.id}`;
    modalContent.appendChild(closeBtn);
    const modalImg = document.createElement("img");
    modalImg.className = "modal_image";
    modalImg.src = image.largeImageURL;
    modalContent.appendChild(modalImg);
    const imageTag = document.createElement("p");
    imageTag.innerHTML = image.tags;
    imageTag.className = "modal_tag";
    modalContent.appendChild(imageTag);
    return modal;
};
const renderPagination = (totalHits)=>{
    const pagination = document.getElementById("pagination_container");
    let totalPages = Math.ceil(totalHits / 10);
    const backToFirstPage = document.createElement("a");
    backToFirstPage.innerHTML = "&laquo;";
    backToFirstPage.href = "/?page=1";
    const backOnePage = document.createElement("a");
    backOnePage.innerHTML = "&lt;";
    const backOnePageValue = parseInt(currentPage) - 1;
    backOnePage.href = `/?page=${currentPage == 1 ? 1 : backOnePageValue}`;
    const forwardOnePage = document.createElement("a");
    forwardOnePage.innerHTML = "&gt;";
    const forwardOnePageValue = parseInt(currentPage) + 1;
    forwardOnePage.href = `/?page=${currentPage == totalPages ? totalPages : forwardOnePageValue}`;
    const forwardToLastPage = document.createElement("a");
    forwardToLastPage.innerHTML = "&raquo;";
    forwardToLastPage.href = `/?page=${totalPages}`;
    const currentPageNumber = document.createElement("p");
    currentPageNumber.innerText = `${currentPage} of ${totalPages}`;
    pagination.appendChild(backToFirstPage);
    pagination.appendChild(backOnePage);
    pagination.appendChild(currentPageNumber);
    pagination.appendChild(forwardOnePage);
    pagination.appendChild(forwardToLastPage);
};
const resetHTML = ()=>{
    document.getElementById("image_container").innerHTML = "";
};
const renderImages = (images)=>{
    // Remove previous content
    resetHTML();
    images.forEach((image)=>{
        const newImage = document.createElement("img");
        newImage.src = image.largeImageURL;
        newImage.className = "image";
        // Add mango as alt image
        newImage.setAttribute("alt", image.tags);
        document.getElementById("image_container").appendChild(newImage);
        const modal = createModal(image);
        document.getElementById("main").appendChild(modal);
        const modalCloseBtn = document.getElementById(`close_btn_${image.id}`);
        modalCloseBtn.addEventListener("click", ()=>toggleModel(image.id)
        );
        newImage.addEventListener("click", ()=>toggleModel(image.id)
        );
    });
};
const renderError = ()=>{
    const container = document.getElementById('main');
    const errorMessage = document.createElement('h1');
    errorMessage.innerText = "Woof Woof! Looks like the page you're looking for isn't here! Woof!";
    errorMessage.className = "error-message";
    container.appendChild(errorMessage);
};
getImages(currentPage).then((images)=>{
    renderImages(images.hits);
    renderPagination(images.totalHits);
}).catch((error)=>{
    renderError();
});

//# sourceMappingURL=index.44983732.js.map
