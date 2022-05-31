const auth = "27499358-5a2fddce0b3687817b0f4c648";
const url = new URL(location.href);
const params = new URLSearchParams(url.search);
const currentPage = params.has('page') ? new URL(location.href).searchParams.get('page') : 1;
const currentItemsPerPage = params.has('perPage') ? new URL(location.href).searchParams.get('perPage') : 10;

const getImages = async (pageNumber, perPage) => {
    const url = `https://pixabay.com/api/?key=${auth}&image_type=photo&per_page=${perPage}&q=cute-dog&orientation=vertical&page=${pageNumber}`
    const response = await fetch(
        url,
        {
            method: "GET",
            contentType: "application/json"
        }
    );
    if (!response.ok) {
       return Promise.reject(response);
    }
    const data = await response.json();
    return data;
}

const toggleModel = (id) => {
    const modal = document.getElementById(`modal_${id}`);
    modal.classList.toggle("modal__show");
}

const createModal = (image) => {
    const modal = document.createElement("div");
    modal.id = `modal_${image.id}`
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal__content";
    modal.appendChild(modalContent);

    const closeBtn = document.createElement("span");
    closeBtn.className = "modal__close";
    closeBtn.innerHTML = "&times;";
    closeBtn.id = `close-btn__${image.id}`
    modalContent.appendChild(closeBtn);

    const modalImg = document.createElement("img");
    modalImg.className = "modal__image";
    modalImg.src = image.largeImageURL;
    modalContent.appendChild(modalImg);

    const imageTag = document.createElement("p");
    imageTag.innerHTML = image.tags;
    imageTag.className = "modal__tag"
    modalContent.appendChild(imageTag);

    return modal;
}

const renderPagination = (totalHits) => {
    const pagination = document.getElementById("pagination-container");
    let totalPages = Math.ceil(totalHits / currentItemsPerPage);

    const backToFirstPage = document.createElement("a");
    backToFirstPage.innerHTML = "&laquo;";
    backToFirstPage.href = `/?page=1${`&perPage=${currentItemsPerPage}`}`;

    const backOnePage = document.createElement("a");
    backOnePage.innerHTML = "&lt;";
    const backOnePageValue = parseInt(currentPage) - 1;
    backOnePage.href =`/?page=${currentPage == 1 ? 1 : backOnePageValue}${`&perPage=${currentItemsPerPage}`}`

    const forwardOnePage = document.createElement("a");
    forwardOnePage.innerHTML = "&gt;";
    const forwardOnePageValue = parseInt(currentPage) + 1;
    forwardOnePage.href =`/?page=${currentPage == totalPages ? totalPages : forwardOnePageValue}${`&perPage=${currentItemsPerPage}`}`

    const forwardToLastPage = document.createElement("a");
    forwardToLastPage.innerHTML = "&raquo;";
    forwardToLastPage.href = `/?page=${totalPages}${`&perPage=${currentItemsPerPage}`}`;

    const currentPageNumber = document.createElement("p");
    currentPageNumber.innerText = `${currentPage} of ${totalPages}`;
    
    pagination.appendChild(backToFirstPage);
    pagination.appendChild(backOnePage);
    pagination.appendChild(currentPageNumber);
    pagination.appendChild(forwardOnePage);
    pagination.appendChild(forwardToLastPage);    
}

const lazyLoadImages = () => {
    if ("IntersectionObserver" in window) {
        const lazyImages = document.querySelectorAll(".lazy");
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.classList.remove("lazy");
                        imageObserver.unobserve(image);
                    }, 500)
                   
                }
            });
        });
        lazyImages.forEach((image) => {
            imageObserver.observe(image);
        })
    }
}

const renderImages = (images) => {
    images.forEach(image => {
        const newImage = document.createElement("img");
        newImage.setAttribute('data-src', image.largeImageURL);
        newImage.classList.add("image-gallery__img", "lazy");
        document.getElementById("image-gallery").appendChild(newImage);

        const modal = createModal(image);
        document.getElementById("main").appendChild(modal);

        const modalCloseBtn = document.getElementById(`close-btn__${image.id}`);
        modalCloseBtn.addEventListener("click", () => toggleModel(image.id));
        newImage.addEventListener("click", () => toggleModel(image.id));
    })
    lazyLoadImages();
}

const renderError = () => {
    const container = document.getElementById('main');
    const errorMessage = document.createElement('h1');
    errorMessage.innerText = "Woof Woof! Looks like the page you're looking for isn't here! Woof!";
    errorMessage.className = "error-message";
    container.appendChild(errorMessage);
}

const initializePerPage = (perPage) => {
    const perPageSelect = document.getElementById("per-page__select");
    perPageSelect.value = perPage;
    perPageSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        url.searchParams.set("perPage", value)
        window.location = url.href;
    })
}

getImages(currentPage, currentItemsPerPage).then((images) =>{
    renderImages(images.hits);
    renderPagination(images.totalHits);
    initializePerPage(currentItemsPerPage);
}).catch(error => {
    renderError();
})

const headerLogo = document.getElementById("logo");
headerLogo.addEventListener('click', () => {
    alert("Thank you! Doggo Loves Head Scrutches!! Woof!");
})