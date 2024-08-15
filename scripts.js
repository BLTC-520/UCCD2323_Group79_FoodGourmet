$(document).ready(function () {
  // Config
  const config = {
    apiKey: "cc443a5183234994a194d84798eb1099",
    apiUrl: "https://api.spoonacular.com/recipes/random",
    cookieExpiration: 30, //the cookie will expire in 30 days
    sliderInterval: 2000,
    scrollThreshold: 0.75,
  };

  // Get DOM elements
  const elements = {
    burger: $(".burger"),
    nav: $(".nav-links"),
    navLinks: $(".nav-links li"),
    backToTopButton: $("#back-to-top"),
    header: $("nav"),
    blogSlider: $(".blog-slider"),
    blogFlexContainer: $(".blog-flex-container"),
    blogCards: $(".blog-card"),
    aboutSection: $("#about"),
    animatedElements: $(".animate-text"),
    welcomeMessage: $("#welcome-message"),
    favoritesList: $("#favorites-list"),
    cookieConsent: $("#cookie-consent"),
    acceptCookiesBtn: $("#accept-cookies"),
    recipesContainer: $("#recipes-container"),
    showVisitCountBtn: $("#show-visit-count"),
  };

  // Variables
  let currentIndex = 0;
  let sliderInterval;
  let lastScrollTop = 0;

  // Initialize everything
  function init() {
    bindEvents();
    initializeSlider();
    initializeStorageTechnologies();
    fetchRandomRecipes();
    animateOnScroll();
    updateSubscriptionStatus();
    trackPageVisits();
  }

  // Bind events
  function bindEvents() {
    $(window).on("scroll", handleScroll);
    elements.burger.on("click", toggleNavigation);
    elements.backToTopButton.on("click", scrollToTop);
    elements.acceptCookiesBtn.on("click", acceptCookies);
    $('a[href^="#"]').on("click", smoothScroll);
    elements.showVisitCountBtn.on("click", showVisitCount);
  }

  // Handle scroll events
  function handleScroll() {
    animateHeader();
    toggleBackToTopButton();
    animateSections();
  }

  // Animate header on scroll
  function animateHeader() {
    let scrollTop = $(window).scrollTop();
    const headerHeight = elements.header.outerHeight();

    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
      elements.header.css("transform", `translateY(-${headerHeight}px)`);
    } else {
      elements.header.css("transform", "translateY(0)");
    }
    lastScrollTop = scrollTop;
  }

  // Toggle back to top button
  function toggleBackToTopButton() {
    elements.backToTopButton.toggle($(window).scrollTop() > 300);
  }

  // Toggle navigation
  function toggleNavigation() {
    elements.nav.toggleClass("nav-active");
    elements.navLinks.each(function (index) {
      if ($(this).css("animation")) {
        $(this).css("animation", "");
      } else {
        $(this).css(
          "animation",
          `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
        );
      }
    });
    elements.burger.toggleClass("toggle");
  }

  // Smooth scroll
  function smoothScroll(e) {
    e.preventDefault();
    const targetId = $(this).attr("href");
    $(targetId)[0].scrollIntoView({ behavior: "smooth" });
  }

  // Scroll to top
  function scrollToTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }

  // Animate sections on scroll
  function animateSections() {
    $("section").each(function () {
      const sectionTop = $(this).offset().top - $(window).scrollTop();
      if (sectionTop < $(window).height() * config.scrollThreshold) {
        $(this).addClass("animate");
      }
    });
  }

  // Initialize slider
  function initializeSlider() {
    const cardsToClone = 3;
    for (let i = 0; i < cardsToClone; i++) {
      elements.blogFlexContainer.append(elements.blogCards.eq(i).clone());
    }
    startSlider();
    elements.blogSlider.hover(function () {
      clearInterval(sliderInterval);
    }, startSlider);
    $(window).on("resize", resizeSlider);
  }

  // Start slider
  function startSlider() {
    sliderInterval = setInterval(slideNext, config.sliderInterval);
  }

  // Slide to next
  function slideNext() {
    currentIndex++;
    const cardWidth = elements.blogCards.first().outerWidth(true);
    elements.blogFlexContainer.css("transition", "transform 0.5s ease");
    elements.blogFlexContainer.css(
      "transform",
      `translateX(-${currentIndex * cardWidth}px)`
    );

    if (currentIndex >= elements.blogCards.length) {
      setTimeout(() => {
        elements.blogFlexContainer.css("transition", "none");
        currentIndex = 0;
        elements.blogFlexContainer.css("transform", "translateX(0)");
      }, 500);
    }
  }

  // Resize slider
  function resizeSlider() {
    const cardWidth = elements.blogCards.first().outerWidth(true);
    elements.blogFlexContainer.css("transition", "none");
    elements.blogFlexContainer.css(
      "transform",
      `translateX(-${currentIndex * cardWidth}px)`
    );
  }

  // Initialize storage technologies
  function initializeStorageTechnologies() {
    initializeWelcomeMessage();
    initializeFavoriteCuisines();
    initializeCookieConsent();
    initializeSubscriptionData();
  }

  // Initialize welcome message
  function initializeWelcomeMessage() {
    let userName = localStorage.getItem("userName");
    if (!userName) {
      userName = prompt("Welcome! What's your name?");
      if (userName) {
        localStorage.setItem("userName", userName);
      }
    }
    if (userName) {
      elements.welcomeMessage.text(`Welcome back, ${userName}!`);
    }
  }

  // Initialize favorite cuisines
  function initializeFavoriteCuisines() {
    const favoriteCuisines = getLocalStorage("favoriteCuisines") || [];
    updateFavoritesList(favoriteCuisines);
    setupFavoriteButtons(favoriteCuisines);
  }

  // Update favorites list
  function updateFavoritesList(favoriteCuisines) {
    elements.favoritesList.html(
      favoriteCuisines
        .map(
          (cuisine) => `
      <div class="favorite-item">
        <h3>${cuisine}</h3>
        <button class="remove-favorite" data-cuisine="${cuisine}">Remove</button>
      </div>
    `
        )
        .join("")
    );
  }

  // Setup favorite buttons
  function setupFavoriteButtons(favoriteCuisines) {
    $(".cuisine-card").each(function () {
      const favoriteBtn = $(this).find(".favorite-btn");
      const cuisineName = $(this).find("h3").text();

      if (favoriteCuisines.includes(cuisineName)) {
        favoriteBtn.addClass("active");
      }

      favoriteBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteCuisine(cuisineName, favoriteBtn, favoriteCuisines);
      });
    });

    elements.favoritesList.on("click", ".remove-favorite", function () {
      const cuisineToRemove = $(this).data("cuisine");
      removeFavoriteCuisine(cuisineToRemove, favoriteCuisines);
    });
  }

  // Toggle favorite cuisine
  function toggleFavoriteCuisine(cuisineName, favoriteBtn, favoriteCuisines) {
    const index = favoriteCuisines.indexOf(cuisineName);
    if (index === -1) {
      favoriteCuisines.push(cuisineName);
      favoriteBtn.addClass("active");
      alert(`Added ${cuisineName} to favorites!`);
    } else {
      favoriteCuisines.splice(index, 1);
      favoriteBtn.removeClass("active");
      alert(`Removed ${cuisineName} from favorites!`);
    }
    setLocalStorage("favoriteCuisines", favoriteCuisines);
    updateFavoritesList(favoriteCuisines);
  }

  // Remove favorite cuisine
  function removeFavoriteCuisine(cuisineToRemove, favoriteCuisines) {
    const index = favoriteCuisines.indexOf(cuisineToRemove);
    if (index > -1) {
      favoriteCuisines.splice(index, 1);
      setLocalStorage("favoriteCuisines", favoriteCuisines);
      updateFavoritesList(favoriteCuisines);
      $(".cuisine-card").each(function () {
        if ($(this).find("h3").text() === cuisineToRemove) {
          $(this).find(".favorite-btn").removeClass("active");
        }
      });
    }
  }

  // Initialize cookie consent
  function initializeCookieConsent() {
    if (!getCookie("cookieConsent")) {
      elements.cookieConsent.show();
    }
  }

  // Accept cookies
  function acceptCookies() {
    setCookie("cookieConsent", "true", 365);
    elements.cookieConsent.hide();
  }

  // Fetch random recipes
  function fetchRandomRecipes() {
    // starts a jQuery AJAX request.
    // AJAX allows you to make asynchronous HTTP requests to a server without reloading the entire page.
    $.ajax({
      url: `${config.apiUrl}?number=3&apiKey=${config.apiKey}`, // number=3 -> request for 3 recipes
      method: "GET", // GET request，,retrieve data from server
      success: function (response) {
        console.log("API Response:", response);
        displayRandomRecipes(response);
      },
      error: function (xhr, status, error) {
        // xhr: the XMLHttpRequest object
        console.error("Error fetching recipes:", error);
        console.log("XHR:", xhr);
        elements.recipesContainer.html(
          "<p>Sorry, we couldn't load recipes at this time. Please try again later.</p>"
        );
      },
    });
  }

  // Display random recipes
  function displayRandomRecipes(response) {
    elements.recipesContainer.empty();

    response.recipes.forEach(function (recipe) {
      const recipeHtml = `
        <div class="recipe-card">
          <img src="${recipe.image}" alt="${recipe.title}">
          <h3>${recipe.title}</h3>
          <p>Ready in ${recipe.readyInMinutes} minutes</p>
          <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-primary">View Recipe</a>
        </div>
      `;
      elements.recipesContainer.append(recipeHtml);
    });
  }

  // Animate on scroll
  function animateOnScroll() {
    const aboutObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            elements.animatedElements.addClass("active");
            aboutObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    aboutObserver.observe(elements.aboutSection[0]);
  }

  // Initialize subscription data
  function initializeSubscriptionData() {
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");
    const subscriptionEmail = localStorage.getItem("subscriptionEmail");

    if (subscriptionPlan && subscriptionEmail) {
      console.log(`Current subscription: ${subscriptionPlan}`);
      console.log(`Subscription email: ${subscriptionEmail}`);
    }

    if (subscriptionPlan === "Food Gourmet Pro") {
      const cardData = JSON.parse(localStorage.getItem("subscriptionCardData"));
      if (cardData) {
        console.log("Pro user card data available");
      }
    }
  }

  // Update subscription status
  function updateSubscriptionStatus() {
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");
    const subscribeLink = $('a[href="subscription.html"]');

    if (subscriptionPlan === "Food Gourmet Pro") {
      subscribeLink.text("Manage Subscription");
    } else {
      subscribeLink.text("Subscribe to Pro");
    }
  }
  //track the page using sessionStorage
  function trackPageVisits() {
    let sessionVisits = sessionStorage.getItem("pageVisits");
    sessionVisits = sessionVisits ? parseInt(sessionVisits) + 1 : 1;
    sessionStorage.setItem("pageVisits", sessionVisits.toString());

    console.log(`This session: ${sessionVisits} visit(s)`);

    // Update visit count display
    updateVisitDisplay(sessionVisits);
  }

  function updateVisitDisplay(count) {
    let display = $("#visit-count-display");
    if (display.length === 0) {
      display = $("<div>", {
        id: "visit-count-display",
        css: {
          position: "fixed",
          bottom: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 1000,
        },
      });
      $("body").append(display);
    }
    display.text(`Visits this session: ${count}`);
  }

  function showVisitCount() {
    const sessionVisits = sessionStorage.getItem("pageVisits") || "0";
    alert(
      `You've visited pages on this site ${sessionVisits} time(s) this session.`
    );
  }

  // Utility functions
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLocalStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Initialize the application
  init();
});
