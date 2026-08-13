(function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const htmlElement = document.documentElement;
    const storageKey = 'portfolio-theme';

    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeSwitch.checked = true;
        } else {
            htmlElement.removeAttribute('data-theme');
            themeSwitch.checked = false;
        }
        localStorage.setItem(storageKey, theme);
    }

    function toggleTheme() {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    }

    // Load saved or system preference
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    themeSwitch.addEventListener('change', toggleTheme);

    // ── Profile image from assets ──────────────
    const profileImg = document.getElementById('profileImage');
    if (profileImg) {
        // TODO: Replace with your actual profile image path
        // profileImg.src = 'assets/profile.jpg';
        // profileImg.src = 'assets/profile.webp';
        // profileImg.src = 'assets/profile.png';
        console.log('Profile image loaded from assets');
    }

    // ── Blog pagination ────────────────────────
    const blogItems = document.querySelectorAll('.blog-list li');
    const blogPagination = document.getElementById('blogPagination');
    const perPage = 10;

    if (blogItems.length && blogPagination) {
        const pageCount = Math.ceil(blogItems.length / perPage);
        let currentPage = 1;

        function renderBlogPage(page) {
            currentPage = page;
            blogItems.forEach((item, i) => {
                const pageNum = Math.floor(i / perPage) + 1;
                item.style.display = (pageNum === page) ? '' : 'none';
            });
            renderPaginationButtons();
        }

        function renderPaginationButtons() {
            let html = '<button class="page-prev" data-page="prev" aria-label="Previous page">‹</button>';
            for (let i = 1; i <= pageCount; i++) {
                const active = i === currentPage ? ' active' : '';
                html += `<button class="page-num${active}" data-page="${i}">${i}</button>`;
            }
            html += '<button class="page-next" data-page="next" aria-label="Next page">›</button>';
            blogPagination.innerHTML = html;

            const prevBtn = blogPagination.querySelector('.page-prev');
            const nextBtn = blogPagination.querySelector('.page-next');
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === pageCount;
        }

        blogPagination.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const target = btn.getAttribute('data-page');
            let next = currentPage;
            if (target === 'prev') next = currentPage - 1;
            else if (target === 'next') next = currentPage + 1;
            else next = parseInt(target, 10);
            if (next >= 1 && next <= pageCount) renderBlogPage(next);
        });

        renderBlogPage(1);
    }

    // ── Mobile menu ──────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const overlay = document.getElementById('overlay');
    const navList = mainNav.querySelector('ul');
    const navLinks = document.querySelectorAll('nav a:not(.switch-item a)');
    const sections = document.querySelectorAll('section[id]');

    function closeMenu() {
        navList.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    function openMenu() {
        navList.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    menuToggle.addEventListener('click', () => {
        navList.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 640) closeMenu();
        });
    });

    function updateActiveLink() {
        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) currentId = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) link.classList.add('active');
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('open')) closeMenu();
    });
})();
