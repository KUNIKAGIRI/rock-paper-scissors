document.addEventListener("DOMContentLoaded", () => {
    let player1Choice = "";
    let score1 = 0;
    let score2 = 0;
    let avatar1 = "";
    let avatar2 = "";

    const clickSound = document.getElementById("click-sound");
    const bgMusic = document.getElementById("bg-music");

    function playSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function goToPage(id) {
        document.querySelectorAll(".page").forEach(page => {
            page.classList.add("hidden");
        });
        document.getElementById(id).classList.remove("hidden");
    }

    function handleAvatarClick(wrapper) {
        const player = parseInt(wrapper.dataset.player);
        const avatarPath = wrapper.dataset.avatar;

        playSound();

        if (player === 1) {
            avatar1 = avatarPath;
            document.getElementById("avatar1").src = avatar1;
            document.querySelectorAll("#avatar-options-1 .avatar-wrapper").forEach(w => w.classList.remove("avatar-selected"));
            wrapper.classList.add("avatar-selected");
        } else {
            avatar2 = avatarPath;
            document.getElementById("avatar2").src = avatar2;
            document.querySelectorAll("#avatar-options-2 .avatar-wrapper").forEach(w => w.classList.remove("avatar-selected"));
            wrapper.classList.add("avatar-selected");
        }

        // Ensure tick visibility based on selection
        document.querySelectorAll(".avatar-wrapper").forEach(w => {
            const tick = w.querySelector(".tick");
            if (w.classList.contains("avatar-selected")) {
                tick.style.display = "block";
            } else {
                tick.style.display = "none";
            }
        });

        if (avatar1 && avatar2) {
            setTimeout(() => goToPage("game-page"), 500);
        }
    }

    // Attach avatar click handlers
    document.querySelectorAll(".avatar-wrapper").forEach(wrapper => {
        wrapper.addEventListener("click", () => handleAvatarClick(wrapper));
    });

    // Game logic
    function determineWinner(p1, p2) {
        let result = "";

        if (p1 === p2) {
            result = `It's a tie! Both chose ${p1}`;
        } else if (
            (p1 === "rock" && p2 === "scissors") ||
            (p1 === "paper" && p2 === "rock") ||
            (p1 === "scissors" && p2 === "paper")
        ) {
            result = `Player 1 wins! (${p1} beats ${p2})`;
            score1++;
        } else {
            result = `Player 2 wins! (${p2} beats ${p1})`;
            score2++;
        }

        document.getElementById("score1").textContent = score1;
        document.getElementById("score2").textContent = score2;
        document.getElementById("result-text").textContent = result;
    }

    document.querySelectorAll("#player1 button").forEach(btn => {
        btn.addEventListener("click", () => {
            playSound();
            player1Choice = btn.dataset.choice;
            document.getElementById("player1").classList.add("hidden");
            document.getElementById("player2").classList.remove("hidden");
        });
    });

    document.querySelectorAll("#player2 button").forEach(btn => {
        btn.addEventListener("click", () => {
            playSound();
            const player2Choice = btn.dataset.choice;
            determineWinner(player1Choice, player2Choice);
            player1Choice = "";
            document.getElementById("player2").classList.add("hidden");
            document.getElementById("player1").classList.remove("hidden");
            goToPage("result-page");
        });
    });

    document.getElementById("play-again").addEventListener("click", () => {
        playSound();
        goToPage("game-page");
    });

    document.getElementById("reset-game").addEventListener("click", () => {
        playSound();
        avatar1 = "";
        avatar2 = "";
        score1 = 0;
        score2 = 0;
        player1Choice = "";

        document.getElementById("score1").textContent = "0";
        document.getElementById("score2").textContent = "0";
        document.getElementById("result-text").textContent = "";

        document.querySelectorAll(".avatar-wrapper").forEach(w => {
            w.classList.remove("avatar-selected");
            const tick = w.querySelector(".tick");
            if (tick) tick.style.display = "none";
        });

        goToPage("avatar-page");
    });

    // Auto-play background music after user interacts
    const tryPlayMusic = () => {
        if (bgMusic.paused) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(err => console.log("Music play failed:", err));
        }
        window.removeEventListener("click", tryPlayMusic);
        window.removeEventListener("touchstart", tryPlayMusic);
    };

    window.addEventListener("click", tryPlayMusic);
    window.addEventListener("touchstart", tryPlayMusic);
});