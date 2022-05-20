const auth = "27499358-5a2fddce0b3687817b0f4c648";
const getImages = async (pageNumber)=>{
    const url = `https://pixabay.com/api/?key=${auth}&image_type=photo&per_page=10&q=dogs&orientation=vertical&page=${pageNumber}`;
    const response = await fetch(url, {
        method: "GET",
        contentType: "application/json"
    });
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
const renderImages = async (pageNumber)=>{
    const data = await getImages(pageNumber);
    // Remove previous content
    document.getElementById("image_container").innerHTML = "";
    renderPagination(data.totalHits);
    data.hits.forEach((image)=>{
        const newImage = document.createElement("img");
        newImage.src = image.largeImageURL;
        newImage.className = "image";
        newImage.setAttribute("alt", image.largeImageURL);
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
appendImages(1);

//# sourceMappingURL=index.44983732.js.map
