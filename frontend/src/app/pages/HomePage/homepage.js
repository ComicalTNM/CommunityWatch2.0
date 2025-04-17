        const backendUrl = 'http://localhost:5000';
        let index = 0;
        const totalIframes = 5;
        const visibleIframes = 3;
        const carousel = document.getElementById('carousel');

        function scrollRight() {
            if (index < totalIframes - visibleIframes) {
                index++;
                updateCarousel();
            }
        }

        function scrollLeft() {
            if (index > 0) {
                index--;
                updateCarousel();
            }
        }

        function updateCarousel() {
            const shift = -(index * (100 / visibleIframes));
            const carousels = document.querySelectorAll('.carousel-wrapper');
            carousels.forEach(carousel => {
                carousel.style.transform = `translateX(${shift}%)`;
            });
        }

        //Assumes user data is stored in sessionStorage
        const userId = sessionStorage.getItem("userId") //Verify if this is the correct way to get the userId

        //Fetch user data
        async function fetchUserData() {
            const response = await fetch(`${backendUrl}/api/users/${userId}`);
            const userData = await response.json();
            return userData; //This should include registeredEvents, completedEvents, and interests
        }

        //Fetch all events
        async function fetchEvents() {
            const response = await fetch (`${backendUrl}/api/posts/`);
            const {posts} = await response.json();
            return posts; //This should be an array of all events (posts)
        }

        async function displayEvents() {
            const userData = await fetchUserData(); //Get user data
            const allEvents = await fetchEvents(); //Get all events

            //Filter events based on user data
            const upcomingEvents = allEvents.filter(event => userData.registeredEvents.includes(event._id.toString()) && new Date(event.eventDate) > new Date());

            const completedEvents = allEvents.filter(event => userData.completedEvents.includes(event._id.toString()) && new Date(event.eventDate) < new Date());

            const recommendedEvents = allEvents.filter(event => event.tags.some(tag => userData.interests.includes(tag)) && new Date(event.eventDate) > new Date());

            //Update the homepage with these events
            updateEventSection('UpcomingEvents', upcomingEvents);
            updateEventSection('Completed', completedEvents);
            updateEventSection('Recommended', recommendedEvents);
        }

        //Update event section with the filtered events
        function updateEventSection(sectionId, events){
            const section = document.querySelector(`.${sectionId} .carousel-wrapper`);
            section.innerHTML = ''; //Clear existing events

            events.forEach(event => {
                console.log(`${sectionId} event:`, event._id, typeof event._id);
                const iframe = document.createElement('iframe');
                iframe.src = `../../components/Responsive-Card-Support-Request/Responsive-Card-Support.html?eventId=${event._id}`;
                iframe.classList.add('results-iframe');
                section.appendChild(iframe);
            });
            console.log(`Added ${events.length} events to section ${sectionId}`);
        }

        //Call the display function to update the homepage
        displayEvents();