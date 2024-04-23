document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

function fetchData() {
  fetch(`http://172.16.12.21:8000/test/invoice_data?invoice_file_id=1&page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const pageData = data?.ocr_result;
      const imageDimensions = pageData?.image_dimensions;
      const content = pageData?.content;

      const imageWidth = imageDimensions ? imageDimensions[0] : 0;
      const imageHeight = imageDimensions ? imageDimensions[1] : 0;

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

// ***** submit Form Functionality ******

document.addEventListener("DOMContentLoaded", function () {
  fetchData();

  const submitButton = document.querySelector(".submitform-btn");
  console.log(submitButton);
  if (submitButton) {
    submitButton.addEventListener("click", submitForm);
  }
});

function submitForm() {
  console.log("Submit button clicked");
  const inputs = document.querySelectorAll("input[id]");
  const updatedData = {};

  inputs.forEach((input) => {
    const key = input.id;
    const value = input.value;
    updatedData[key] = value;
  });

  console.log("Updated data:", updatedData);

  sendData(updatedData);
}

function sendData(data) {
  console.log("Sending data:", data);
  fetch(`http://172.16.12.21:8000/test/submit_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Data submitted successfully:", responseData);
    })
    .catch((error) => {
      console.error("Error submitting data:", error);
    });
}

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
