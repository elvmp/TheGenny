document.addEventListener("DOMContentLoaded", function () {
    const generateInfoButton = document.getElementById("generateInfo");
    generateInfoButton.addEventListener("click", generateInfo);

    async function generateInfo() {
        const placeName = document.getElementById("placeName").value;
        const infoResult = document.getElementById("infoResult");
        const downloadLink = document.getElementById("downloadLink");

        if (placeName.trim() === "") {
            infoResult.innerText = "Please enter a place name.";
            downloadLink.style.display = "none";
            return;
        }

        try {
            const response = await fetch('/generate_info', {
                method: 'POST',
                body: JSON.stringify({ placeName }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                infoResult.innerHTML = data.result;
                downloadLink.href = `data:application/pdf;base64,${data.pdf}`;
                downloadLink.style.display = "block";
            } else {
                infoResult.innerText = "An error occurred. Please try again.";
                downloadLink.style.display = "none";
            }
        } catch (error) {
            console.error(error);
            infoResult.innerText = "An error occurred. Please try again.";
            downloadLink.style.display = "none";
        }
    }
});
