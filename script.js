let caps = 0;
let missionsDone = [false, false, false, false, false, false, false, false, false, false];

const dialogSteps = [
    // 0 – Старт
    {
        text: "Старейшина: Рыцарь Илья, Братство перехватило неизвестный сигнал. Нам нужен разведчик.",
        options: ["Принять задание", "Спросить подробности"]
    },
    {
        text: "Старейшина: Источник сигнала в секторе твоих апартаментов. Первым делом пройди физподготовку и получи сухпаёк.",
        options: ["Начать подготовку", "Уточнить детали"]
    }
];

let currentDialog = 0;

function completeMission(idx, reward = 0) {
    if (missionsDone[idx]) return;
    missionsDone[idx] = true;
    caps += reward;
    document.getElementById('caps-counter').innerText = caps;
    const missionElem = document.querySelector(`li[data-mission="${idx}"]`);
    if (missionElem) missionElem.innerHTML = '✅ ' + missionElem.innerText.slice(2);
}

function updateUI() {
    if (missionsDone[0]) document.querySelector('[data-mission="0"]').innerHTML = '✅ ПРОЛОГ: Прибытие в штаб';
    if (missionsDone[1]) document.querySelector('[data-mission="1"]').innerHTML = '✅ ФИЗПОДГОТОВКА: Норматив Братства';
    if (missionsDone[2]) document.querySelector('[data-mission="2"]').innerHTML = '✅ СУХПАЁК: Восстановить силы';
}

function loadDialog(step) {
    const d = dialogSteps[step];
    if (!d) return;
    document.getElementById('dialog-text').innerText = d.text;
    const btnsDiv = document.getElementById('response-buttons');
    btnsDiv.innerHTML = '';
    d.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (step === 0 && opt === "Принять задание") {
                completeMission(0, 10);
                loadDialog(1);
            } else if (step === 1 && opt === "Начать подготовку") {
                document.getElementById('dialog-text').innerText = "Старейшина: Отлично. К выполнению норматива приступить!";
                btnsDiv.innerHTML = '<button class="response-btn" id="completeFiz">✅ Выполнил физподготовку</button>';
                document.getElementById('completeFiz').onclick = () => {
                    completeMission(1, 20);
                    document.getElementById('dialog-text').innerText = "Старейшина: Хорошо. Теперь сухпаёк. Восстанови силы.";
                    btnsDiv.innerHTML = '<button class="response-btn" id="completeFood">🍗 Съесть сухпаёк</button>';
                    document.getElementById('completeFood').onclick = () => {
                        completeMission(2, 20);
                        document.getElementById('dialog-text').innerText = "Старейшина: Готов. Остальные задания открыты. Ad Victoriam!";
                        btnsDiv.innerHTML = '<button class="response-btn" disabled>Миссия продолжается</button>';
                    };
                };
            } else {
                loadDialog(step + 1);
            }
        };
        btnsDiv.appendChild(btn);
    });
}

document.getElementById('pipboy-btn').onclick = () => {
    document.getElementById('pipboy-modal').classList.remove('hidden');
};
document.querySelector('.close-pipboy').onclick = () => {
    document.getElementById('pipboy-modal').classList.add('hidden');
};

document.querySelectorAll('.tablink').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tablink').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tabcontent').forEach(tab => tab.classList.remove('active'));
        document.getElementById(btn.dataset.tab).classList.add('active');
    };
});

document.querySelectorAll('.map-location').forEach(loc => {
    loc.onclick = () => alert(`📍 Локация: ${loc.innerText}\n⚡ Задание появится после физподготовки и сухпайка.`);
});

loadDialog(0);
updateUI();
