document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

let currentPage = 1;
let totalPages = 0;

function fetchData(page) {
  fetch(
    `http://172.16.12.21:8000/test/invoice_data?invoice_file_id=1&page=${
      page || 1
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const pageData = data?.ocr_result;
      const imageDimensions = pageData?.image_dimensions;
      const content = pageData?.content;
      totalPages = data.invoice_file_path.length;
      const imageWidth = imageDimensions ? imageDimensions[0] : 0;
      const imageHeight = imageDimensions ? imageDimensions[1] : 0;
      const items = data?.ocr_result?.content?.items;

      const inputs = document.querySelectorAll("input[id]");
      inputs.forEach((input) => {
        const key = input.id;
        const field = content[key];
        if (field) {
          input.value = field.value;
          input.dataset.bbox = JSON.stringify(field.bbox);
          input.addEventListener("click", highlightImageAreaWithTimeout);
        }
      });

      if (items && items.length > 0) {
        items.forEach((item, index) => {
          const itemIdPrefix = `item_${index + 1}_`;
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              const inputId = `${itemIdPrefix}${key}`;
              const inputElement = document.getElementById(inputId);
              if (inputElement) {
                inputElement.value = item[key].value;
              }
            }
          }
        });
      }

      let boundingBoxesVisible = false;

      const highlightAllBoundingBoxes = () => {
        if (boundingBoxesVisible) {
          removeBoundingBoxes();
          boundingBoxesVisible = false;
        } else {
          inputs.forEach((input) => {
            const bbox = input.dataset.bbox;
            if (bbox) {
              highlightImageArea({ target: input }, false);
            }
          });
          boundingBoxesVisible = true;
        }
      };

      function highlightImageAreaWithTimeout(event) {
        highlightImageArea(event, true);
      }

      function highlightImageArea(event, applyTimeout) {
        const input = event.target;
        const bbox = input.dataset.bbox;

        const imageView = document.getElementById("imageView");
        const imageContainer = document.querySelector(".image-container");

        const bboxObj = JSON.parse(bbox);

        const x = bboxObj.x;
        const y = bboxObj.y;
        const w = bboxObj.w;
        const h = bboxObj.h;

        const existingCanvas = document.querySelector(
          `.highlight-canvas-${input.id}`
        );
        if (existingCanvas) {
          existingCanvas.parentNode.removeChild(existingCanvas);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = imageWidth;
        canvas.height = imageHeight;
        canvas.classList.add(`highlight-canvas-${input.id}`);

        ctx.fillStyle = "rgba(4, 132, 9, 0.1)";
        ctx.strokeStyle = "rgba(4, 132, 9, 0.8)";
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);

        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "2";

        imageContainer.appendChild(canvas);

        canvas.addEventListener("click", () => {
          const targetInput = document.getElementById(input.id);
          targetInput.focus();
        });

        if (applyTimeout) {
          setTimeout(() => {
            canvas.classList.add("show");
            setTimeout(() => {
              if (canvas.parentNode === imageContainer) {
                imageContainer.removeChild(canvas);
              }
            }, 500);
          }, 1500);
        }
      }
      function removeBoundingBoxes() {
        const highlightCanvases = document.querySelectorAll(
          "[class^='highlight-canvas-']"
        );
        highlightCanvases.forEach((canvas) => {
          canvas.parentNode.removeChild(canvas);
        });
      }
      const button = document.querySelector(".side-buttons");
      button.addEventListener("click", highlightAllBoundingBoxes);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage);
  }
});

// Function to handle click on the previous button
document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
});

// ***** submit Form Functionality ******
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".form-submit");
  button.addEventListener("click", () => {
    const changedData = {};

    const inputFields = document.querySelectorAll("input[id]");
    inputFields.forEach((input) => {
      const id = input.id;
      const value = input.value.trim();

      if (value !== "") {
        changedData[id] = value;
      }
    });

    if (Object.keys(changedData).length === 0) {
      console.log("No input value has been changed.");
      return;
    }
    const invoiceFileId = 1;

    fetch("http://172.16.12.21:8000/test/invoice_data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page : currentPage,
        invoice_model_id: invoiceFileId,
        corrected_results: changedData,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data submitted successfully");
        } else {
          console.error("Failed to submit data");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  });
});

//***** Image render functionality *****

const images = ["page-0001.jpg"];

let currentIndex = 0;

function changeImage(index) {
  const imageView = document.getElementById("imageView");
  imageView.src = images[index];
}

document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.querySelector(".image-container");

  changeImage(currentIndex);
});

let isDragging = false;
let startX;
let startScrollLeft;

function startDragging(event) {
  isDragging = true;
  startX = event.clientX;
  startScrollLeft = event.target.scrollLeft;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDragging);
}

function drag(event) {
  if (!isDragging) return;

  const delta = startX - event.clientX;
  const newScrollLeft = startScrollLeft + delta;

  requestAnimationFrame(() => {
    event.target.scrollLeft = newScrollLeft;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const imageView = document.getElementById("imageView");
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  const imageContainer = document.querySelector(".image-container");

  let scaleFactor = 1;
  let isScrolling = false;
  let startX, startScrollLeft;

  zoomInButton.addEventListener("click", function () {
    scaleFactor += 0.1;
    updateImageSize();
  });

  zoomOutButton.addEventListener("click", function () {
    if (scaleFactor > 1) {
      scaleFactor -= 0.1;
      updateImageSize();
    }
  });

  function updateImageSize() {
    scaleFactor = Math.max(1, scaleFactor);

    imageView.style.transform = `scale(${scaleFactor})`;

    if (scaleFactor > 1) {
      imageContainer.classList.add("zoomed-in");
      imageContainer.addEventListener("mousedown", startScrolling);
    } else {
      imageContainer.classList.remove("zoomed-in");
      imageContainer.removeEventListener("mousedown", startScrolling);
    }
  }

  function startScrolling(e) {
    isScrolling = true;
    startX = e.clientX;
    startScrollLeft = imageContainer.scrollLeft;
    e.preventDefault();
    document.addEventListener("mousemove", handleScrolling);
    document.addEventListener("mouseup", stopScrolling);
  }

  function handleScrolling(e) {
    if (isScrolling) {
      let deltaX = e.clientX - startX;
      imageContainer.scrollLeft = startScrollLeft - deltaX;
    }
  }

  function stopScrolling() {
    isScrolling = false;
    document.removeEventListener("mousemove", handleScrolling);
    document.removeEventListener("mouseup", stopScrolling);
  }
});
