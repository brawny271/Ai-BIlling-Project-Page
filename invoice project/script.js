fetch("sample_json.json")
.then((response) => response.json())
.then((data) => {
  const imageDetails = data.data[0].image_details;

  // Match HTML input fields with JSON data using keys and populate input values
  const inputs = document.querySelectorAll("input[id]");
  inputs.forEach((input) => {
    const key = input.id;
    const matchingDetail = imageDetails.find((detail) => detail.hasOwnProperty(key));
    if (matchingDetail) {
      input.value = matchingDetail[key][0];
    }
  });

  // Add click event listener to each input field to highlight image areas
  inputs.forEach((input) => {
    input.addEventListener("click", highlightImageArea);
  });

  // Function to highlight the corresponding area on the image
  function highlightImageArea(event) {
    const inputId = event.target.id; // Get the ID of the clicked input field

    const imageView = document.getElementById("imageView");
    const imageContainer = document.querySelector(".image-container");
    const rect = imageView.getBoundingClientRect(); // Get the position of the image relative to the viewport

    // Retrieve coordinates for the clicked input ID
    const coordinates = getCoordinatesForInputId(inputId, imageDetails);

    if (coordinates) {
      // Calculate the scaling factor between the actual image size and the displayed size
      const scaleX = imageView.naturalWidth / imageView.offsetWidth;
      const scaleY = imageView.naturalHeight / imageView.offsetHeight;

      // Calculate the position and size of the highlighted area relative to the actual image size
      const relativeX = coordinates.x * scaleX;
      const relativeY = coordinates.y * scaleY;
      const relativeWidth = coordinates.width * scaleX;
      const relativeHeight = coordinates.height * scaleY;

      // Remove any existing canvas elements
      const existingCanvas = document.querySelector(".highlight-canvas");
      if (existingCanvas) {
        existingCanvas.parentNode.removeChild(existingCanvas);
      }

      // Create a canvas element with the same dimensions as the image container
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageContainer.offsetWidth; // Set canvas width
      canvas.height = imageContainer.offsetHeight; // Set canvas height
      canvas.classList.add("highlight-canvas"); // Add class for identification
      canvas.style.backgroundColor =
        getComputedStyle(imageContainer).backgroundColor;

      ctx.strokeStyle = "red"; // Set color for highlighting

      // Draw a rectangle on the canvas based on the coordinates
      ctx.strokeRect(relativeX, relativeY, relativeWidth, relativeHeight);

      // Position the canvas directly over the image
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.zIndex = "100"; // Ensure canvas is above the image

      // Append the canvas to the image container
      imageContainer.appendChild(canvas);

      // Remove the canvas after 2 seconds (adjust the duration as needed)
      setTimeout(() => {
        if (canvas.parentNode === imageContainer) {
          imageContainer.removeChild(canvas);
        }
      }, 2000); // Adjust the duration in milliseconds (e.g., 2000 for 2 seconds)
    }
  }

  function getCoordinatesForInputId(inputId, imageDetails) {
    // Find the image detail object with the same ID as the input ID
    const imageDetail = imageDetails.find((detail) => detail.id === inputId);
    // If the image detail object exists, return its coordinates; otherwise, return null
    return imageDetail ? imageDetail.value : null;
  }
})
.catch((error) => console.error("Error fetching data:", error));

const images = ["invoice.png"]; // Add more image URLs as needed

// Initialize index for the current image
let currentIndex = 0;

// Function to change the image
function changeImage(index) {
  const imageView = document.getElementById("imageView");
  imageView.src = images[index];
}

// Event listener for clicking on the image
document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.querySelector(".image-container");

  // Initial image
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
