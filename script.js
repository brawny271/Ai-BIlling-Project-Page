// fetch("sample_json.json")
//   .then((response) => response.json())
//   .then((data) => {
//     const imageDetails = data.data[0].image_details;
//     const imageWidth = data.data[0].image_width;
//     const imageHeight = data.data[0].image_hight;

//     const coOrdinatesForImage = {};

//     const inputs = document.querySelectorAll("input[id]");
//     inputs.forEach((input, i) => {
//       const key = input.id;
//       const matchingDetail = imageDetails.find((detail) =>
//         detail.hasOwnProperty(key)
//       );
//       if (matchingDetail && matchingDetail[key].length === 1) {
//         input.value = matchingDetail[key][0];
//       } else if (matchingDetail && matchingDetail[key].length > 1) {
//         const values = matchingDetail[key];
//         const parentDiv = input.parentElement;
//         values.forEach((value, idx) => {
//           if (idx === 0) {
//             input.value = value;
//           } else {
//             const newInput = document.createElement("input");
//             newInput.type = "text";
//             newInput.value = value;
//             newInput.className = "values product_no";
//             parentDiv.appendChild(newInput);
//           }
//         });
//       }
//     });

//     inputs.forEach((input) => {
//       input.addEventListener("click", highlightImageArea);
//     }); 

//     function highlightImageArea(event) {
//       const inputId = event.target.id;

//       const imageView = document.getElementById("imageView");
//       const imageContainer = document.querySelector(".image-container");
//       const coordinates = getCoordinatesForInputId(inputId, imageDetails);

//       if (coordinates) {
//         const scaleX = imageView.naturalWidth / imageView.offsetWidth;
//         const scaleY = imageView.naturalHeight / imageView.offsetHeight;

//         const relativeX = coordinates.x * scaleX;
//         const relativeY = coordinates.y * scaleY;
//         const relativeWidth = Math.min(
//           coordinates.width * scaleX,
//           imageView.naturalWidth - relativeX
//         );
//         const relativeHeight = Math.min(
//           coordinates.height * scaleY,
//           imageView.naturalHeight - relativeY
//         );

//         const existingCanvas = document.querySelector(".highlight-canvas");
//         if (existingCanvas) {
//           existingCanvas.parentNode.removeChild(existingCanvas);
//         }

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
        
//         canvas.width = imageWidth;
//         canvas.height = imageHeight;
//         canvas.classList.add("highlight-canvas");

//         ctx.fillStyle = "rgba(4, 132, 9, 0.1)"; 
//         ctx.strokeStyle = "rgba(4, 132, 9, 0.8)"; 
//         ctx.strokeRect(relativeX, relativeY, relativeWidth, relativeHeight);
//         ctx.fillRect(relativeX, relativeY, relativeWidth, relativeHeight);

//         canvas.style.position = "absolute";
//         canvas.style.top = "0";
//         canvas.style.left = "0";
//         canvas.style.zIndex = "2";
//         imageContainer.appendChild(canvas);

//         setTimeout(() => {
//           canvas.classList.add("show"); // Add 'show' class to trigger transition
//           setTimeout(() => {
//             if (canvas.parentNode === imageContainer) {
//               imageContainer.removeChild(canvas);
//             }
//           }, 500); // Wait for transition to finish before removing the canvas
//         }, 1500);
//       }
//     }
  
//     document
//       .getElementById("imageView")
//       .addEventListener("click", highlightImageArea);

//     function getCoordinatesForInputId(inputId, imageDetails) {
//       const imageDetail = imageDetails.find((detail) => detail.id === inputId);
//       return imageDetail ? imageDetail.value : null;
//     }
//   })
//   .catch((error) => console.error("Error fetching data:", error));



document.addEventListener("DOMContentLoaded", function() {
  fetchData();
});

function fetchData() {
  fetch(`http://172.16.12.21:8000/test/invoice_data?invoice_file_id=3&page=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const pageData = data[0];
      const imageDimensions = pageData.image_dimensions;
      const content = pageData.content;

      const coOrdinatesForImage = {};

      const inputs = document.querySelectorAll("input[id]");
      inputs.forEach((input, i) => {
        const key = input.id;
        const field = content[key];
        if (field) {
          const idToFind = field.id;
          const matchingField = Object.values(content).find(field => field.id === idToFind);
          if (matchingField) {
            input.value = matchingField.value;
          }
          input.addEventListener("click", highlightImageArea);
        }
      });

      function highlightImageArea(event) {
        const inputId = event.target.id;

        const imageView = document.getElementById("imageView");
        const imageContainer = document.querySelector(".image-container");
        const field = content[inputId];

        if (field) {
          const [x, y, w, h] = field.bbox.map((coord, idx) => coord * (idx < 2 ? 1 : (idx % 2 === 0 ? imageView.offsetWidth : imageView.offsetHeight)));

          const existingCanvas = document.querySelector(`.highlight-canvas-${inputId}`);
          if (existingCanvas) {
            existingCanvas.parentNode.removeChild(existingCanvas);
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          canvas.width = imageView.offsetWidth;
          canvas.height = imageView.offsetHeight;
          canvas.classList.add(`highlight-canvas-${inputId}`);

          ctx.fillStyle = "rgba(4, 132, 9, 0.1)"; 
          ctx.strokeStyle = "rgba(4, 132, 9, 0.8)"; 
          ctx.strokeRect(x, y, w, h);
          ctx.fillRect(x, y, w, h);

          canvas.style.position = "absolute";
          canvas.style.top = "0";
          canvas.style.left = "0";
          canvas.style.zIndex = "2";
          imageContainer.appendChild(canvas);

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
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // You can display a message or perform any other action here to notify the user of the error
    });
}


// submit Form Functionality


document.addEventListener("DOMContentLoaded", function() {
  fetchData();

  const submitButton = document.querySelector(".submitform-btn");
  console.log(submitButton); // Debugging: Check if submit button is correctly selected
  submitButton.addEventListener("click", submitForm);
});

function submitForm() {
  console.log("Submit button clicked"); // Debugging: Check if submitForm function is being called
  const inputs = document.querySelectorAll("input[id]");
  const updatedData = {};

  inputs.forEach(input => {
    const key = input.id;
    const value = input.value;
    updatedData[key] = value;
  });

  console.log("Updated data:", updatedData); // Debugging: Check the updated data

  sendData(updatedData);
}

function sendData(data) {
  console.log("Sending data:", data); // Debugging: Check if sendData function is being called
  fetch(`http://172.16.12.21:8000/test/submit_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(responseData => {
    // Handle successful response from the server
    console.log("Data submitted successfully:", responseData);
  })
  .catch(error => {
    console.error('Error submitting data:', error);
    // You can display a message or perform any other action here to notify the user of the error
  });
}

// Image render functionality

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



// Zoom In Zoom OUT Image functionality

document.addEventListener('DOMContentLoaded', function() {
  const imageContainer = document.getElementById('imageContainer');
  const imageView = document.getElementById('imageView');
  const zoomInButton = document.getElementById('zoomIn');
  const zoomOutButton = document.getElementById('zoomOut');

  let scaleFactor = 1;
  let isDragging = false;
  let startX, startScrollLeft;

  // Zoom in functionality
  zoomInButton.addEventListener('click', function() {
      scaleFactor += 0.1;
      updateImageSize();
      imageView.classList.add('draggable'); // Add class to indicate draggability
      // Change cursor to grab
      zoomInButton.style.cursor = "grab";
      zoomOutButton.style.cursor = "grab";
  });

  // Zoom out functionality
  zoomOutButton.addEventListener('click', function() {
      scaleFactor -= 0.1;
      updateImageSize();
      imageView.classList.add('draggable'); // Add class to indicate draggability
      // Change cursor to grab
      zoomInButton.style.cursor = "grab";
      zoomOutButton.style.cursor = "grab";
  });

  // Function to update image size based on scale factor
  function updateImageSize() {
      imageView.style.transform = `scale(${scaleFactor})`;
  }

  // Mouse down event listener
  imageView.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startScrollLeft = imageView.scrollLeft;
      imageView.classList.add('dragging'); // Add class to indicate dragging
      e.preventDefault(); // Prevent default behavior (e.g., text selection)
  });

  // Mouse move event listener
  document.addEventListener('mousemove', function(e) {
      if (isDragging) {
          let deltaX = e.clientX - startX;
          imageView.scrollLeft = startScrollLeft - deltaX;
      }
  });

  // Mouse up event listener
  document.addEventListener('mouseup', function() {
      isDragging = false;
      imageView.classList.remove('dragging'); // Remove dragging class
      // Change cursor back to pointer
      zoomInButton.style.cursor = "pointer";
      zoomOutButton.style.cursor = "pointer";
  });
});

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
