let caps = 0;
let missionsCompleted = 0;

const dialogState = {
    currentStep: 0,
    steps: [
        {
            text: "Старейшина: Рыцарь Илья, Братство перехватило сигнал...",
            options: ["Принять задание", "Спросить подробности"]
        },
        {
            text: "Старейшина: Источник сигнала в секторе...",
            options: ["Выдвигаюсь", "Нужно больше информации"]
        }
        // Здесь можно добавить сколько угодно шагов диалога
    ]
};

function updateCapsUI() {
    document.getElementById('caps-counter').innerText = caps;
}

function completeMission(missionId) {
    const missionElem = document.querySelector(`li[data-mission="${missionId}"]`);
    if (missionElem && missionElem.innerText[0] !== '✅') {
        missionElem.innerHTML = '✅ ' + missionElem.innerText.slice(2);
        missionsCompleted++;
        if (missionId == 2) caps += 20;
        if (missionId == 3) caps += 30;
        updateCapsUI();
    }
}

function loadDialogStep(stepIndex) {
    const step = dialogState.steps[stepIndex];
    if (!step) return;
    document.getElementById('dialog-text').innerText = step.text;
    const container = document.getElementById('response-buttons');
    container.innerHTML = '';
    step.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (stepIndex + 1 < dialogState.steps.length) {
                loadDialogStep(stepIndex + 1);
            } else {
                document.getElementById('dialog-text').innerText = "Старейшина: Миссия началась. Ad Victoriam.";
                container.innerHTML = '<button class="response-btn" disabled>Ожидание...</button>';
                completeMission(0);
            }
        };
        container.appendChild(btn);
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
    loc.onclick = () => {
        alert(`📍 Локация: ${loc.innerText}\n🚧 Задание появится в следующей версии`);
    };
});

loadDialogStep(0);
updateCapsUI();
