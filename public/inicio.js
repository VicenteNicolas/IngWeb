const fragments = [
    { text: "I wanna da-, ", time: 500 },
    { text: "I wanna dance in the lights\n", time: 1700},
    { text: "I wanna ro-, ", time: 4300 },
    { text: "I wanna rock ", time: 5500},
    { text: "your ", time: 6500 },
    { text: "body\n", time: 7200 },
    { text: "I wanna go, ", time: 8400 },
    { text: "I wanna go ", time: 9200},
    { text: "for a ride\n", time: 10000},
    { text: "Hop in the music ", time: 12100 },
    { text: "and rock ", time: 13500 },
    { text: "your ", time: 14200 },
    { text: "body right\n", time: 15000 },
    { text: "Rock that body, ", time: 15800 },
    { text: "come on, come on, ", time: 16800 },
    { text: "rock that body (rock your body)\n", time: 17900},
    { text: "Rock that body, ", time: 21500 },
    { text: "come on, come on, ", time: 23000},
    { text: "rock that body\n", time: 300000 },
    { text: "Rock that body, ", time: 30000},
    { text: "come on, come on, ", time: 30000 },
    { text: "rock that body (rock your body)\n", time: 30000 },
    { text: "Rock that body, ", time: 30000 },
    { text: "come on, come on, ", time: 30000},
    { text: "rock that body\n", time: 30000 }
];

const div = document.getElementById('lyrics');

fragments.forEach(fragment => {
    setTimeout(() => {
        let i = 0;
        function escribirChar() {
            if (i < fragment.text.length) {
                div.textContent += fragment.text.charAt(i);
                i++;
                setTimeout(escribirChar, 50); 
            }
        }
        escribirChar();
    }, fragment.time);
});
