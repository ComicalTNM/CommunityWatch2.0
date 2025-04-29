        const backendUrl = 'http://localhost:5000';
        let index = 0;
        const totalIframes = 5;
        const visibleIframes = 3;
        const carousel = document.getElementById('carousel');

        const positions = [0, 0, 0]; // For each carousel
        const visibleCount = 3;
      
        function moveSlide(step, carouselIndex) {
          const container = document.getElementById(`carousel${carouselIndex}`);
          const totalSlides = container.children.length;
      
          positions[carouselIndex] += step;
      
          if (positions[carouselIndex] < 0) positions[carouselIndex] = 0;
          if (positions[carouselIndex] > totalSlides - visibleCount) {
            positions[carouselIndex] = totalSlides - visibleCount;
          }
      
          const slideWidth = container.children[0].offsetWidth;
          container.style.transform = `translateX(-${positions[carouselIndex] * slideWidth}px)`;
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
            const posts = await response.json();
            return posts; //This should be an array of all events (posts)
        }

        async function displayEvents() {
            const userData = await fetchUserData(); //Get user data
            const allEvents = await fetchEvents(); //Get all events

            console.log("Current User's Data:\n", userData);
            console.log("All Posts/Events in the database\n", allEvents);
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
                iframe.src = `../../components/Responsive-Card-Support-Request/Responsive-Card-Support?eventId=${event._id}`;
                iframe.classList.add('results-iframe');
                section.appendChild(iframe);
            });
            console.log(`Added ${events.length} events to section ${sectionId}`);
        }

        //Call the display function to update the homepage
        displayEvents();

        //LeaderBoard Code
        const leaderboards = {
            weekly: Array.from({ length: 10 }, (_, i) => ({
                rank: i + 1,
                name: `Weekly User ${i + 1}`,
                score: 1000 + i * 50 + " Points",
                image: `https://via.placeholder.com/50?text=W${i + 1}` 
            })),
            monthly: Array.from({ length: 10 }, (_, i) => ({
                rank: i + 1,
                name: `Monthly User ${i + 1}`,
                score: 2000 + i * 100 + " Points",
                image: `https://via.placeholder.com/50?text=M${i + 1}` 
            })),
            overall: Array.from({ length: 10 }, (_, i) => ({
                rank: i + 1,
                name: `Overall User ${i + 1}`,
                score: 5000 + i * 200 + " Points",
                image: `https://via.placeholder.com/50?text=O${i + 1}` 
            }))
          };
          
          const leaderboardList = document.getElementById('leaderboardList');
          
          function showLeaderboard(type) {
            const data = leaderboards[type];
            leaderboardList.innerHTML = '';
            data.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.className = 'leaderboard-item';
                listItem.innerHTML = `
                    <span class="leaderboard-rank">#${entry.rank}</span>
                    <img src="${entry.image}" alt="User Image" class="leaderboard-image">
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}</span>
                `;
                leaderboardList.appendChild(listItem);
            });
          }
          