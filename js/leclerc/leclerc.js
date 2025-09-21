// Leclerc interactions: drag & drop fruits onto the balance plate (desktop + mobile)
// Keep everything in DOMContentLoaded and guard with null-checks per project conventions.

document.addEventListener('DOMContentLoaded', () => {
	const root = document.getElementById('leclerc');
	if (!root) return;

	const fruits = Array.from(root.querySelectorAll('.fruit-item'));
	const plate = root.querySelector('.balance-plate.dropzone');
	const readoutExp = root.querySelector('.balance-experience');
		const ticket = root.querySelector('.ticket');
	const ticketTitle = root.querySelector('.ticket-experience-title');
	const ticketText = root.querySelector('.ticket-experience-text');
	const ticketDate = root.querySelector('.ticket-date');

	if (!plate || fruits.length === 0 || !ticket || !readoutExp || !ticketTitle || !ticketText || !ticketDate) {
		return;
	}

	// Utils
	const formatDate = (d = new Date()) => {
		const pad = (n) => String(n).padStart(2, '0');
		return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
	};

	const highlightPlate = (on) => {
		plate.classList.toggle('is-over', !!on);
		// Inline hint in case CSS isn't present for .is-over
		plate.style.outline = on ? '2px dashed var(--leclerc-accent)' : '';
		plate.style.outlineOffset = on ? '2px' : '';
	};

		const printPulse = () => {
		ticket.classList.remove('is-printing');
		// Force reflow to restart CSS animation if any
		// eslint-disable-next-line no-unused-expressions
		void ticket.offsetWidth;
		ticket.classList.add('is-printing');
		// Remove class after animation duration (fallback 900ms)
		setTimeout(() => ticket.classList.remove('is-printing'), 1000);
	};

		const renderPlateEmoji = (emoji) => {
			// Remove previous visuals
			plate.querySelectorAll('.plate-emoji').forEach((n) => n.remove());
			if (!emoji) return;
			const el = document.createElement('div');
			el.className = 'plate-emoji';
			el.textContent = emoji;
			plate.appendChild(el);
		};

		const updateExperience = (name, text, emoji) => {
		if (name) readoutExp.textContent = name;
		if (name) ticketTitle.textContent = name;
		if (text) ticketText.textContent = text;
		ticketDate.textContent = formatDate();
			renderPlateEmoji(emoji);
		printPulse();
	};

	// ----------------------------
	// Desktop: HTML5 Drag & Drop
	// ----------------------------
	fruits.forEach((item) => {
			item.addEventListener('dragstart', (e) => {
			try {
				const payload = {
					name: item.dataset.expName,
					text: item.dataset.expText,
						emoji: item.querySelector('.fruit-emoji')?.textContent || '🥑',
				};
				e.dataTransfer?.setData('text/plain', JSON.stringify(payload));
				e.dataTransfer?.setDragImage?.(item, item.clientWidth / 2, item.clientHeight / 2);
				if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copyMove';
			} catch {}
			item.classList.add('dragging');
		});
		item.addEventListener('dragend', () => {
			item.classList.remove('dragging');
			highlightPlate(false);
		});

		// Click/Enter fallback: treat as a quick drop
			item.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
				const emoji = item.querySelector('.fruit-emoji')?.textContent;
				updateExperience(item.dataset.expName, item.dataset.expText, emoji);
			highlightPlate(false);
		});
		item.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
					const emoji = item.querySelector('.fruit-emoji')?.textContent;
					updateExperience(item.dataset.expName, item.dataset.expText, emoji);
				highlightPlate(false);
			}
		});
	});

	plate.addEventListener('dragover', (e) => {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
		highlightPlate(true);
	});
	plate.addEventListener('dragenter', () => highlightPlate(true));
	plate.addEventListener('dragleave', () => highlightPlate(false));
		plate.addEventListener('drop', (e) => {
		e.preventDefault();
		let payload;
		try {
			const txt = e.dataTransfer?.getData('text/plain');
			if (txt) payload = JSON.parse(txt);
		} catch {}
		if (!payload) {
			const dragging = root.querySelector('.fruit-item.dragging');
				if (dragging) payload = { name: dragging.dataset.expName, text: dragging.dataset.expText, emoji: dragging.querySelector('.fruit-emoji')?.textContent };
		}
			if (payload && payload.name) updateExperience(payload.name, payload.text, payload.emoji);
		highlightPlate(false);
	});

	// -----------------------------------
	// Mobile/Touch: Pointer-based dragging
	// -----------------------------------
	const supportsPointer = !!window.PointerEvent;

	// Guards to prevent text selection and pull-to-refresh while dragging
	let activeDragGuardsCleanup = null;
	const beginGlobalDragGuards = () => {
		if (activeDragGuardsCleanup) return; // already active
		const prev = {
			bodyUserSelect: document.body.style.userSelect,
			bodyWebkitUserSelect: document.body.style.webkitUserSelect,
			rootTouchAction: root.style.touchAction,
			rootOverscrollY: root.style.overscrollBehaviorY,
			rootOverscrollX: root.style.overscrollBehaviorX,
		};
		const preventScroll = (ev) => ev.preventDefault();
		window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
		document.body.style.userSelect = 'none';
		document.body.style.webkitUserSelect = 'none';
		root.style.touchAction = 'none';
		root.style.overscrollBehaviorY = 'contain';
		root.style.overscrollBehaviorX = 'contain';

		// Intercept horizontal slide handlers on the main content slider while dragging
		const contentSlider = document.querySelector('.content-slider');
		const intercept = (ev) => {
			// Block main.js swipe logic and any other handlers
			try { ev.stopImmediatePropagation(); } catch {}
			try { ev.stopPropagation(); } catch {}
			try { ev.preventDefault(); } catch {}
		};
		if (contentSlider) {
			contentSlider.addEventListener('touchstart', intercept, { capture: true, passive: false });
			contentSlider.addEventListener('touchmove', intercept, { capture: true, passive: false });
			contentSlider.addEventListener('touchend', intercept, { capture: true, passive: false });
		}
		activeDragGuardsCleanup = () => {
			window.removeEventListener('touchmove', preventScroll, { capture: true });
			document.body.style.userSelect = prev.bodyUserSelect;
			document.body.style.webkitUserSelect = prev.bodyWebkitUserSelect;
			root.style.touchAction = prev.rootTouchAction;
			root.style.overscrollBehaviorY = prev.rootOverscrollY;
			root.style.overscrollBehaviorX = prev.rootOverscrollX;
			if (contentSlider) {
				contentSlider.removeEventListener('touchstart', intercept, { capture: true });
				contentSlider.removeEventListener('touchmove', intercept, { capture: true });
				contentSlider.removeEventListener('touchend', intercept, { capture: true });
			}
			activeDragGuardsCleanup = null;
		};
	};

	const endGlobalDragGuards = () => {
		if (activeDragGuardsCleanup) activeDragGuardsCleanup();
	};

	const startPointerDrag = (item, e) => {
		// Only custom-drag on touch/pen to avoid conflicting with native mouse DnD
		if (e.pointerType === 'mouse') return;
		// Prevent scroll/swipe while dragging
		e.preventDefault();
		e.stopPropagation();
		item.setPointerCapture?.(e.pointerId);
		beginGlobalDragGuards();
		item.classList.add('dragging');
		// Avoid native gestures on the dragged element itself
		item.style.touchAction = 'none';
		// Subtle feedback on the source item
		try { item.style.transform = 'scale(1.05)'; } catch {}

		const rect = item.getBoundingClientRect();
		const ghost = document.createElement('div');
		ghost.textContent = item.querySelector('.fruit-emoji')?.textContent || '🥑';
		ghost.style.position = 'fixed';
		ghost.style.left = `${e.clientX - rect.width / 2}px`;
		ghost.style.top = `${e.clientY - rect.height / 2}px`;
		// Make the ghost larger than the source fruit for clearer feedback under the finger
		ghost.style.fontSize = Math.max(rect.width, 44) * 1.35 + 'px';
		ghost.style.lineHeight = '1';
		ghost.style.transform = 'translate(-50%, -50%) scale(0.92)';
		ghost.style.transition = 'transform 120ms ease-out, opacity 120ms ease-out';
		ghost.style.willChange = 'transform';
		ghost.style.pointerEvents = 'none';
		ghost.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))';
		ghost.style.zIndex = '9999';
		document.body.appendChild(ghost);
		// Animate in to a slightly larger scale
		requestAnimationFrame(() => {
			ghost.style.transform = 'translate(-50%, -50%) scale(1.18)';
		});

		const overPlate = (x, y) => {
			const p = plate.getBoundingClientRect();
			return x >= p.left && x <= p.right && y >= p.top && y <= p.bottom;
		};

		const move = (ev) => {
			const x = ev.clientX;
			const y = ev.clientY;
			ghost.style.left = `${x}px`;
			ghost.style.top = `${y}px`;
			highlightPlate(overPlate(x, y));
			ev.preventDefault();
			ev.stopPropagation();
		};

			const end = (ev) => {
			const x = ev.clientX;
			const y = ev.clientY;
			if (overPlate(x, y)) {
					const emoji = item.querySelector('.fruit-emoji')?.textContent;
					updateExperience(item.dataset.expName, item.dataset.expText, emoji);
			}
			cleanup();
			ev.preventDefault();
			ev.stopPropagation();
		};

		const cancel = (ev) => {
			cleanup();
			ev.preventDefault();
			ev.stopPropagation();
		};

		const cleanup = () => {
			highlightPlate(false);
			ghost.remove();
			item.releasePointerCapture?.(e.pointerId);
			item.removeEventListener('pointermove', move, true);
			item.removeEventListener('pointerup', end, true);
			item.removeEventListener('pointercancel', cancel, true);
			// Restore guards and visuals
			endGlobalDragGuards();
			item.classList.remove('dragging');
			try { item.style.transform = ''; } catch {}
			item.style.touchAction = '';
		};

		item.addEventListener('pointermove', move, true);
		item.addEventListener('pointerup', end, true);
		item.addEventListener('pointercancel', cancel, true);
	};

	if (supportsPointer) {
		fruits.forEach((item) => {
			item.addEventListener('pointerdown', (e) => startPointerDrag(item, e));
		});
	}
});

