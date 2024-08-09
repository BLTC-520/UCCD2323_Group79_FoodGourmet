// Main IIFE to avoid polluting the global scope
(function ($, window, document) {
  "use strict";

  // Configuration object
  const config = {
    apiKey: "cc443a5183234994a194d84798eb1099",
    apiUrl: "https://api.spoonacular.com/recipes/random",
    cookieExpiration: 30,
    sliderInterval: 2000,
    scrollThreshold: 0.75,
  };

  // DOM elements
  const elements = {
    burger: document.querySelector(".burger"),
    nav: document.querySelector(".nav-links"),
    navLinks: document.querySelectorAll(".nav-links li"),
    backToTopButton: document.getElementById("back-to-top"),
    header: document.querySelector("nav"),
    blogSlider: document.querySelector(".blog-slider"),
    blogFlexContainer: document.querySelector(".blog-flex-container"),
    blogCards: document.querySelectorAll(".blog-card"),
    aboutSection: document.querySelector("#about"),
    animatedElements: document.querySelectorAll(".animate-text"),
    welcomeMessage: document.getElementById("welcome-message"),
    favoritesList: document.getElementById("favorites-list"),
    cookieConsent: document.getElementById("cookie-consent"),
    acceptCookiesBtn: document.getElementById("accept-cookies"),
    recipesContainer: document.getElementById("recipes-container"),
  };

  // Utility functions
  const utils = {
    setCookie: function (name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    getCookie: function (name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    setLocalStorage: function (key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    getLocalStorage: function (key) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },

    setSessionStorage: function (key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },

    getSessionStorage: function (key) {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
  };

  // Main functionality
  const app = {
    init: function () {
      this.bindEvents();
      this.initializeSlider();
      this.initializeStorageTechnologies();
      this.fetchRandomRecipes();
      this.animateOnScroll();
    },

    bindEvents: function () {
      window.addEventListener("scroll", this.handleScroll.bind(this));
      elements.burger.addEventListener(
        "click",
        this.toggleNavigation.bind(this)
      );
      elements.backToTopButton.addEventListener("click", this.scrollToTop);
      elements.acceptCookiesBtn.addEventListener(
        "click",
        this.acceptCookies.bind(this)
      );
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", this.smoothScroll);
      });
    },

    handleScroll: function () {
      this.animateHeader();
      this.toggleBackToTopButton();
      this.animateSections();
    },

    animateHeader: function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = elements.header.offsetHeight;

      if (scrollTop > this.lastScrollTop && scrollTop > headerHeight) {
        elements.header.style.transform = `translateY(-${headerHeight}px)`;
      } else {
        elements.header.style.transform = "translateY(0)";
      }
      this.lastScrollTop = scrollTop;
    },

    toggleBackToTopButton: function () {
      elements.backToTopButton.style.display =
        window.pageYOffset > 300 ? "block" : "none";
    },

    toggleNavigation: function () {
      elements.nav.classList.toggle("nav-active");
      elements.navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`;
        }
      });
      elements.burger.classList.toggle("toggle");
    },

    smoothScroll: function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    },

    scrollToTop: function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    animateSections: function () {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * config.scrollThreshold) {
          section.classList.add("animate");
        }
      });
    },

    initializeSlider: function () {
      const cardsToClone = 3;
      for (let i = 0; i < cardsToClone; i++) {
        elements.blogFlexContainer.appendChild(
          elements.blogCards[i].cloneNode(true)
        );
      }
      this.startSlider();
      elements.blogSlider.addEventListener("mouseenter", () =>
        clearInterval(this.sliderInterval)
      );
      elements.blogSlider.addEventListener("mouseleave", () =>
        this.startSlider()
      );
      window.addEventListener("resize", this.resizeSlider.bind(this));
    },

    startSlider: function () {
      this.sliderInterval = setInterval(
        this.slideNext.bind(this),
        config.sliderInterval
      );
    },

    slideNext: function () {
      this.currentIndex++;
      const cardWidth =
        elements.blogCards[0].offsetWidth +
        parseInt(getComputedStyle(elements.blogCards[0]).marginRight);
      elements.blogFlexContainer.style.transition = "transform 0.5s ease";
      elements.blogFlexContainer.style.transform = `translateX(-${
        this.currentIndex * cardWidth
      }px)`;

      if (this.currentIndex >= elements.blogCards.length) {
        setTimeout(() => {
          elements.blogFlexContainer.style.transition = "none";
          this.currentIndex = 0;
          elements.blogFlexContainer.style.transform = "translateX(0)";
        }, 500);
      }
    },

    resizeSlider: function () {
      const cardWidth =
        elements.blogCards[0].offsetWidth +
        parseInt(getComputedStyle(elements.blogCards[0]).marginRight);
      elements.blogFlexContainer.style.transition = "none";
      elements.blogFlexContainer.style.transform = `translateX(-${
        this.currentIndex * cardWidth
      }px)`;
    },

    initializeStorageTechnologies: function () {
      this.initializeWelcomeMessage();
      this.initializeFavoriteCuisines();
      this.initializeCookieConsent();
    },

    initializeWelcomeMessage: function () {
      let userName = utils.getCookie("userName");
      if (!userName) {
        userName = prompt("Welcome! What's your name?");
        if (userName) {
          utils.setCookie("userName", userName, config.cookieExpiration);
        }
      }
      if (userName) {
        elements.welcomeMessage.textContent = `Welcome back, ${userName}!`;
      }
    },

    initializeFavoriteCuisines: function () {
      const favoriteCuisines = utils.getLocalStorage("favoriteCuisines") || [];
      this.updateFavoritesList(favoriteCuisines);
      this.setupFavoriteButtons(favoriteCuisines);
    },

    updateFavoritesList: function (favoriteCuisines) {
      elements.favoritesList.innerHTML = favoriteCuisines
        .map(
          (cuisine) => `
          <div class="favorite-item">
            <h3>${cuisine}</h3>
            <button class="remove-favorite" data-cuisine="${cuisine}">Remove</button>
          </div>
        `
        )
        .join("");
    },

    setupFavoriteButtons: function (favoriteCuisines) {
      document.querySelectorAll(".cuisine-card").forEach((card) => {
        const favoriteBtn = card.querySelector(".favorite-btn");
        const cuisineName = card.querySelector("h3").textContent;

        if (favoriteCuisines.includes(cuisineName)) {
          favoriteBtn.classList.add("active");
        }

        favoriteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleFavoriteCuisine(
            cuisineName,
            favoriteBtn,
            favoriteCuisines
          );
        });
      });

      elements.favoritesList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-favorite")) {
          const cuisineToRemove = e.target.getAttribute("data-cuisine");
          this.removeFavoriteCuisine(cuisineToRemove, favoriteCuisines);
        }
      });
    },

    toggleFavoriteCuisine: function (
      cuisineName,
      favoriteBtn,
      favoriteCuisines
    ) {
      const index = favoriteCuisines.indexOf(cuisineName);
      if (index === -1) {
        favoriteCuisines.push(cuisineName);
        favoriteBtn.classList.add("active");
        alert(`Added ${cuisineName} to favorites!`);
      } else {
        favoriteCuisines.splice(index, 1);
        favoriteBtn.classList.remove("active");
        alert(`Removed ${cuisineName} from favorites!`);
      }
      utils.setLocalStorage("favoriteCuisines", favoriteCuisines);
      this.updateFavoritesList(favoriteCuisines);
    },

    removeFavoriteCuisine: function (cuisineToRemove, favoriteCuisines) {
      const index = favoriteCuisines.indexOf(cuisineToRemove);
      if (index > -1) {
        favoriteCuisines.splice(index, 1);
        utils.setLocalStorage("favoriteCuisines", favoriteCuisines);
        this.updateFavoritesList(favoriteCuisines);
        document.querySelectorAll(".cuisine-card").forEach((card) => {
          if (card.querySelector("h3").textContent === cuisineToRemove) {
            card.querySelector(".favorite-btn").classList.remove("active");
          }
        });
      }
    },

    initializeCookieConsent: function () {
      if (!utils.getCookie("cookieConsent")) {
        elements.cookieConsent.style.display = "block";
      }
    },

    acceptCookies: function () {
      utils.setCookie("cookieConsent", "true", 365);
      elements.cookieConsent.style.display = "none";
    },

    fetchRandomRecipes: function () {
      $.ajax({
        url: `${config.apiUrl}?number=3&apiKey=${config.apiKey}`,
        method: "GET",
        success: function (response) {
          console.log("API Response:", response); // Log the full response
          this.displayRandomRecipes(response);
        }.bind(this),
        error: function (xhr, status, error) {
          console.error("Error fetching recipes:", error);
          console.log("XHR:", xhr); // Log the XHR object for more details
          elements.recipesContainer.innerHTML =
            "<p>Sorry, we couldn't load recipes at this time. Please try again later.</p>";
        },
      });
    },

    displayRandomRecipes: function (response) {
      elements.recipesContainer.innerHTML = "";

      response.recipes.forEach((recipe) => {
        const recipeHtml = `
          <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Ready in ${recipe.readyInMinutes} minutes</p>
            <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-primary">View Recipe</a>
          </div>
        `;
        elements.recipesContainer.insertAdjacentHTML("beforeend", recipeHtml);
      });
    },

    animateOnScroll: function () {
      const aboutObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              elements.animatedElements.forEach((el) =>
                el.classList.add("active")
              );
              aboutObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      aboutObserver.observe(elements.aboutSection);
    },
  };

  // Initialize the application when the DOM is ready
  $(document).ready(app.init.bind(app));
})(jQuery, window, document);
