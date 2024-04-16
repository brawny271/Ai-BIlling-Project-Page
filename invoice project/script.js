fetch("sample_json.json")
  .then((response) => response.json())
  .then((data) => {
    const imageDetails = data.data[0].image_details;
    console.log(imageDetails, "matchingDetailmatchingDetail");

    const coOrdinatesForImage = {};

    const inputs = document.querySelectorAll("input[id]");
    inputs.forEach((input) => {
      const key = input.id;
      const matchingDetail = imageDetails.find((detail) =>
        detail.hasOwnProperty(key)
      );
      if (matchingDetail) {
        input.value = matchingDetail[key][0];
      }
    });

    inputs.forEach((input) => {
      input.addEventListener("click", highlightImageArea);
    });

    function highlightImageArea(event) {
      const inputId = event.target.id;
  
      const imageView = document.getElementById("imageView");
      const imageContainer = document.querySelector(".image-container");
      const coordinates = getCoordinatesForInputId(inputId, imageDetails);
  
      if (coordinates) {
        const scaleX = imageView.naturalWidth / imageView.offsetWidth;
        const scaleY = imageView.naturalHeight / imageView.offsetHeight;
  
        const relativeX = coordinates.x * scaleX;
        const relativeY = coordinates.y * scaleY;
        const relativeWidth = Math.min(
          coordinates.width * scaleX,
          imageView.naturalWidth - relativeX
        );
        const relativeHeight = Math.min(
          coordinates.height * scaleY,
          imageView.naturalHeight - relativeY
        );
  
        const existingCanvas = document.querySelector(".highlight-canvas");
        if (existingCanvas) {
          existingCanvas.parentNode.removeChild(existingCanvas);
        }
  
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = imageView.naturalWidth; // Set canvas width to match image natural width
        canvas.height = imageView.naturalHeight; // Set canvas height to match image natural height
        canvas.classList.add("highlight-canvas");
  
        ctx.fillStyle = "rgba(4, 132, 9, 0.1)"; // Light sky blue fill color with opacity
        ctx.strokeStyle = "rgba(4, 132, 9, 0.8)" // Light blue border color
        ctx.strokeRect(relativeX, relativeY, relativeWidth, relativeHeight);
        ctx.fillRect(relativeX, relativeY, relativeWidth, relativeHeight); 
  
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "2";
        imageContainer.appendChild(canvas);
  
        // Remove the canvas after 2 seconds
        setTimeout(() => {
          canvas.classList.add("show"); // Add 'show' class to trigger transition
          setTimeout(() => {
            if (canvas.parentNode === imageContainer) {
              imageContainer.removeChild(canvas);
            }
          }, 500); // Wait for transition to finish before removing the canvas
        }, 1500);
      }
    }

    document.getElementById("imageView").addEventListener("click", highlightImageArea);
  

    function getCoordinatesForInputId(inputId, imageDetails) {
      console.log(inputId, "matchingDetailmatchingDetail");
      const imageDetail = imageDetails.find((detail) => detail.id === inputId);
      return imageDetail ? imageDetail.value : null;
    }
  })
  .catch((error) => console.error("Error fetching data:", error));

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

// document.addEventListener('DOMContentLoaded', function() {
//     const imageContainer = document.getElementById('imageContainer');
//     const imageView = document.getElementById('imageView');
//     const zoomInButton = document.getElementById('zoomIn');
//     const zoomOutButton = document.getElementById('zoomOut');

//     let scaleFactor = 1;

//     // Zoom in functionality
//     zoomInButton.addEventListener('click', function() {
//         scaleFactor += 0.1;
//         updateImageSize();
//     });

//     // Zoom out functionality
//     zoomOutButton.addEventListener('click', function() {
//         scaleFactor -= 0.1;
//         updateImageSize();
//     });

//     // Function to update image size based on scale factor
//     function updateImageSize() {
//         imageView.style.transform = `scale(${scaleFactor})`;
//     }
// });

// Get all input fields in the form

// const inputFields = document.querySelectorAll(".form input");

// inputFields.forEach((input) => {
//   input.addEventListener("click", highlightImageArea);
// });

// function highlightImageArea(event) {
//   const inputId = event.target.id;

//   const imageView = document.getElementById("imageView");
//   const imageContainer = document.querySelector(".image-container");
//   const rect = imageView.getBoundingClientRect();
//   const coordinates = getCoordinatesForInputId(inputId);

//   const scaleX = imageView.naturalWidth / imageView.offsetWidth;
//   const scaleY = imageView.naturalHeight / imageView.offsetHeight;

//   const relativeX = coordinates.x * scaleX;
//   const relativeY = coordinates.y * scaleY;
//   const relativeWidth = coordinates.width * scaleX;
//   const relativeHeight = coordinates.height * scaleY;

//   const existingCanvas = document.querySelector(".highlight-canvas");
//   if (existingCanvas) {
//     existingCanvas.parentNode.removeChild(existingCanvas);
//   }

//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   canvas.width = imageContainer.offsetWidth;
//   canvas.height = imageContainer.offsetHeight;
//   canvas.classList.add("highlight-canvas");
//   canvas.style.backgroundColor =
//     getComputedStyle(imageContainer).backgroundColor;

//   ctx.strokeStyle = "red";

//   ctx.strokeRect(relativeX, relativeY, relativeWidth, relativeHeight);

//   canvas.style.position = "absolute";
//   canvas.style.top = "0";
//   canvas.style.left = "0";
//   canvas.style.zIndex = "100";

//   imageContainer.appendChild(canvas);
//   setTimeout(() => {
//     if (canvas.parentNode === imageContainer) {
//       imageContainer.removeChild(canvas);
//     }
//   }, 2000);
// }

// function getCoordinatesForInputId(inputId) {

//   return {
//     x: 110,
//     y: 350,
//     width: 140,
//     height: 50,
//   };
// }
