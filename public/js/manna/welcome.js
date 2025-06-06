document.addEventListener('DOMContentLoaded', () => {
    const doorPreloader = document.getElementById('doorPreloader');
    const mainContent = document.getElementById('mainContent');
    const heroSection = document.getElementById('heroSection');
    const mainActionButton = document.getElementById('mainActionButton');
    const personalInfoModal = document.getElementById('personalInfoModal'); // Changed ID
    const closeModalButton = personalInfoModal.querySelector('.close-button');
    const personalInfoForm = document.getElementById('personalInfoForm'); // Changed form ID

    // --- 1. Door Opening Animation ---
    setTimeout(() => {
        doorPreloader.classList.add('animate');
        setTimeout(() => {
            doorPreloader.classList.add('fade-out');
            mainContent.classList.add('visible');
            // Remove preloader from DOM after transition
            setTimeout(() => {
                doorPreloader.remove();
            }, 1000); // Wait for fade-out to complete
        }, 1500); // Duration of door opening animation
    }, 500); // Small delay before animation starts

    // --- 2. Dynamic Food Background (Hero Section) ---
   const foodImages = [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19', // General Food: Noodles with vegetables
    'https://images.unsplash.com/photo-1512568400610-62da28bc8a13', // General Food: Spaghetti
    'https://images.unsplash.com/photo-1516684669134-de6f7c473025', // General Food: Ramen seafood
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f', // Dessert: Stack of doughnuts
    'https://images.unsplash.com/photo-1508737804141-4c3b68827d3d', // Dessert: Purple ice pops
    'https://images.unsplash.com/photo-1499638673628-74d0529d31f1', // Dessert: Croissants
    'https://images.unsplash.com/photo-1657299156537-d3e3f47f0eb4', // Tanzanian Food: Plates of African food
    'https://images.unsplash.com/photo-1657299156003-2f635e0b7c92', // Tanzanian Food: Bowl of African food
    'https://images.unsplash.com/photo-1657299156267-122ed3e3e1d0', // Tanzanian Food: Pita with African food
    'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38', // Breakfast/Brunch: Pancake with berries
    'https://images.unsplash.com/photo-1492681290082-e932765939e6', // Breakfast/Brunch: Pancakes with syrup
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', // Dinner/Cuisine: Vegetable salad
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435', // Dinner/Cuisine: Burger
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352', // Dinner/Cuisine: Pasta
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836'  // Dinner/Cuisine: Wrap with veggies
];
    let currentImageIndex = 0;

    function changeHeroBackground() {
        currentImageIndex = (currentImageIndex + 1) % foodImages.length;
        heroSection.style.backgroundImage = `url('${foodImages[currentImageIndex]}')`;
    }

    // Change background every 7 seconds
    setInterval(changeHeroBackground, 7000);

    // --- 3. Dynamic Call to Action Button ---
    const actionTexts = [
        "Get Started", // Updated action text
        "Sign Up Now",
        "Enter Details",
        "Join Manna"
    ];
    let currentActionIndex = 0;

    function updateActionButtonText() {
        mainActionButton.textContent = actionTexts[currentActionIndex];
        currentActionIndex = (currentActionIndex + 1) % actionTexts.length;
    }

    // Update button text every 4 seconds
    setInterval(updateActionButtonText, 4000);
    updateActionButtonText(); // Set initial text

    // --- 4. Personal Info Modal Functionality ---

    mainActionButton.addEventListener('click', () => {
        personalInfoModal.style.display = 'flex'; // Use flex to center
    });

    closeModalButton.addEventListener('click', () => {
        personalInfoModal.style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == personalInfoModal) {
            personalInfoModal.style.display = 'none';
        }
    });

    // Handle personal info form submission
    personalInfoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        const form = event.target;
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            password: formData.get('password'),
            username: formData.get('username')
        };

        console.log('Personal Info Form Submitted:', data);
        alert('Thank you for providing your information! Proceeding to your personalized experience.');

        // In a real application, you would:
        // 1. Send this data to a server for user registration/creation.
        // 2. Handle server response (e.g., success, validation errors).
        // 3. Redirect the user to the actual "after login" (dashboard) page.
        //    For now, we'll just close the modal and you can simulate the next page.
        // window.location.href = '/dashboard.html'; // Example redirection

        personalInfoModal.style.display = 'none'; // Close the modal
        form.reset(); // Clear the form
    });
});