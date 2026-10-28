// ==========================================================================
// SimpleArch Guide — Interactive Wireframe Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btnWireframe = document.getElementById('btn-wireframe');
  const btnLive = document.getElementById('btn-live');
  const btnTheme = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('theme-icon');

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.querySelector('.modal-close');
  const btnPeekUki = document.getElementById('btn-peek-uki');

  // 1. Toggle Wireframe vs Live Media Mode
  btnWireframe.addEventListener('click', () => {
    body.classList.remove('mode-live');
    body.classList.add('mode-wireframe');
    btnWireframe.classList.add('active');
    btnLive.classList.remove('active');
  });

  btnLive.addEventListener('click', () => {
    body.classList.remove('mode-wireframe');
    body.classList.add('mode-live');
    btnLive.classList.add('active');
    btnWireframe.classList.remove('active');
  });

  // 2. Theme Toggle (Light / Dark)
  btnTheme.addEventListener('click', () => {
    const isDark = body.classList.toggle('theme-dark');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  });

  // 3. Image Lightbox for Inspection
  const openModal = (src, caption) => {
    modalImg.src = src;
    modalCaption.textContent = caption || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Click on media frames in live mode
  document.querySelectorAll('.media-frame, .comparison-media-slot').forEach((frame) => {
    frame.addEventListener('click', () => {
      if (body.classList.contains('mode-live')) {
        const img = frame.querySelector('.real-image');
        if (img) {
          const caption = frame.getAttribute('data-caption') || img.alt;
          openModal(img.src, caption);
        }
      }
    });
  });

  // UKI Peek button
  btnPeekUki.addEventListener('click', () => {
    openModal(
      'images/you can keep unified kernel images enabled, but for snapshot support, disable it.png',
      'Archinstall: Keep Unified Kernel Images (UKI) disabled to preserve Limine Btrfs snapshot rollback'
    );
  });

  // 4. Progress bar segment tooltips & mock navigation
  const stepTitles = [
    '1. Intro & ISO Boot',
    '2. Locales, Mirrors & Multilib',
    '3. Disk Partitioning, Encryption & Snapshots',
    '4. Swap on zram (zstd vs lz4)',
    '5. Bootloader & Plymouth Splash (Active)',
    '6. Kernel Strategy (Mainline + LTS)',
    '7. Hostname & User Security',
    '8. Profile Selection (Minimal Baseline)',
    '9. Audio, Network & Services',
    '10. Confirmation & Run'
  ];

  const activeStepLabel = document.getElementById('active-step-label');

  document.querySelectorAll('.segment').forEach((segment, idx) => {
    segment.addEventListener('click', () => {
      document.querySelectorAll('.segment').forEach((s, i) => {
        s.classList.remove('active');
        if (i < idx) {
          s.classList.add('completed');
        } else {
          s.classList.remove('completed');
        }
      });
      segment.classList.add('active');
      activeStepLabel.textContent = stepTitles[idx].split('. ')[1].split(' (')[0];
    });
  });
});
