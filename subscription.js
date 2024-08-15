$(document).ready(function () {
  const basicForm = $("#basicForm");
  const proForm = $("#proForm");
  const basicButton = $("#basicButton");
  const proButton = $("#proButton");

  updateButtonStates();

  basicButton.on("click", function () {
    toggleSubscription("Basic Plan");
  });

  proButton.on("click", function () {
    toggleSubscription("Food Gourmet Pro");
  });

  basicForm.on("submit", function (e) {
    e.preventDefault();
    const email = $("#basicEmail").val();
    setSubscriptionData("Basic Plan", email);
    alert("Congrats on signing up for our newsletter. Enjoy our site!");
    window.location.href = "index.html";
  });

  proForm.on("submit", function (e) {
    e.preventDefault();
    const email = $("#proEmail").val();
    const cardNumber = $("#cardNumber").val();
    const expiryDate = $("#expiryDate").val();
    const cvv = $("#cvv").val();
    setSubscriptionData("Food Gourmet Pro", email, cardNumber, expiryDate, cvv);
    alert(
      "Congrats on signing up for our Food Gourmet Pro Plan. Enjoy our site!"
    );
    window.location.href = "index1.html";
  });

  function toggleSubscription(plan) {
    const currentPlan = localStorage.getItem("subscriptionPlan");

    if (currentPlan === "Food Gourmet Pro" && plan === "Food Gourmet Pro") {
      if (
        confirm(
          "Your current Pro plan will be active until the end of the billing cycle. Are you sure you want to unsubscribe?"
        )
      ) {
        localStorage.removeItem("subscriptionPlan");
        localStorage.removeItem("subscriptionEmail");
        localStorage.removeItem("subscriptionCardData");
        // setting a cookie's expiration date to a past date is to effectively delete the cookie
        document.cookie =
          "subscriptionPlan=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "subscriptionEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert(
          "You have been unsubscribed from the Food Gourmet Pro plan. You will be redirected to the free plan."
        );
        window.location.href = "index.html";
      }
    } else {
      $("#basicSignupForm").addClass("hidden");
      $("#proSignupForm").addClass("hidden");

      if (plan === "Basic Plan") {
        $("#basicSignupForm").removeClass("hidden");
      } else {
        $("#proSignupForm").removeClass("hidden");
      }
    }
  }

  function setSubscriptionData(plan, email, cardNumber, expiryDate, cvv) {
    localStorage.setItem("subscriptionPlan", plan);
    localStorage.setItem("subscriptionEmail", email);
    setCookie("subscriptionPlan", plan, 365);
    setCookie("subscriptionEmail", email, 365);

    if (plan === "Food Gourmet Pro") {
      const cardData = {
        number: cardNumber,
        expiry: expiryDate,
        cvv: cvv,
      };
      localStorage.setItem("subscriptionCardData", JSON.stringify(cardData));
    }
  }

  function updateButtonStates() {
    const currentPlan = localStorage.getItem("subscriptionPlan");
    const currentPlanElement = $("#current-plan");

    if (currentPlan === "Basic Plan") {
      currentPlanElement.text("Current Plan: Basic Plan");
      basicButton.text("Current Plan").prop("disabled", true);
      proButton.text("Upgrade to Pro");
    } else if (currentPlan === "Food Gourmet Pro") {
      currentPlanElement.text("Current Plan: Food Gourmet Pro");
      basicButton.text("Downgrade to Basic");
      proButton.text("Unsubscribe");
    } else {
      currentPlanElement.text("You are not currently subscribed to any plan.");
      basicButton.text("Subscribe");
      proButton.text("Subscribe");
    }
  }

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
});
