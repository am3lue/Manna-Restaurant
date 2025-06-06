Manna Restaurant Website
Welcome to the Manna Restaurant website project! This is a modern, responsive landing page designed to showcase the restaurant's offerings, engage users with dynamic visuals, and provide easy navigation to key sections like login and signup. The site features a door-opening preloader, dynamic food backgrounds, and visually appealing gradients, all optimized for desktop and mobile devices.
Project Overview
The goal of this project is to create an attractive, user-friendly landing page for Manna Restaurant. Key features include:

A door-opening animation as a preloader.
A hero section with dynamic food images that change based on the time of day (e.g., breakfast, dinner, desserts).
A stylized "Manna Restaurant" text logo.
A dynamic call-to-action button that cycles text and triggers a login/signup modal.
Sections for About Us, Testimonials, Recommendations, and Contact Us, with radial gradient backgrounds.
Cards with linear diagonal gradients for visual appeal.
A map of Arusha, Tanzania, in the Contact Us section.
A responsive design compatible with all devices, including phones.

File Structure

index.html: The main HTML file defining the structure of the landing page.
style.css: The CSS file for styling, animations, gradients, and responsiveness.
script.js: The JavaScript file for preloader animation, dynamic background changes, and modal functionality.

Setup Instructions

Clone or Download:

Clone this repository or download the files to your local machine.
Ensure all files (index.html, style.css, script.js) are in the same directory.


Dependencies:

No external libraries are required.
The project uses Google Fonts (Open Sans and Playfair Display) loaded via CSS.
The Contact Us section uses an embedded Google Maps iframe.


Image Setup:

The script.js file includes a foodImages array with 15 static Unsplash image URLs for general food, desserts, Tanzanian food, breakfast/brunch, and dinner/cuisine.
Replace these URLs with your own optimized food images for better performance and authenticity (e.g., local Tanzanian dishes like ugali or nyama choma).
Optimize images using tools like TinyPNG to reduce load times.


Run the Project:

Open index.html in a modern web browser (e.g., Chrome, Firefox, Safari).
Test on various devices (desktop, tablet, phone) to ensure responsiveness.



Features
Preloader

A door-opening animation using two sliding panels.
Fades out after 1.5 seconds to reveal the main content.

Hero Section

Dynamic Background: Changes based on time of day:
Morning (<12:00): Breakfast image (e.g., pancakes with berries).
Afternoon (<18:00): Lunch image (e.g., vegetable salad).
Evening (<22:00): Dinner image (e.g., burger).
Night (≥22:00): Dessert image (e.g., ice pops).


Logo: A stylized "Manna Restaurant" text in orange (#FF8C00) with a text shadow.
Call-to-Action Button: Cycles through "Order Now," "Explore Menu," and "Join Us" every 3 seconds, linking to the login/signup modal.

Sections

About Us, Testimonials, Recommendations, Contact Us:
Backgrounds use radial gradients (e.g., black to orange for About Us, black to green for Testimonials).
Cards within each section feature linear diagonal gradients (left, center, right directions) for visual appeal.


Contact Us: Includes a Google Maps iframe of Arusha, Tanzania.

Login/Signup Modal

Hidden by default, triggered by the call-to-action button.
Includes separate login and signup forms with basic input fields.
Closes via a "Close" button or by clicking outside the modal.

Responsiveness

Fully responsive design with media queries for screens below 768px and 480px.
Cards stack vertically on mobile devices, and font sizes adjust for readability.

Customization

Images:
Update the foodImages array in script.js with your own image URLs, preferably optimized and hosted locally.
Consider authentic Tanzanian food images (e.g., nyama choma, pilau) for cultural relevance.


Colors:
Modify the CSS variables in :root of style.css to adjust the color scheme:
--orange-color: #FF8C00 (accents, logo)
--green-color: #28A745 (Testimonials)
--blue-color: #007BFF (Recommendations)
--purple-color: #4B0082 (Contact Us)
--black-color: #1A1A1A (background)




Content:
Update text in index.html for About Us, Testimonials, and Recommendations to reflect your restaurant’s story, customer reviews, and menu highlights.


Map:
Replace the Google Maps iframe URL in index.html with a specific location for your restaurant in Arusha, Tanzania.



Usage Notes

Performance: Optimize images for faster loading, especially on mobile devices with varying internet speeds in Tanzania.
Licensing: The provided Unsplash images are free for commercial use, but verify compliance at Unsplash License.
Testing: Test the site on multiple devices and browsers to ensure the preloader, dynamic backgrounds, and modal work correctly.

Acknowledgments

Images: Sourced from Unsplash for high-quality, free food photography.
Fonts: Uses Open Sans and Playfair Display from Google Fonts.
Map: Embedded Google Maps iframe for Arusha, Tanzania.

License
This project is for personal or commercial use by Manna Restaurant. Unsplash images are licensed under the Unsplash License, allowing free use with proper attribution recommended. Ensure all custom content complies with applicable licensing and copyright laws.

Manna RestaurantBuilt with ❤️ for a delightful dining experience!June 6, 2025
