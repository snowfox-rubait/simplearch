// ==========================================================================
// SimpleArch Pre-Installation Guide — Pure Dark Mode Controller
// Handles Step Navigation, Modal Lightbox, Keyboard Shortcuts, Drawers
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const totalSteps = 10;
  let currentStep = 1;

  const stepPages = document.querySelectorAll('.step-page');
  const progressSegments = document.querySelectorAll('.progress-bar-seg');
  const activeCrumb = document.getElementById('active-crumb');
  const stepDropdown = document.getElementById('step-dropdown');

  const modal = document.getElementById('media-modal');
  const modalImage = document.getElementById('modal-image');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  const stepNames = [
    "Introduction & ISO Boot",
    "Locales, Mirrors & Multilib",
    "Disk, Btrfs & Encryption",
    "Swap on zram",
    "Bootloader & Splash",
    "Kernel Selection",
    "Hostname & Security",
    "Profile Selection",
    "Network & Applications",
    "Install & Reboot"
  ];

  // 1. Navigation Functions
  function goToStep(stepNumber) {
    if (stepNumber < 1) stepNumber = 1;
    if (stepNumber > totalSteps) stepNumber = totalSteps;

    currentStep = stepNumber;
    window.location.hash = `step-${stepNumber}`;

    // Update active page
    stepPages.forEach((page) => {
      page.classList.remove('active-step');
      if (parseInt(page.dataset.stepIndex, 10) === currentStep) {
        page.classList.add('active-step');
      }
    });

    // Update progress bar
    progressSegments.forEach((seg, idx) => {
      seg.classList.remove('active', 'completed');
      if (idx + 1 < currentStep) {
        seg.classList.add('completed');
      } else if (idx + 1 === currentStep) {
        seg.classList.add('active');
      }
    });

    // Update breadcrumb and dropdown
    if (activeCrumb) {
      activeCrumb.textContent = stepNames[currentStep - 1];
    }
    if (stepDropdown) {
      stepDropdown.value = currentStep.toString();
    }

    // Scroll to top of step
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // 2. Hash Change & Initial Load
  function syncWithHash() {
    const hash = window.location.hash;
    const match = hash.match(/step-(\d+)/);
    if (match) {
      const step = parseInt(match[1], 10);
      goToStep(step);
    } else {
      goToStep(1);
    }
  }

  window.addEventListener('hashchange', syncWithHash);

  // 3. Click Handlers for Navigation Buttons
  document.querySelectorAll('[data-nav-step]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetStep = parseInt(btn.dataset.navStep, 10);
      goToStep(targetStep);
    });
  });

  // 4. Progress Segments click
  progressSegments.forEach((seg, idx) => {
    seg.addEventListener('click', () => {
      goToStep(idx + 1);
    });
  });

  // 5. Dropdown change
  if (stepDropdown) {
    stepDropdown.addEventListener('change', (e) => {
      goToStep(parseInt(e.target.value, 10));
    });
  }

  // 6. Keyboard Shortcuts (Vim j/k, Arrows)
  document.addEventListener('keydown', (e) => {
    // If modal is open, only close it on Escape
    if (modal.classList.contains('is-active')) {
      if (e.key === 'Escape') closeModal();
      return;
    }

    // Don't trigger shortcuts if focus is in an input or select
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'j') {
      if (currentStep < totalSteps) goToStep(currentStep + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'k') {
      if (currentStep > 1) goToStep(currentStep - 1);
    }
  });

  // 7. Modal Lightbox
  function openModal(src, caption) {
    modalImage.src = src;
    modalText.textContent = caption || 'Archinstall Terminal View';
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Attach modal zoom to all screenshot elements
  document.querySelectorAll('.terminal-shot, .comp-media, .drawer-item').forEach((box) => {
    box.addEventListener('click', () => {
      const img = box.querySelector('img');
      if (img) {
        const caption = box.getAttribute('data-caption') || img.alt;
        openModal(img.src, caption);
      }
    });
  });

  // 8. Expandable Drawers (DE bundles & Drivers)
  document.querySelectorAll('.drawer-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-drawer-target');
      const content = document.getElementById(targetId);
      const chevron = toggle.querySelector('.drawer-chevron');
      if (content) {
        const isOpen = content.classList.toggle('is-open');
        if (chevron) {
          chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });

  // 9. Copy Command Snippets
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const codeElement = document.getElementById(targetId);
      if (codeElement) {
        navigator.clipboard.writeText(codeElement.textContent.trim()).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = original; }, 1500);
        });
      }
    });
  });

  // Initialize
  syncWithHash();
});
