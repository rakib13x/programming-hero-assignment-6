let loadedVideos = [];

const loadVideos = async (categoryId) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    );
    const data = await res.json();
    loadedVideos = data.data;
    displayVideos(loadedVideos);
  } catch (error) {
    console.error("Error loading videos:", error);
  }
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  const noVideosMessage = document.getElementById("no-videos-message");
  videoContainer.innerHTML = "";

  if (videos.length === 0) {
    noVideosMessage.classList.remove("hidden");
  } else {
    noVideosMessage.classList.add("hidden");
  }
  videos.forEach((video, index) => {
    const author = video.authors[0];
    let views = video.others.views;

    const postedDate = new Date(video.others.posted_date * 1000);

    const hours = postedDate.getUTCHours();
    const minutes = postedDate.getUTCMinutes();
    const seconds = postedDate.getUTCSeconds();

    const viewId = `view-${index}`;

    const videoCard = document.createElement("div");
    videoCard.classList = `card bg-gray-50 shadow-xl`;
    videoCard.innerHTML = `
      <div class="relative mx-[3rem] rounded">
        <figure>
          <img src="${
            video.thumbnail
          }" alt="Video Thumbnail" class="h-80 w-full object-cover" /> <!-- Apply h-[200px] here -->
        </figure>
        <p class="absolute bottom-0 right-0 bg-black text-white px-2 py-1">${hours}h ${minutes}m ${seconds}s ago</p>
      </div>
      <div class="card-body">
          <div class="flex gap-4 text-black font-bold">
              <img src="${
                author.profile_picture
              }" alt="Author's Profile Picture" class="h-8 w-8 rounded-full">
              <h2 class="card-title">${video.title}</h2>
          </div>
          <div class="ml-11 gap-2">
              <p class="inline-block">${author.profile_name}</p>
              ${
                author.verified
                  ? '<img src="./images/Group 3.png" alt="Verified Icon" class="inline-block">'
                  : ""
              }
              <p class="pt-3" id="${viewId}">${views}</p>
          </div>
      </div>
    `;
    videoContainer.appendChild(videoCard);
  });

  const sortByView = document.getElementById("sort-by-view");

  sortByView.addEventListener("click", () => {
    const videoCardsArray = Array.from(videoContainer.children);

    videoCardsArray.sort((a, b) => {
      const viewA = parseInt(b.querySelector(".pt-3").textContent); // Use class instead of ID
      const viewB = parseInt(a.querySelector(".pt-3").textContent); // Use class instead of ID
      return viewA - viewB;
    });

    while (videoContainer.firstChild) {
      videoContainer.removeChild(videoContainer.firstChild);
    }

    videoCardsArray.forEach((card) => {
      videoContainer.appendChild(card);
    });
  });
};

const categoriesData = [
  { category_id: "1000", category_name: "All" },
  { category_id: "1001", category_name: "Music" },
  { category_id: "1003", category_name: "Comedy" },
  { category_id: "1005", category_name: "Drawing" },
];

let categoryButtons = [];

const loadCategoryButtons = (categories) => {
  const categoryContainer = document.getElementById("category");
  categoryContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.classList =
      "data-category h-[2rem] w-100% px-3 rounded bg-gray-300 text-black md:text-xl md:gap-8 md:h-[2.5rem]";
    button.setAttribute("data-category-id", category.category_id);
    button.textContent = category.category_name;

    if (index === 0) {
      button.classList.add("bg-red-500", "text-white");
    }

    button.addEventListener("click", (event) => {
      categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-red-500", "text-white");
      });

      const clickedButton = event.target;
      clickedButton.classList.add("bg-red-500", "text-white");

      const categoryId = clickedButton.dataset.categoryId;
      loadVideos(categoryId);
    });

    categoryButtons.push(button);
    categoryContainer.appendChild(button);
  });
};

window.addEventListener("load", () => {
  const categoriesData = [
    { category_id: "1000", category_name: "All" },
    { category_id: "1001", category_name: "Music" },
    { category_id: "1003", category_name: "Comedy" },
    { category_id: "1005", category_name: "Drawing" },
  ];

  loadCategoryButtons(categoriesData);

  loadVideos("1000");
});
