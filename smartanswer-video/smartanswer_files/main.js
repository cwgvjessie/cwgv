// Feedback Buttons Selection Control
function handleFeedbackSelection(clickedBtn) {
    // 檢查目前點擊的按鈕是否已經是 active 狀態
    const isActive = clickedBtn.classList.contains('active');

    // 找到所有的 feedback 按鈕
    const btns = document.querySelectorAll('.feedback-btn:not([onclick="toggleFeedbackForm()"])');

    // 先移除所有按鈕的 active 狀態
    btns.forEach(btn => btn.classList.remove('active'));

    // 如果原本不是 active，才幫它加上 active (如果是的話，上面已經被移除了，就等於取消選取)
    if (!isActive) {
        clickedBtn.classList.add('active');
    }
}

function toggleArticles() {
    const allExtraArticles = document.querySelectorAll('.article-list li:nth-child(n+4)');
    const btn = document.querySelector('.show-all-btn');
    const target = document.querySelector('.article-recommend');

    if (allExtraArticles.length === 0) return;

    const isHidden = allExtraArticles[0].classList.contains('hidden-article');

    allExtraArticles.forEach(article => {
        if (isHidden) {
            article.classList.remove('hidden-article');
        } else {
            article.classList.add('hidden-article');
        }
    });

    if (!isHidden && target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    btn.textContent = isHidden ? '收起' : '顯示全部';
}

// Inline Form Control Functions
function toggleFeedbackForm() {
    const form = document.getElementById('inline-feedback-form');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        // 可選：展開時自動聚焦到 textarea 或 email 方便使用者輸入
        setTimeout(() => {
            document.getElementById('feedback-text').focus();
        }, 300);
    } else {
        form.classList.add('hidden');
        document.getElementById('feedback-text').value = ''; // 關閉時清空內容
        document.getElementById('feedback-email').value = ''; // 關閉時清空 email
    }
}

function submitFeedback(event) {
    if (event) event.preventDefault(); // 防止表單真正送出刷新頁面

    // 這裡可以加入打 API 回報的情境，目前先模擬成功
    alert('感謝您提供的寶貴意見！');
    toggleFeedbackForm();
}

/* AI Loading 畫面控制 */
window.addEventListener('load', function () {
    /* 1. 隱藏全域載入器 */
    const globalLoader = document.getElementById('ai-loader');
    const localizedLoader = document.getElementById('localized-loader');
    const answerContents = document.querySelectorAll('.content-hidden');

    setTimeout(function () {
        if (globalLoader) {
            globalLoader.classList.add('hidden');

            /* 2. 全域隱藏後，啟動局部載入計時 (3秒) */
            if (localizedLoader) {
                setTimeout(function () {
                    localizedLoader.style.opacity = '0';
                    setTimeout(() => {
                        localizedLoader.classList.add('hidden');

                        /* 3. 顯示文章內容 */
                        answerContents.forEach(el => {
                            el.classList.add('content-visible');
                        });
                    }, 500);
                }, 3000);
            } else {
                /* 若無局部載入，直接顯示文章內容 */
                answerContents.forEach(el => {
                    el.classList.add('content-visible');
                });
            }

            /* 移除全域載入器 DOM */
            setTimeout(function () {
                globalLoader.remove();
            }, 800);
        }
    }, 500);
});
