// This file assumes SESSION_DATA_URL is defined in the HTML template before it is loaded.

let accumulatedMinutes = 0;
let sessionStartTime = null;
let updateInterval = null;

// Utility function to format minutes into Hh Mm
function formatTime(totalMinutes) {
    if (totalMinutes < 0) totalMinutes = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
}

// Function to update the display in real-time
function updateLiveTotal() {
    if (sessionStartTime) {
        const now = new Date();
        // Calculate time elapsed in the CURRENT segment
        const elapsedMs = now - sessionStartTime;
        const elapsedMinutes = elapsedMs / 60000;
        
        // Calculate the total time worked today
        const totalMinutes = accumulatedMinutes + elapsedMinutes;
        
        // NOTE: Ensure an element with id='live-daily-total' exists in your HTML
        const totalElement = document.getElementById('live-daily-total');
        if (totalElement) {
             totalElement.innerText = formatTime(totalMinutes);
        }

    } else if (accumulatedMinutes > 0) {
         // Show only accumulated time if session isn't active
         const totalElement = document.getElementById('live-daily-total');
         if (totalElement) {
            totalElement.innerText = formatTime(accumulatedMinutes);
         }
    }
}

// Fetch initial data and start the timer
function initializeLiveTracker() {
    // *** Use the global variable SESSION_DATA_URL ***
    fetch(SESSION_DATA_URL) 
        .then(response => response.json())
        .then(data => {
            accumulatedMinutes = data.accumulated_minutes || 0;
            
            if (data.status === 'active' && data.session_start_iso) {
                
                let sessionIsoString = data.session_start_iso;
                
                if (!sessionIsoString.endsWith('Z')) {
                    sessionIsoString += 'Z';
                }
                
                sessionStartTime = new Date(sessionIsoString); 
                
                // Start the live display interval
                updateInterval = setInterval(updateLiveTotal, 1000); 
            }
            
            // Show initial accumulated total even if session is inactive
            updateLiveTotal(); 
        })
        .catch(error => {
            const totalElement = document.getElementById('live-daily-total');
            if (totalElement) {
                totalElement.innerText = 'Data Error';
            }
            console.error('Error fetching session data:', error);
        });
}

// Start the tracker when the dashboard loads
document.addEventListener('DOMContentLoaded', initializeLiveTracker);

// Stop the interval on page unload (good practice)
window.addEventListener('beforeunload', () => {
    if (updateInterval) clearInterval(updateInterval);
});